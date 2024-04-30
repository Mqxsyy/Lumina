import Roact, { useEffect, useRef, useState } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { LogicNode } from "API/Nodes/Logic/LogicNode";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import ConnectionPointOut from "Components/Connections/ConnectionPointOut";
import Div from "Components/Div";
import { NODE_WIDTH } from "Components/SizeConfig";
import { GetCanvasData } from "Services/CanvasService";
import { SetDraggingNodeId } from "Services/DraggingService";
import { GetNodeById, RemoveNode, SetNodeElement, UpdateNodeData } from "Services/NodesService";
import { StyleColors, StyleProperties } from "Style";
import { GetMousePosition, GetMousePositionOnCanvas } from "Windows/MainWindow";
import { GetZoomScale, ZoomScaleChanged } from "ZoomScale";

interface Props {
	Name: string;
	Id: number;
	AnchorPoint: Vector2;
	ConnectionFunction?: () => number;
	ConnectioNode?: LogicNode;
}

export function Node({
	Name,
	Id,
	AnchorPoint,
	ConnectionFunction = undefined,
	ConnectioNode = undefined,
	children,
}: Roact.PropsWithChildren<Props>) {
	const mouseOffsetRef = useRef(new Vector2(0, 0));
	const canvasData = useRef(GetCanvasData());
	const elementRef = useRef(undefined as undefined | TextButton);

	const zoomScale = GetZoomScale();

	const onMouseButton1Down = (element: TextButton) => {
		const mousePosition = GetMousePosition();
		mouseOffsetRef.current = element.AbsolutePosition.sub(mousePosition);

		SetDraggingNodeId(Id);

		RunService.BindToRenderStep("MoveNode", 110, () => {
			const nodeData = GetNodeById(Id)!;
			const newAnchorPosition = GetMousePositionOnCanvas().add(mouseOffsetRef.current).div(zoomScale);

			if (nodeData.data.anchorPoint !== newAnchorPosition) {
				UpdateNodeData(Id, (data) => {
					data.anchorPoint = newAnchorPosition;
					return data;
				});
			}
		});
	};

	const onMouseButton1Up = () => {
		SetDraggingNodeId(undefined);
		RunService.UnbindFromRenderStep("MoveNode");
	};

	const onMouseButton2Down = () => {
		RemoveNode(Id);
	};

	const getPosition = () => {
		const nodeHeight = elementRef.current === undefined ? 0 : elementRef.current.AbsoluteSize.Y;
		const offsetFromCenter = AnchorPoint.mul(zoomScale).add(
			new Vector2(NODE_WIDTH * 0.5 * zoomScale, nodeHeight * 0.5),
		);
		const canvasPosition = new Vector2(canvasData.current.Position.X.Offset, canvasData.current.Position.Y.Offset);
		const position = canvasPosition.add(offsetFromCenter);
		return UDim2.fromOffset(position.X, position.Y);
	};

	useEffect(() => {
		if (elementRef.current === undefined) return;
		SetNodeElement(Id, elementRef.current);
	}, [elementRef.current]);

	return (
		<textbutton
			Size={UDim2.fromOffset(NODE_WIDTH * zoomScale, 0)}
			AutomaticSize={"Y"}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={getPosition()}
			BackgroundColor3={StyleColors.Primary}
			AutoButtonColor={false}
			Text={""}
			Active={true}
			ref={elementRef}
			Event={{
				InputBegan: (element, inputObject) => {
					if (inputObject.UserInputType === Enum.UserInputType.MouseButton1) {
						onMouseButton1Down(element);
					} else if (inputObject.UserInputType === Enum.UserInputType.MouseButton2) {
						onMouseButton2Down();
					}
				},
				InputEnded: (_, inputObject) => {
					if (inputObject.UserInputType === Enum.UserInputType.MouseButton1) {
						onMouseButton1Up();
					}
				},
			}}
		>
			<uicorner CornerRadius={StyleProperties.CornerRadius} />
			<uilistlayout Padding={new UDim(0, 5 * zoomScale)} HorizontalAlignment={"Center"} />
			<uipadding
				PaddingLeft={new UDim(0, 5 * zoomScale)}
				PaddingRight={new UDim(0, 5 * zoomScale)}
				PaddingTop={new UDim(0, 5 * zoomScale)}
				PaddingBottom={new UDim(0, 5 * zoomScale)}
			/>

			<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
				<BasicTextLabel Size={new UDim2(1, 0, 0, 20 * zoomScale)} Text={Name} />
				{ConnectionFunction !== undefined && ConnectioNode !== undefined && (
					<ConnectionPointOut
						AnchorPoint={new Vector2(1, 0.5)}
						Position={UDim2.fromScale(1, 0.5)}
						NodeId={Id}
						BindFunction={ConnectionFunction}
					/>
				)}
			</Div>
			<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
				<uilistlayout Padding={new UDim(0, 5 * zoomScale)} />
				<uipadding PaddingLeft={new UDim(0, 10 * zoomScale)} />

				{children}
			</Div>
		</textbutton>
	);
}
