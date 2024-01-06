import Roact, { useEffect, useRef, useState } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { ZoomScaleUpdateEvent } from "Events";
import { GetMousePositionOnCanvas } from "WidgetHandler";
import { GetZoomScale } from "ZoomScale";

let mouseOffset = Vector2.zero;

function SelectNodeTitleBar(element: Frame, inputObject: InputObject, setAnchorPosition: (position: Vector2) => void) {
	if (inputObject.UserInputType !== Enum.UserInputType.MouseButton1) return;
	mouseOffset = GetMousePositionOnCanvas().sub(element.AbsolutePosition);

	// dumb? fix for element display order
	// yes zindex exists but it won't leave it above other elements
	const elementParent = element.Parent;
	element.Parent = undefined;
	element.Parent = elementParent;

	RunService.BindToRenderStep("MoveNode", Enum.RenderPriority.Input.Value, () => MoveNode(setAnchorPosition));
}

function DeselectNodeTitleBar(inputObject: InputObject) {
	if (inputObject.UserInputType !== Enum.UserInputType.MouseButton1) return;
	RunService.UnbindFromRenderStep("MoveNode");
}

function MoveNode(setAnchorPosition: (position: Vector2) => void) {
	const mousePosition = GetMousePositionOnCanvas();

	const newPosition = mousePosition.sub(mouseOffset);
	let newX = newPosition.X / GetZoomScale();
	let newY = newPosition.Y / GetZoomScale();

	if (newX < 0) newX = 0;
	if (newY < 0) newY = 0;

	setAnchorPosition(new Vector2(newX, newY));
}

export function Node() {
	const [anchorPosition, setAnchorPosition] = useState(Vector2.zero);
	const [displayPosition, setDisplayPosition] = useState(Vector2.zero);

	useEffect(() => {
		const mousePosition = GetMousePositionOnCanvas();
		setAnchorPosition(mousePosition.div(GetZoomScale()));

		const position = new Vector2(mousePosition.X, mousePosition.Y);
		setDisplayPosition(position);
	}, []);

	useEffect(() => {
		const connection = ZoomScaleUpdateEvent.Event.Connect((zoomScale: number) => {
			const position = new Vector2(anchorPosition.X * zoomScale, anchorPosition.Y * zoomScale);
			setDisplayPosition(position);
		});

		return () => {
			connection.Disconnect();
		};
	}, [anchorPosition]);

	const setPosition = (pos: Vector2) => {
		setAnchorPosition(pos);

		const position = new Vector2(pos.X * GetZoomScale(), pos.Y * GetZoomScale());
		setDisplayPosition(position);
	};

	return (
		<textbutton
			Position={UDim2.fromOffset(displayPosition.X, displayPosition.Y)}
			Size={UDim2.fromOffset(200 * GetZoomScale(), 150 * GetZoomScale())}
			BackgroundColor3={Color3.fromHex("#FFFFFF")}
			Active={true}
			Text={""}
			AutoButtonColor={false}
		>
			<frame
				Size={new UDim2(1, 0, 0.1, 0)}
				Event={{
					InputBegan: (element, inputObject) =>
						SelectNodeTitleBar(element.Parent as Frame, inputObject, setPosition),
					InputEnded: (_, inputObject) => DeselectNodeTitleBar(inputObject),
				}}
			/>
		</textbutton>
	);
}
