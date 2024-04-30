import Roact, { useEffect, useRef } from "@rbxts/roact";
import { NodeGroups } from "API/NodeGroup";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { GetDraggingNodeId } from "Services/DraggingService";
import { BindNodeGroupFunction, NodeSystemData, NodeSystemsChanged } from "Services/NodeSystemService";
import { GetNodeById, NodeCollectionEntry, RemoveNode } from "Services/NodesService";
import { StyleColors } from "Style";
import { GetZoomScale } from "ZoomScale";
import Div from "../Div";
import { GROUP_BORDER_THICKNESS, GROUP_HEADER_HEIGHT, GROUP_LIST_PADDING, GROUP_PADDING } from "../SizeConfig";

// TODO: add node reordering

interface Props {
	SystemId: number;
	NodeGroup: NodeGroups;
	GradientStart: Color3;
	GradientEnd: Color3;
	NodeSystem: NodeSystemData;
}

export default function NodeGroup({ SystemId, NodeGroup, GradientStart, GradientEnd, NodeSystem }: Props) {
	const childNodes = useRef([] as NodeCollectionEntry[]);
	const nodeDestroyConnectionsRef = useRef<{ [key: number]: RBXScriptConnection }>({});
	const isDestroyingRef = useRef(false);

	const zoomScale = GetZoomScale();

	const onHover = () => {
		const draggingNodeId = GetDraggingNodeId();
		if (draggingNodeId !== undefined) {
			addChildNode(draggingNodeId);
		}
	};

	const addChildNode = (id: number) => {
		const node = GetNodeById(id)!;

		if (node.data.node.nodeGroup !== NodeGroup) return;

		childNodes.current.push(node);

		node.data.node.ConnectToSystem(SystemId);
		NodeSystem.system.AddNode(node.data.node);

		nodeDestroyConnectionsRef.current[id] = node.data.onDestroy.Connect((nodeData) => {
			nodeDestroyConnectionsRef.current[id].Disconnect();
			delete nodeDestroyConnectionsRef.current[id];

			const destroyingNodeIndex = childNodes.current.findIndex((n) => n.data.node.id === id);
			NodeSystem.system.RemoveNode(nodeData.node);
			childNodes.current.remove(destroyingNodeIndex);
		});

		NodeSystemsChanged.Fire();
	};

	const onUnhover = () => {
		const draggingNodeId = GetDraggingNodeId();
		if (draggingNodeId !== undefined) {
			const draggingNodeIndex = childNodes.current.findIndex((n) => n.data.node.id === draggingNodeId);

			if (draggingNodeIndex !== -1) {
				const node = childNodes.current.remove(draggingNodeIndex)!;
				node.data.node.RemoveSystemConnection();
				NodeSystem.system.RemoveNode(node.data.node);

				if (nodeDestroyConnectionsRef.current[draggingNodeIndex] !== undefined) {
					nodeDestroyConnectionsRef.current[draggingNodeIndex].Disconnect();
					delete nodeDestroyConnectionsRef.current[draggingNodeIndex];
				}
			}
		}
	};

	useEffect(() => {
		const destroyConnection = NodeSystem.onDestroy.Connect(() => {
			destroyConnection.Disconnect();
			isDestroyingRef.current = true;
			childNodes.current.forEach((node) => {
				RemoveNode(node.data.node.id);
			});
		});

		BindNodeGroupFunction(SystemId, NodeGroup, addChildNode);

		return () => {
			for (const [_, connection] of pairs(nodeDestroyConnectionsRef.current)) {
				connection.Disconnect();
			}

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
					<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
						<uilistlayout HorizontalAlignment={"Center"} Padding={new UDim(0, 5)} />
						{childNodes.current.map((node) => {
							return node.create(node.data);
						})}
					</Div>
				</Div>
			</Div>
		</Div>
	);
}
