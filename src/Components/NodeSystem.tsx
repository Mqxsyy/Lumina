import Roact, { useEffect, useRef, useState } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { GetCanvas } from "Events";
import { StyleColors, StyleProperties } from "Style";
import { GetMousePosition, GetMousePositionOnCanvas } from "WidgetHandler";
import { GetZoomScale, ZoomScaleChanged } from "ZoomScale";
import {
	AddNodeSystem,
	GetNodeSystemId,
	NodeSystemData,
	UpdateNodeSystemAnchorPoint,
} from "./Services/NodeSystemService";
import { Div } from "./Div";

export function CreateEmptySystem() {
	AddNodeSystem({
		data: {
			id: GetNodeSystemId(),
			anchorPoint: GetMousePositionOnCanvas(),
		},
		create: (data) => <NodeSystem key={data.id} data={data} />,
	});
}

interface Props {
	data: NodeSystemData;
}

export function NodeSystem({ data }: Props) {
	const [position, setPosition] = useState(new Vector2(0, 0));
	const [offsetFromCenter, setOffsetFromCenter] = useState(Vector2.zero);

	const [zoomScale, setZoomScale] = useState(GetZoomScale());

	const [isDragging, setIsDragging] = useState(false);

	const mouseOffsetRef = useRef(new Vector2(0, 0));
	const canvas = useRef(GetCanvas.Invoke() as Frame);

	const [forceRender, setForceRender] = useState(false);

	const getMouseOffset = (element: TextButton) => {
		const mousePosition = GetMousePosition();
		mouseOffsetRef.current = element.AbsolutePosition.sub(mousePosition);
	};

	const bindDrag = () => {
		RunService.BindToRenderStep("MoveNode", Enum.RenderPriority.Input.Value, () => {
			UpdateNodeSystemAnchorPoint(data.id, mouseOffsetRef.current);

			const invertedForceRender = !forceRender;
			setForceRender(invertedForceRender);
		});
	};

	const onMouseButton1Down = (element: TextButton) => {
		getMouseOffset(element);
		setIsDragging(true);
	};

	const onMouseButton1Up = () => {
		setIsDragging(false);
		RunService.UnbindFromRenderStep("MoveNode");
	};

	useEffect(() => {
		if (isDragging) {
			bindDrag();
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
		const nodeCenter = data.anchorPoint.add(new Vector2(200 * 0.5 * zoomScale, 100 * 0.5 * zoomScale));

		setOffsetFromCenter(nodeCenter.sub(canvasCenter).div(zoomScale));
	}, [data.anchorPoint]);

	useEffect(() => {
		const canvasPosition = new Vector2(canvas.current.AbsolutePosition.X, canvas.current.AbsolutePosition.Y);
		const canvasCenter = new Vector2(canvas.current.AbsoluteSize.X * 0.5, canvas.current.AbsoluteSize.Y * 0.5);
		const position = canvasPosition.add(canvasCenter).add(offsetFromCenter.mul(zoomScale));

		setPosition(position);
	}, [canvas.current.AbsoluteSize, offsetFromCenter, zoomScale]);

	return (
		<textbutton
			Size={UDim2.fromOffset(200 * zoomScale, 100 * zoomScale)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromOffset(position.X, position.Y)}
			BackgroundTransparency={1}
			Text={""}
			Active={true}
			Event={{
				InputBegan: (element, inputObject) => {
					if (inputObject.UserInputType === Enum.UserInputType.MouseButton1) {
						onMouseButton1Down(element);
					}
				},
				InputEnded: (_, inputObject) => {
					if (inputObject.UserInputType === Enum.UserInputType.MouseButton1) {
						onMouseButton1Up();
					}
				},
			}}
		>
			<Div>
				<uipadding
					PaddingLeft={new UDim(0, 5 * zoomScale)}
					PaddingRight={new UDim(0, 5 * zoomScale)}
					PaddingTop={new UDim(0, 5 * zoomScale)}
					PaddingBottom={new UDim(0, 5 * zoomScale)}
				/>
				<Div>
					<uistroke Color={StyleColors.hex100} Thickness={5 * zoomScale} Transparency={0.9} />
					<uicorner CornerRadius={StyleProperties.CornerRadius} />
				</Div>
			</Div>
		</textbutton>
	);
}
