import Roact, { useEffect, useRef, useState } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { NodeGroups } from "API/NodeGroup";
import { NodeSystem } from "API/NodeSystem";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { GetCanvas } from "Events";
import { GetDraggingNodeId, NodeDraggingEnded } from "Services/DraggingService";
import { BindNodeGroupFunction } from "Services/NodeSystemService";
import { GetNodeById, UpdateNodeAnchorPoint } from "Services/NodesService";
import { StyleColors } from "Style";
import { GetZoomScale, ZoomScaleChanged } from "ZoomScale";
import Div from "../Div";

const BORDER_THICKNESS = 2;

interface Props {
	SystemId: number;
	NodeGroup: NodeGroups;
	GradientStart: Color3;
	GradientEnd: Color3;
	NodeSystem: NodeSystem;
	NodeSystemPosition?: Vector2;
}

export default function NodeGroup({
	SystemId,
	NodeGroup,
	GradientStart,
	GradientEnd,
	NodeSystem,
	NodeSystemPosition,
}: Props) {
	const [zoomScale, setZoomScale] = useState(GetZoomScale());
	const [childContainerSize, setChildContainerSize] = useState(new UDim2(1, 0, 0, 0));

	const childNodesIdRef = useRef([] as number[]);
	const divRef = useRef(undefined as undefined | Frame);
	const isHovering = useRef(false);

	const getFrame = (frame: Frame) => {
		divRef.current = frame;
	};

	const onHover = () => {
		isHovering.current = true;

		RunService.BindToRenderStep(`OverrideDraggingNodePosition${NodeGroup}`, 120, () => {
			const draggingNodeId = GetDraggingNodeId();
			if (draggingNodeId === undefined) return;

			const draggingNodeData = GetNodeById(draggingNodeId);
			if (draggingNodeData === undefined) return;

			if (draggingNodeData.data.node.nodeGroup !== NodeGroup) return;

			UpdateChildNodes();

			const containerSize = GetContainerSize(draggingNodeId);
			setChildContainerSize(new UDim2(1, 0, 0, containerSize + draggingNodeData.data.element!.AbsoluteSize.Y));

			const xOffset = (divRef.current!.AbsoluteSize.X - 250) * 0.5;
			const yOffset = 20 + 10 + containerSize;

			const canvasFrame = GetCanvas.Invoke() as Frame;
			const canvasPos = new Vector2(canvasFrame.AbsolutePosition.X, canvasFrame.AbsolutePosition.Y);

			const offset = new Vector2(xOffset, yOffset);
			UpdateNodeAnchorPoint(draggingNodeId, divRef.current!.AbsolutePosition.add(offset).sub(canvasPos));
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
				NodeSystem.RemoveNode(GetNodeById(draggingNodeId)!.data.node);
			}
		}

		let containerSizeY = 0;
		childNodesIdRef.current.forEach((id) => {
			const node = GetNodeById(id)!;
			containerSizeY += node.data.element!.AbsoluteSize.Y + 5;
		});

		setChildContainerSize(new UDim2(1, 0, 0, containerSizeY === 0 ? 0 : containerSizeY - 5));
		UpdateChildNodes();
	};

	const GetContainerSize = (ignoreId?: number) => {
		let containerSizeY = 0;

		for (const id of childNodesIdRef.current) {
			if (id === ignoreId) continue;

			const node = GetNodeById(id)!;
			containerSizeY += node.data.element!.AbsoluteSize.Y + 5;
		}

		return containerSizeY;
	};

	const UpdateChildNodes = () => {
		const xOffset = (divRef.current!.AbsoluteSize.X - 250) * 0.5;
		let yOffset = 20 + 10;

		for (const id of childNodesIdRef.current) {
			const canvasFrame = GetCanvas.Invoke() as Frame;
			const canvasPos = new Vector2(canvasFrame.AbsolutePosition.X, canvasFrame.AbsolutePosition.Y);

			const offset = new Vector2(xOffset, yOffset);
			UpdateNodeAnchorPoint(id, divRef.current!.AbsolutePosition.add(offset).sub(canvasPos));

			const node = GetNodeById(id)!;
			yOffset += node.data.element!.AbsoluteSize.Y + 5;
		}
	};

	const AddChildNode = (id: number) => {
		childNodesIdRef.current.push(id);

		const node = GetNodeById(id)!;
		NodeSystem.AddNode(node.data.node);

		let containerSizeY = 0;
		childNodesIdRef.current.forEach((childId) => {
			const node = GetNodeById(childId)!;
			containerSizeY += node.data.element!.AbsoluteSize.Y + 5;
		});

		setChildContainerSize(new UDim2(1, 0, 0, containerSizeY === 0 ? 0 : containerSizeY - 5));
		task.wait();

		UpdateChildNodes();
	};

	useEffect(() => {
		const dragConnection = NodeDraggingEnded.Connect((id) => {
			if (isHovering.current) {
				const draggingNodeIndex = childNodesIdRef.current.findIndex((nodeId) => nodeId === id);
				if (draggingNodeIndex !== -1) return;

				const draggingNodeData = GetNodeById(id);
				if (draggingNodeData === undefined) return;

				if (draggingNodeData.data.node.nodeGroup !== NodeGroup) return;

				childNodesIdRef.current.push(id);
				UpdateChildNodes();

				NodeSystem.AddNode(draggingNodeData.data.node);
			}
		});

		const zoomConnection = ZoomScaleChanged.Connect((zoomScale) => {
			setZoomScale(zoomScale as number);
		});

		BindNodeGroupFunction(SystemId, NodeGroup, AddChildNode);

		return () => {
			dragConnection.Disconnect();
			zoomConnection.Disconnect();
		};
	}, []);

	useEffect(() => {
		UpdateChildNodes();
	}, [NodeSystemPosition]);

	return (
		<Div
			Size={UDim2.fromScale(1, 0)}
			AutomaticSize={"Y"}
			getFrame={getFrame}
			onHover={onHover}
			onUnhover={onUnhover}
		>
			<Div Size={UDim2.fromScale(1, 0)} AutomaticSize={"Y"}>
				<uipadding
					PaddingLeft={new UDim(0, BORDER_THICKNESS * zoomScale)}
					PaddingRight={new UDim(0, BORDER_THICKNESS * zoomScale)}
					PaddingTop={new UDim(0, BORDER_THICKNESS * zoomScale)}
					PaddingBottom={new UDim(0, BORDER_THICKNESS * zoomScale)}
				/>

				<Div Size={UDim2.fromScale(1, 0)} AutomaticSize={"Y"}>
					<uicorner CornerRadius={new UDim(0, 5 * zoomScale)} />
					<uilistlayout Padding={new UDim(0, 5 * zoomScale)} HorizontalAlignment={"Center"} />
					<uistroke
						Color={StyleColors.FullWhite}
						Thickness={BORDER_THICKNESS * zoomScale}
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
						PaddingLeft={new UDim(0, 5 * zoomScale)}
						PaddingRight={new UDim(0, 5 * zoomScale)}
						PaddingTop={new UDim(0, 5 * zoomScale)}
						PaddingBottom={new UDim(0, 5 * zoomScale)}
					/>

					<BasicTextLabel Size={new UDim2(1, 0, 0, 20 * zoomScale)} Text={NodeGroups[NodeGroup]} />
					<Div Size={childContainerSize} />
				</Div>
			</Div>
		</Div>
	);
}
