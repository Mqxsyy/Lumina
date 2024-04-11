import Roact, { useEffect, useRef, useState } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { NodeGroups } from "API/NodeGroup";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { GetCanvas } from "Events";
import { GetDraggingNodeId, NodeDraggingEnded } from "Services/DraggingService";
import { BindNodeGroupFunction, NodeSystemData } from "Services/NodeSystemService";
import { GetNodeById, UpdateNodeAnchorPoint } from "Services/NodesService";
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

// TODO: rework adding and removing, allow for reordering

interface Props {
	SystemId: number;
	NodeGroup: NodeGroups;
	GradientStart: Color3;
	GradientEnd: Color3;
	NodeSystem: NodeSystemData;
	SystemNodeGroups: Frame[];
	BindSystemMove: (fn: (id: number) => void) => void;
	BindSystemFrame: (frame: Frame) => void;
}

export default function NodeGroup({
	SystemId,
	NodeGroup,
	GradientStart,
	GradientEnd,
	NodeSystem,
	SystemNodeGroups,
	BindSystemMove,
	BindSystemFrame,
}: Props) {
	const [zoomScale, setZoomScale] = useState(GetZoomScale());
	const [childContainerSize, setChildContainerSize] = useState(new UDim2(1, 0, 0, 0));

	const childNodesIdRef = useRef([] as number[]);
	const isHovering = useRef(false);

	const groupFrameRef = useRef<Frame>();

	const onHover = () => {
		isHovering.current = true;

		const draggingNodeId = GetDraggingNodeId();
		if (draggingNodeId === undefined) return;

		const draggingNodeData = GetNodeById(draggingNodeId);
		if (draggingNodeData === undefined) return;

		if (draggingNodeData.data.node.nodeGroup !== NodeGroup) return;

		RunService.BindToRenderStep(`OverrideDraggingNodePosition${NodeGroup}`, 120, () => {
			updateChildNodes();

			const containerSize = getContainerSize(draggingNodeId);
			setChildContainerSize(new UDim2(1, 0, 0, containerSize + draggingNodeData.data.element!.AbsoluteSize.Y));

			const xOffset = (groupFrameRef.current!.AbsoluteSize.X - 250) * 0.5;
			const yOffset = 20 + 10 + containerSize;

			const canvasFrame = GetCanvas.Invoke() as Frame;
			const canvasPos = new Vector2(canvasFrame.AbsolutePosition.X, canvasFrame.AbsolutePosition.Y);

			const offset = new Vector2(xOffset, yOffset);
			UpdateNodeAnchorPoint(draggingNodeId, groupFrameRef.current!.AbsolutePosition.add(offset).sub(canvasPos));
		});
	};

	const onUnhover = () => {
		isHovering.current = false;

		RunService.UnbindFromRenderStep(`OverrideDraggingNodePosition${NodeGroup}`);

		const draggingNodeId = GetDraggingNodeId();

		if (draggingNodeId !== undefined) {
			const draggingNodeIndex = childNodesIdRef.current.findIndex((nodeId) => nodeId === draggingNodeId);
			if (draggingNodeIndex !== -1) {
				childNodesIdRef.current.remove(draggingNodeIndex);
				NodeSystem.system.RemoveNode(GetNodeById(draggingNodeId)!.data.node);
			}
		}

		let containerSizeY = 0;
		childNodesIdRef.current.forEach((id) => {
			const node = GetNodeById(id)!;
			containerSizeY += node.data.element!.AbsoluteSize.Y + 5;
		});

		setChildContainerSize(new UDim2(1, 0, 0, containerSizeY === 0 ? 0 : containerSizeY - GROUP_LIST_PADDING));
		updateChildNodes();
	};

	const getContainerSize = (ignoreId?: number) => {
		let containerSizeY = 0;

		for (const id of childNodesIdRef.current) {
			if (id === ignoreId) continue;

			const node = GetNodeById(id)!;
			containerSizeY += node.data.element!.AbsoluteSize.Y + GROUP_LIST_PADDING;
		}

		return containerSizeY;
	};

	const addChildNode = (id: number) => {
		childNodesIdRef.current.push(id);

		const node = GetNodeById(id)!;
		NodeSystem.system.AddNode(node.data.node);

		let containerSizeY = 0;
		childNodesIdRef.current.forEach((childId) => {
			const node = GetNodeById(childId)!;
			containerSizeY += node.data.element!.AbsoluteSize.Y + 5;
		});

		setChildContainerSize(new UDim2(1, 0, 0, containerSizeY === 0 ? 0 : containerSizeY - 5));
		task.wait();

		updateChildNodes();
	};

	const removeChildNode = () => {};

	const updateChildNodes = () => {
		if (SystemNodeGroups.size() !== 4) return;

		const xOffset = (SYSTEM_WIDTH - NODE_WIDTH) * 0.5;

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
			yOffset += SystemNodeGroups[i].AbsoluteSize.Y + SYSTEM_LIST_PADDING;
		}

		const anchor = NodeSystem.anchorPoint;

		for (const id of childNodesIdRef.current) {
			const offset = new Vector2(xOffset, yOffset);
			UpdateNodeAnchorPoint(id, anchor.add(offset));

			const node = GetNodeById(id)!;
			yOffset += node.data.element!.AbsoluteSize.Y + GROUP_LIST_PADDING;
		}
	};

	useEffect(() => {
		if (groupFrameRef.current === undefined) return;
		BindSystemFrame(groupFrameRef.current);
	}, [groupFrameRef.current]);

	useEffect(() => {
		updateChildNodes();
	}, [SystemNodeGroups]);

	useEffect(() => {
		const dragConnection = NodeDraggingEnded.Connect((id) => {
			if (isHovering.current) {
				const draggingNodeIndex = childNodesIdRef.current.findIndex((nodeId) => nodeId === id);
				if (draggingNodeIndex !== -1) return;

				const draggingNodeData = GetNodeById(id);
				if (draggingNodeData === undefined) return;

				if (draggingNodeData.data.node.nodeGroup !== NodeGroup) return;

				childNodesIdRef.current.push(id);
				updateChildNodes();

				NodeSystem.system.AddNode(draggingNodeData.data.node);
			}
		});

		const zoomConnection = ZoomScaleChanged.Connect((zoomScale) => {
			setZoomScale(zoomScale as number);
		});

		BindNodeGroupFunction(SystemId, NodeGroup, addChildNode);

		BindSystemMove(() => {
			updateChildNodes();
		});

		return () => {
			dragConnection.Disconnect();
			zoomConnection.Disconnect();
		};
	}, []);

	return (
		<Div
			Size={UDim2.fromScale(1, 0)}
			AutomaticSize={"Y"}
			onHover={onHover}
			onUnhover={onUnhover}
			getFrame={(frame: Frame) => (groupFrameRef.current = frame)}
		>
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
					<Div Size={childContainerSize} />
				</Div>
			</Div>
		</Div>
	);
}
