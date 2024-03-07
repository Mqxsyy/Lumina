import Roact, { useEffect, useRef, useState } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { RemoveNode, UpdateNodeAnchorPoint } from "Services/NodesService";
import { GetCanvas } from "Events";
import { StyleColors, StyleProperties } from "Style";
import { GetMousePosition, GetMousePositionOnCanvas } from "WidgetHandler";
import { GetZoomScale, ZoomScaleChanged } from "ZoomScale";
import { SetDraggingNode } from "Services/DraggingService";
import { Div } from "Components/Div";

const NODE_WIDTH = 250;

interface Props {
	Name: string;
	Id: number;
	AnchorPoint: Vector2;
}

export function Node({ Name, Id, AnchorPoint, children }: Roact.PropsWithChildren<Props>) {
	const [position, setPosition] = useState(new Vector2(0, 0));
	const [offsetFromCenter, setOffsetFromCenter] = useState(Vector2.zero);

	const [zoomScale, setZoomScale] = useState(GetZoomScale());

	const [isDragging, setIsDragging] = useState(false);

	const mouseOffsetRef = useRef(new Vector2(0, 0));
	const canvas = useRef(GetCanvas.Invoke() as Frame);

	const nodeRef = useRef(undefined as undefined | TextButton);

	const onMouseButton1Down = (element: TextButton) => {
		const mousePosition = GetMousePosition();
		mouseOffsetRef.current = element.AbsolutePosition.sub(mousePosition);

		SetDraggingNode({ id: Id, element });
		setIsDragging(true);
	};

	const onMouseButton1Up = () => {
		SetDraggingNode(undefined);
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
		const canvasCenter = new Vector2(canvas.current.AbsoluteSize.X * 0.5, canvas.current.AbsoluteSize.Y * 0.5);
		const systemHeight = nodeRef.current === undefined ? 0 : nodeRef.current.AbsoluteSize.Y;
		const nodeCenter = AnchorPoint.add(new Vector2(NODE_WIDTH * 0.5 * zoomScale, systemHeight * 0.5));

		setOffsetFromCenter(nodeCenter.sub(canvasCenter).div(zoomScale));
	}, [AnchorPoint, nodeRef.current?.AbsoluteSize]);

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
			ref={nodeRef}
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

			<BasicTextLabel Size={new UDim2(1, 0, 0, 20 * zoomScale)} Text={Name} />
			<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
				{children}
			</Div>
		</textbutton>
	);
}
