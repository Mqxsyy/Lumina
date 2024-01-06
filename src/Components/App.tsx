import Roact, { useEffect, useRef } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { ZoomScaleUpdateEvent } from "Events";
import { CreateNode, PlacedNodes } from "Nodes";
import { GetMousePosition } from "WidgetHandler";
import { GetLastZoomScale, GetZoomScale, SetZoomScale, ZoomScaleConstraint } from "ZoomScale";

function MakeNode(inputObject: InputObject) {
	if (inputObject.KeyCode === Enum.KeyCode.Space) {
		CreateNode();
	}
}

let mouseOffset = UDim2.fromOffset(0, 0);
function StartMoveCanvas(frame: Frame, inputObject: InputObject) {
	if (inputObject.UserInputType !== Enum.UserInputType.MouseButton3) return;

	const mousePositionVec2 = GetMousePosition();
	const mousePosition = UDim2.fromOffset(mousePositionVec2.X, mousePositionVec2.Y);

	mouseOffset = mousePosition.sub(frame.Position);

	RunService.BindToRenderStep("MoveCanvas", Enum.RenderPriority.Input.Value, () => MoveCanvas(frame));
}

function EndMoveCanvas(inputObject: InputObject) {
	if (inputObject.UserInputType !== Enum.UserInputType.MouseButton3) return;
	RunService.UnbindFromRenderStep("MoveCanvas");
}

function MoveCanvas(frame: Frame) {
	const mousePositionVec2 = GetMousePosition();
	const mousePosition = UDim2.fromOffset(mousePositionVec2.X, mousePositionVec2.Y);

	let newPosition = mousePosition.sub(mouseOffset);

	if (newPosition.Width.Offset >= 0) newPosition = new UDim2(0, 0, 0, newPosition.Y.Offset);
	if (newPosition.Height.Offset >= 0) newPosition = new UDim2(0, newPosition.X.Offset, 0, 0);

	frame.Position = newPosition;
}

function UpdateZoom(inputObject: InputObject) {
	if (inputObject.UserInputType === Enum.UserInputType.MouseWheel) {
		if (inputObject.Position.Z > 0) {
			const newZoomScale = GetZoomScale() + 0.1;
			if (newZoomScale > ZoomScaleConstraint.max) {
				SetZoomScale(ZoomScaleConstraint.max);
			} else {
				SetZoomScale(newZoomScale);
			}
		} else if (inputObject.Position.Z < 0) {
			const newZoomScale = GetZoomScale() - 0.1;
			if (newZoomScale < ZoomScaleConstraint.min) {
				SetZoomScale(ZoomScaleConstraint.min);
			} else {
				SetZoomScale(newZoomScale);
			}
		}
	}
}

interface AppProps {
	fn: (frame: Frame) => void;
}

export function App({ fn }: AppProps) {
	const canvasRef = useRef(undefined as Frame | undefined);

	useEffect(() => {
		fn(canvasRef.current as Frame);

		ZoomScaleUpdateEvent.Event.Connect((zoomScale: number) => {
			const mousePosition = GetMousePosition();
			const delta = zoomScale - GetLastZoomScale();

			const canvasOffset = mousePosition.mul(delta).mul(3);

			const currentPos = canvasRef.current!.Position;
			let newPosition = UDim2.fromOffset(
				currentPos.X.Offset - canvasOffset.X,
				currentPos.Y.Offset - canvasOffset.Y,
			);

			if (newPosition.Width.Offset >= 0) newPosition = new UDim2(0, 0, 0, newPosition.Y.Offset);
			if (newPosition.Height.Offset >= 0) newPosition = new UDim2(0, newPosition.X.Offset, 0, 0);

			canvasRef.current!.Position = newPosition;
		});
	}, []);

	return (
		<frame
			Size={UDim2.fromScale(1, 1)}
			BackgroundColor3={Color3.fromHex("#1B1B1B")}
			AutomaticSize={Enum.AutomaticSize.XY}
			Event={{
				InputBegan: (_, inputObject: InputObject) => {
					MakeNode(inputObject);
				},
			}}
			ref={canvasRef}
		>
			{...PlacedNodes}
			<frame
				Size={UDim2.fromScale(1, 1)}
				BackgroundTransparency={1}
				Event={{
					InputBegan: (element, inputObject: InputObject) =>
						StartMoveCanvas(element.Parent as Frame, inputObject),
					InputEnded: (_, inputObject: InputObject) => EndMoveCanvas(inputObject),
					InputChanged: (_, inputObject: InputObject) => UpdateZoom(inputObject),
				}}
			/>
		</frame>
	);
}
