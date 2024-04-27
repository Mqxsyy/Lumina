import Roact, { useEffect, useRef, useState } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { NodeGroups } from "API/NodeGroup";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { GetDraggingNodeId, NodeDraggingEnded, NodeDraggingStarted } from "Services/DraggingService";
import { BindNodeGroupFunction, NodeSystemData } from "Services/NodeSystemService";
import { GetNodeById, RemoveNode, UpdateNodeData } from "Services/NodesService";
import { StyleColors } from "Style";
import { GetZoomScale, ZoomScaleChanged } from "ZoomScale";
import Div from "../Div";
import {
	GROUP_BORDER_THICKNESS,
	GROUP_HEADER_HEIGHT,
	GROUP_LIST_PADDING,
	GROUP_PADDING,
	NODE_WIDTH,
	SYSTEM_BORDER_THICKNESS,
	SYSTEM_HEADER_HEIGHT,
	SYSTEM_LIST_PADDING,
	SYSTEM_PADDING,
	SYSTEM_WIDTH,
} from "../SizeConfig";

// TODO: add node reordering

interface Props {
	SystemId: number;
	NodeGroup: NodeGroups;
	GradientStart: Color3;
	GradientEnd: Color3;
	NodeSystem: NodeSystemData;
	SystemNodeGroupHeights: number[];
	BindSystemMove: (fn: (id: number) => void) => void;
	UpdateGroupSize: (number: number) => void;
}

