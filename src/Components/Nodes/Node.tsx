import Roact, { useEffect, useRef, useState } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { RemoveNode, SetNodeElement, UpdateNodeAnchorPoint } from "Services/NodesService";
import { GetCanvas } from "Events";
import { StyleColors, StyleProperties } from "Style";
import { GetMousePosition, GetMousePositionOnCanvas } from "WidgetHandler";
import { GetZoomScale, ZoomScaleChanged } from "ZoomScale";
import { SetDraggingNodeId } from "Services/DraggingService";
import { Div } from "Components/Div";
import ConnectionPointOut from "Components/Connections/ConnectionPointOut";

const NODE_WIDTH = 250;

interface Props {
	Name: string;
	Id: number;
	AnchorPoint: Vector2;
	ConnectionFunction?: () => number;
}

export function Node({
	Name,
	Id,
	AnchorPoint,
	ConnectionFunction = undefined,
	children,
}: Roact.PropsWithChildren<Props>) {
	const [position, setPosition] = useState(new Vector2(0, 0));
	const [offsetFromCenter, setOffsetFromCenter] = useState(Vector2.zero);

	const [zoomScale, setZoomScale] = useState(GetZoomScale());

	const [isDragging, setIsDragging] = useState(false);

	const mouseOffsetRef = useRef(new Vector2(0, 0));
	const canvas = useRef(GetCanvas.Invoke() as Frame);

	const elementRef = useRef(undefined as undefined | TextButton);

	const onMouseButton1Down = (element: TextButton) => {
		const mousePosition = GetMousePosition();
		mouseOffsetRef.current = element.AbsolutePosition.sub(mousePosition);

		SetDraggingNodeId(Id);
		setIsDragging(true);
	};

	const onMouseButton1Up = () => {
		SetDraggingNodeId(undefined);
		setIsDragging(false);

		RunService.UnbindFromRenderStep("MoveNode");
	};

	const onMouseButton2Down = () => {
		RemoveNode(Id);
	};

	useEffect(() => {
		if (isDragging) {
			RunService.BindToRenderStep("MoveNode", 110, () => {
				const mousePosition = GetMousePositionOnCanvas();
				UpdateNodeAnchorPoint(Id, mousePosition.add(mouseOffsetRef.current));
			});
		}

		return () => {
			RunService.UnbindFromRenderStep("MoveNode");
		};
	});

	useEffect(() => {
		ZoomScaleChanged.Connect((zoomScale) => {
			setZoomScale(zoomScale as number);
		});
	}, []);

	useEffect(() => {
		if (elementRef.current === undefined) return;
		SetNodeElement(Id, elementRef.current);
	}, [elementRef.current]);

	useEffect(() => {
		const canvasCenter = new Vector2(canvas.current.AbsoluteSize.X * 0.5, canvas.current.AbsoluteSize.Y * 0.5);
		const systemHeight = elementRef.current === undefined ? 0 : elementRef.current.AbsoluteSize.Y;
		const nodeCenter = AnchorPoint.add(new Vector2(NODE_WIDTH * 0.5 * zoomScale, systemHeight * 0.5));

		setOffsetFromCenter(nodeCenter.sub(canvasCenter).div(zoomScale));
	}, [AnchorPoint, elementRef.current?.AbsoluteSize]);

	useEffect(() => {
		const canvasPosition = new Vector2(canvas.current.AbsolutePosition.X, canvas.current.AbsolutePosition.Y);
		const canvasCenter = new Vector2(canvas.current.AbsoluteSize.X * 0.5, canvas.current.AbsoluteSize.Y * 0.5);
		const position = canvasPosition.add(canvasCenter).add(offsetFromCenter.mul(zoomScale));

		setPosition(position);
	}, [canvas.current.AbsoluteSize, offsetFromCenter, zoomScale]);

	return (
		<textbutton
			Size={UDim2.fromOffset(NODE_WIDTH * zoomScale, 0)}
			AutomaticSize={"Y"}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromOffset(position.X, position.Y)}
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
				{ConnectionFunction !== undefined && (
					<ConnectionPointOut
						AnchorPoint={new Vector2(1, 0)}
						Position={UDim2.fromScale(1, 0)}
						Size={UDim2.fromOffset(20, 20)}
						Fn={ConnectionFunction}
					/>
				)}
			</Div>
			<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
				<uilistlayout Padding={new UDim(0, 5 * zoomScale)} HorizontalAlignment={"Center"} />
				{children}
			</Div>
		</textbutton>
	);
}
