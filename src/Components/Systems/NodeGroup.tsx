import Roact, { useEffect, useRef, useState } from "@rbxts/roact";
import { Div } from "../Div";
import { GetZoomScale, ZoomScaleChanged } from "ZoomScale";
import { StyleColors } from "Style";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { DraggingNode, GetDraggingNode, NodeDraggingEnded } from "Services/DraggingService";
import { GetNodeById, UpdateNodeAnchorPoint } from "Services/NodesService";
import { NodeGroups } from "API/NodeGroup";
import { RunService } from "@rbxts/services";
import { GetMousePositionOnCanvas } from "WidgetHandler";
import { GetCanvas } from "Events";

const BORDER_THICKNESS = 2;

interface Props {
	NodeGroup: NodeGroups;
	GradientStart: Color3;
	GradientEnd: Color3;
	ForceReRenderSystem: () => void;
}

export function NodeGroup({ NodeGroup, GradientStart, GradientEnd, ForceReRenderSystem }: Props) {
	const [zoomScale, setZoomScale] = useState(GetZoomScale());
	const [childContainerSize, setChildContainerSize] = useState(new UDim2(1, 0, 0, 0));

	const childNodesRef = useRef([] as DraggingNode[]);
	const divRef = useRef(undefined as undefined | Frame);
	const isHovering = useRef(false);

	const getFrame = (frame: Frame) => {
		divRef.current = frame;
	};

	const onHover = () => {
		isHovering.current = true;

		RunService.BindToRenderStep(`OverrideDraggingNodePosition${NodeGroup}`, 120, () => {
			const draggingNode = GetDraggingNode();
			if (draggingNode === undefined) return;

			const draggingNodeData = GetNodeById(draggingNode.id);
			if (draggingNodeData === undefined) return;

			if (draggingNodeData.data.node.nodeGroup !== NodeGroup) return;

			setChildContainerSize(new UDim2(1, 0, 0, draggingNode.element.AbsoluteSize.Y + 5));

			const xOffset = (divRef.current!.AbsoluteSize.X - 250) * 0.5;
			const yOffset = 20 + 10;

			const canvasFrame = GetCanvas.Invoke() as Frame;
			const canvasPos = new Vector2(canvasFrame.AbsolutePosition.X, canvasFrame.AbsolutePosition.Y);

			const offset = new Vector2(xOffset, yOffset);
			UpdateNodeAnchorPoint(draggingNode.id, divRef.current!.AbsolutePosition.add(offset).sub(canvasPos));
		});
	};

	const onUnhover = () => {
		isHovering.current = false;

		RunService.UnbindFromRenderStep(`OverrideDraggingNodePosition${NodeGroup}`);

		const draggingNode = GetDraggingNode();

		if (draggingNode !== undefined) {
			const draggingNodeIndex = childNodesRef.current.findIndex((node) => node.id === draggingNode.id);
			if (draggingNodeIndex !== -1) {
				childNodesRef.current.remove(draggingNodeIndex);
			}
		}

		let containerSizeY = 0;
		childNodesRef.current.forEach((node) => {
			containerSizeY += node.element.AbsoluteSize.Y + 5;
		});

		setChildContainerSize(new UDim2(1, 0, 0, containerSizeY));
	};

	useEffect(() => {
		const dragConnection = NodeDraggingEnded.Connect((draggingNode) => {
			if (isHovering.current) {
				const draggingNodeIndex = childNodesRef.current.findIndex((node) => node.id === draggingNode.id);
				if (draggingNodeIndex !== -1) return;

				const draggingNodeData = GetNodeById(draggingNode.id);
				if (draggingNodeData === undefined) return;

				if (draggingNodeData.data.node.nodeGroup !== NodeGroup) return;

				childNodesRef.current.push(draggingNode);
			}
		});

		const zoomConnection = ZoomScaleChanged.Connect((zoomScale) => {
			setZoomScale(zoomScale as number);
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