export default function NodeGroup({
	SystemId,
	NodeGroup,
	GradientStart,
	GradientEnd,
	NodeSystem,
	SystemNodeGroupHeights,
	BindSystemMove,
	UpdateGroupSize,
}: Props) {
	const [zoomScale, setZoomScale] = useState(GetZoomScale());

	const containerSizeYExtraRef = useRef(0);

	const childNodesIdRef = useRef([] as number[]);
	const nodeDestroyConnectionsRef = useRef<{ [key: number]: RBXScriptConnection }>({});
	const isHovering = useRef(false);
	const isDestroyingRef = useRef(false);
	const nodeDragStartedConnectionRef = useRef<RBXScriptConnection>();
	const nodeDragEndedConnectionRef = useRef<RBXScriptConnection>();

	const overrideNodePosition = (id: number) => {
		const xOffset = (SYSTEM_WIDTH - NODE_WIDTH) * 0.5;
		let yOffset = getNodeOffsetY();

		const anchor = NodeSystem.anchorPoint;

		for (const childId of childNodesIdRef.current) {
			if (id === childId) break;

			const node = GetNodeById(childId)!;
			yOffset += node.data.element!.AbsoluteSize.Y + GROUP_LIST_PADDING;
		}

		const draggingNodeData = GetNodeById(id)!;
		const newAnchor = anchor.add(new Vector2(xOffset, yOffset));

		if (draggingNodeData.data.anchorPoint !== newAnchor) {
			UpdateNodeData(id, (data) => {
				data.anchorPoint = newAnchor;
				return data;
			});
		}
	};

	const onHover = () => {
		isHovering.current = true;

		const draggingNodeId = GetDraggingNodeId();
		if (draggingNodeId === undefined) {
			nodeDragStartedConnectionRef.current = NodeDraggingStarted.Connect((id) => {
				RunService.BindToRenderStep(`OverrideDraggingNodePosition${NodeGroup}`, 120, () => {
					overrideNodePosition(id);
				});
			});

			nodeDragEndedConnectionRef.current = NodeDraggingEnded.Connect(() => {
				RunService.UnbindFromRenderStep(`OverrideDraggingNodePosition${NodeGroup}`);
			});

			return;
		}

		const draggingNodeData = GetNodeById(draggingNodeId);
		if (draggingNodeData === undefined) return;

		if (draggingNodeData.data.node.nodeGroup !== NodeGroup) return;

		updateChildNodes(draggingNodeData.data.element!.AbsoluteSize.Y + 5);
		RunService.BindToRenderStep(`OverrideDraggingNodePosition${NodeGroup}`, 120, () => {
			overrideNodePosition(draggingNodeId);
		});
	};

	const onUnhover = () => {
		isHovering.current = false;

		nodeDragStartedConnectionRef.current?.Disconnect();
		nodeDragEndedConnectionRef.current?.Disconnect();
		RunService.UnbindFromRenderStep(`OverrideDraggingNodePosition${NodeGroup}`);

		const draggingNodeId = GetDraggingNodeId();
		if (draggingNodeId !== undefined) {
			const draggingNodeIndex = childNodesIdRef.current.findIndex((nodeId) => nodeId === draggingNodeId);
			if (draggingNodeIndex !== -1) {
				removeChildNode(draggingNodeId);
			}
		}

		updateChildNodes();
	};

	const getContainerSize = (ignoreId?: number) => {
		let containerSizeY = 0;

		for (const id of childNodesIdRef.current) {
			if (id === ignoreId) continue;

			const node = GetNodeById(id)!;
			containerSizeY += node.data.element!.AbsoluteSize.Y + GROUP_LIST_PADDING;
		}

		return containerSizeY + containerSizeYExtraRef.current;
	};

	const getContainerSizeUDim = () => {
		const containerSizeY = getContainerSize();
		return new UDim2(1, 0, 0, containerSizeY === 0 ? 0 : containerSizeY - GROUP_LIST_PADDING);
	};

	const addChildNode = (id: number) => {
		childNodesIdRef.current.push(id);

		const node = GetNodeById(id)!;
		node.data.node.ConnectToSystem(SystemId);
		NodeSystem.system.AddNode(node.data.node);

		nodeDestroyConnectionsRef.current[id] = node.data.onDestroy.Connect((nodeData) => {
			nodeDestroyConnectionsRef.current[id].Disconnect();
			delete nodeDestroyConnectionsRef.current[id];

			const destroyingNodeIndex = childNodesIdRef.current.findIndex((nodeId) => nodeId === id);
			NodeSystem.system.RemoveNode(nodeData.node);
			childNodesIdRef.current.remove(destroyingNodeIndex);

			if (isDestroyingRef.current) return;
			updateChildNodes();
		});

		updateChildNodes(0);
	};

	const removeChildNode = (id: number) => {
		const draggingNodeIndex = childNodesIdRef.current.findIndex((nodeId) => nodeId === id);
		childNodesIdRef.current.remove(draggingNodeIndex);

		const node = GetNodeById(id)!;
		node.data.node.RemoveSystemConnection();
		NodeSystem.system.RemoveNode(node.data.node);

		if (nodeDestroyConnectionsRef.current[id] !== undefined) {
			nodeDestroyConnectionsRef.current[id].Disconnect();
			delete nodeDestroyConnectionsRef.current[id];
		}

		updateChildNodes();
	};

	const getNodeOffsetY = () => {
		// absolute size addition, ew
		// but can't figure out a better way without update delays
		let yOffset =
			SYSTEM_HEADER_HEIGHT +
			SYSTEM_PADDING +
			SYSTEM_LIST_PADDING +
			SYSTEM_BORDER_THICKNESS +
			GROUP_BORDER_THICKNESS +
			GROUP_PADDING +
			GROUP_HEADER_HEIGHT +
			GROUP_LIST_PADDING;

		for (let i = 0; i < NodeGroup; i++) {
			yOffset +=
				SystemNodeGroupHeights[i] +
				GROUP_PADDING * 2 +
				GROUP_BORDER_THICKNESS * 2 +
				SYSTEM_LIST_PADDING +
				GROUP_HEADER_HEIGHT;

			let extra = 0;
			if (SystemNodeGroupHeights[i] === 0) {
				extra = GROUP_LIST_PADDING;

				if (NodeGroup === i) {
					if (childNodesIdRef.current.size() !== 0) {
						extra = 0;
					}
				}
			}

			yOffset += extra;
		}

		return yOffset;
	};

	const updateChildNodes = (add?: number) => {
		if (SystemNodeGroupHeights.size() !== 4) return;

		if (add !== undefined) {
			containerSizeYExtraRef.current = add;
		}

		UpdateGroupSize(getContainerSize());

		const xOffset = (SYSTEM_WIDTH - NODE_WIDTH) * 0.5;
		let yOffset = getNodeOffsetY();

		const anchor = NodeSystem.anchorPoint;

		for (const id of childNodesIdRef.current) {
			const newNodeAnchor = anchor.add(new Vector2(xOffset, yOffset));
			const node = GetNodeById(id)!;

			if (node.data.anchorPoint !== newNodeAnchor) {
				UpdateNodeData(id, (data) => {
					data.anchorPoint = newNodeAnchor;
					return data;
				});
			}

			yOffset += node.data.element!.AbsoluteSize.Y + GROUP_LIST_PADDING;
		}
	};

	useEffect(() => {
		updateChildNodes();
	}, [SystemNodeGroupHeights[0], SystemNodeGroupHeights[1], SystemNodeGroupHeights[2], SystemNodeGroupHeights[3]]);

	useEffect(() => {
		const dragConnection = NodeDraggingEnded.Connect((id) => {
			if (isHovering.current) {
				const draggingNodeIndex = childNodesIdRef.current.findIndex((nodeId) => nodeId === id);
				if (draggingNodeIndex !== -1) return;

				const draggingNodeData = GetNodeById(id);
				if (draggingNodeData === undefined) return;

				if (draggingNodeData.data.node.nodeGroup !== NodeGroup) return;

				RunService.UnbindFromRenderStep(`OverrideDraggingNodePosition${NodeGroup}`);
				addChildNode(id);
			}
		});

		const zoomConnection = ZoomScaleChanged.Connect((zoomScale) => {
			setZoomScale(zoomScale as number);
		});

		const destroyConnection = NodeSystem.onDestroy.Connect(() => {
			destroyConnection.Disconnect();
			isDestroyingRef.current = true;
			childNodesIdRef.current.forEach((id) => {
				RemoveNode(id);
			});
		});

		BindNodeGroupFunction(SystemId, NodeGroup, addChildNode);

		BindSystemMove(() => {
			updateChildNodes();
		});

		UpdateGroupSize(getContainerSize());

		return () => {
			dragConnection.Disconnect();
			zoomConnection.Disconnect();
			destroyConnection.Disconnect();
		};
	}, []);

	return (
		<Div Size={UDim2.fromScale(1, 0)} AutomaticSize={"Y"} onHover={onHover} onUnhover={onUnhover}>
			<Div Size={UDim2.fromScale(1, 0)} AutomaticSize={"Y"}>
				<uipadding
					PaddingLeft={new UDim(0, GROUP_BORDER_THICKNESS * zoomScale)}
					PaddingRight={new UDim(0, GROUP_BORDER_THICKNESS * zoomScale)}
					PaddingTop={new UDim(0, GROUP_BORDER_THICKNESS * zoomScale)}
					PaddingBottom={new UDim(0, GROUP_BORDER_THICKNESS * zoomScale)}
				/>

				<Div Size={UDim2.fromScale(1, 0)} AutomaticSize={"Y"}>
					<uicorner CornerRadius={new UDim(0, 5 * zoomScale)} />
					<uilistlayout
						Padding={new UDim(0, GROUP_LIST_PADDING * zoomScale)}
						HorizontalAlignment={"Center"}
					/>
					<uistroke
						Color={StyleColors.FullWhite}
						Thickness={GROUP_BORDER_THICKNESS * zoomScale}
						Transparency={0.35}
					>
						<uigradient
							Rotation={90}
							Color={
								new ColorSequence([
									new ColorSequenceKeypoint(0, GradientStart),
									new ColorSequenceKeypoint(1, GradientEnd),
								])
							}
						/>
					</uistroke>
					<uipadding
						PaddingLeft={new UDim(0, GROUP_PADDING * zoomScale)}
						PaddingRight={new UDim(0, GROUP_PADDING * zoomScale)}
						PaddingTop={new UDim(0, GROUP_PADDING * zoomScale)}
						PaddingBottom={new UDim(0, GROUP_PADDING * zoomScale)}
					/>

					<BasicTextLabel
						Size={new UDim2(1, 0, 0, GROUP_HEADER_HEIGHT * zoomScale)}
						Text={NodeGroups[NodeGroup]}
					/>
					<Div Size={getContainerSizeUDim()} />
				</Div>
			</Div>
		</Div>
	);
}
