import Roact, { useEffect, useRef, useState } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { NodeGroups } from "API/NodeGroup";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { GetCanvas } from "Events";
import { StyleColors } from "Style";
import { GetZoomScale, ZoomScaleChanged } from "ZoomScale";
import { NodeSystemData, RemoveNodeSystem, UpdateNodeSystemAnchorPoint } from "../../Services/NodeSystemService";
import Div from "../Div";
import NodeGroup from "./NodeGroup";
import { GetMousePosition } from "Windows/MainWindow";
import {
	SYSTEM_BORDER_THICKNESS,
	SYSTEM_HEADER_HEIGHT,
	SYSTEM_LIST_PADDING,
	SYSTEM_PADDING,
	SYSTEM_WIDTH,
} from "../SizeConfig";

interface Props {
	data: NodeSystemData;
}

export default function NodeSystem({ data }: Props) {
	const [position, setPosition] = useState(new Vector2(0, 0));
	const [offsetFromCenter, setOffsetFromCenter] = useState(Vector2.zero);

	const [zoomScale, setZoomScale] = useState(GetZoomScale());

	const [isDragging, setIsDragging] = useState(false);

	const mouseOffsetRef = useRef(new Vector2(0, 0));
	const canvas = useRef(GetCanvas.Invoke() as Frame);

	const systemFrameRef = useRef(undefined as undefined | TextButton);

	const groupMoveBinds = useRef<((id: number) => void)[]>([]);

	const groupHeightsRef = useRef<number[]>([]);

	const getMouseOffset = (element: TextButton) => {
		const mousePosition = GetMousePosition();
		mouseOffsetRef.current = element.AbsolutePosition.sub(mousePosition);
	};

	const bindDrag = () => {
		RunService.BindToRenderStep("MoveSystem", Enum.RenderPriority.Input.Value, () => {
			UpdateNodeSystemAnchorPoint(data.id, mouseOffsetRef.current);
			groupMoveBinds.current.forEach((fn) => fn(data.id));
		});
	};

	const onMouseButton1Down = (element: TextButton) => {
		getMouseOffset(element);
		setIsDragging(true);
	};

	const onMouseButton1Up = () => {
		setIsDragging(false);
		RunService.UnbindFromRenderStep("MoveSystem");
	};

	const onMouseButton2Down = () => {
		RemoveNodeSystem(data.id);
	};

	const AddGroupMoveBind = (fn: (id: number) => void) => {
		groupMoveBinds.current.push(fn);
	};

	useEffect(() => {
		if (isDragging) {
			bindDrag();
		}

		return () => {
			RunService.UnbindFromRenderStep("MoveSystem");
		};
	});

	useEffect(() => {
		ZoomScaleChanged.Connect((zoomScale) => {
			setZoomScale(zoomScale as number);
		});
	}, []);

	useEffect(() => {
		const canvasCenter = new Vector2(canvas.current.AbsoluteSize.X * 0.5, canvas.current.AbsoluteSize.Y * 0.5);
		setOffsetFromCenter(data.anchorPoint.sub(canvasCenter).div(zoomScale));
	}, [data.anchorPoint]);

	useEffect(() => {
		const canvasPosition = new Vector2(canvas.current.AbsolutePosition.X, canvas.current.AbsolutePosition.Y);
		const canvasCenter = new Vector2(canvas.current.AbsoluteSize.X * 0.5, canvas.current.AbsoluteSize.Y * 0.5);

		const systemHeight = systemFrameRef.current === undefined ? 0 : systemFrameRef.current.AbsoluteSize.Y;
		const nodeCenter = new Vector2(SYSTEM_WIDTH * 0.5 * zoomScale, systemHeight * 0.5);

		const position = canvasPosition.add(canvasCenter).add(nodeCenter).add(offsetFromCenter.mul(zoomScale));
		setPosition(position);
	}, [canvas.current.AbsoluteSize, systemFrameRef.current?.AbsoluteSize, offsetFromCenter, zoomScale]);

	return (
		<textbutton
			Size={UDim2.fromOffset(SYSTEM_WIDTH * zoomScale, 0)}
			AutomaticSize={"Y"}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromOffset(position.X, position.Y)}
			BackgroundTransparency={1}
			Text={""}
			Active={true}
			ref={systemFrameRef}
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
			<Div>
				<uipadding
					PaddingLeft={new UDim(0, SYSTEM_BORDER_THICKNESS * zoomScale)}
					PaddingRight={new UDim(0, SYSTEM_BORDER_THICKNESS * zoomScale)}
					PaddingTop={new UDim(0, SYSTEM_BORDER_THICKNESS * zoomScale)}
					PaddingBottom={new UDim(0, SYSTEM_BORDER_THICKNESS * zoomScale)}
				/>
				<Div>
					<uistroke
						Color={StyleColors.FullWhite}
						Thickness={SYSTEM_BORDER_THICKNESS * zoomScale}
						Transparency={0.75}
					>
						<uigradient
							Color={
								new ColorSequence([
									new ColorSequenceKeypoint(0, StyleColors.SpawnGroup),
									new ColorSequenceKeypoint(1, StyleColors.EndGroup),
								])
							}
							Rotation={90}
						/>
					</uistroke>
					<uicorner CornerRadius={new UDim(0, 5 * zoomScale)} />
					<uipadding
						PaddingBottom={new UDim(0, SYSTEM_PADDING * zoomScale)}
						PaddingLeft={new UDim(0, SYSTEM_PADDING * zoomScale)}
						PaddingRight={new UDim(0, SYSTEM_PADDING * zoomScale)}
						PaddingTop={new UDim(0, SYSTEM_PADDING * zoomScale)}
					/>
					<uilistlayout
						Padding={new UDim(0, SYSTEM_LIST_PADDING * zoomScale)}
						HorizontalAlignment={"Center"}
					/>

					<BasicTextLabel
						Size={new UDim2(1, 0, 0, SYSTEM_HEADER_HEIGHT * zoomScale)}
						Text={`VFX System (${data.id})`}
					/>

					<NodeGroup
						SystemId={data.id}
						NodeGroup={NodeGroups.Spawn}
						GradientStart={StyleColors.SpawnGroup}
						GradientEnd={StyleColors.InitializeGroup}
						NodeSystem={data}
						SystemNodeGroupHeights={groupHeightsRef.current}
						BindSystemMove={AddGroupMoveBind}
						UpdateGroupSize={(number: number) => (groupHeightsRef.current[0] = number)}
					/>
					<NodeGroup
						SystemId={data.id}
						NodeGroup={NodeGroups.Initialize}
						GradientStart={StyleColors.InitializeGroup}
						GradientEnd={StyleColors.UpdateGroup}
						NodeSystem={data}
						SystemNodeGroupHeights={groupHeightsRef.current}
						BindSystemMove={AddGroupMoveBind}
						UpdateGroupSize={(number: number) => (groupHeightsRef.current[1] = number)}
					/>
					<NodeGroup
						SystemId={data.id}
						NodeGroup={NodeGroups.Update}
						GradientStart={StyleColors.UpdateGroup}
						GradientEnd={StyleColors.RenderGroup}
						NodeSystem={data}
						SystemNodeGroupHeights={groupHeightsRef.current}
						BindSystemMove={AddGroupMoveBind}
						UpdateGroupSize={(number: number) => (groupHeightsRef.current[2] = number)}
					/>
					<NodeGroup
						SystemId={data.id}
						NodeGroup={NodeGroups.Render}
						GradientStart={StyleColors.RenderGroup}
						GradientEnd={StyleColors.EndGroup}
						NodeSystem={data}
						SystemNodeGroupHeights={groupHeightsRef.current}
						BindSystemMove={AddGroupMoveBind}
						UpdateGroupSize={(number: number) => (groupHeightsRef.current[3] = number)}
					/>

					{/* need instant trigger child update */}
				</Div>
			</Div>
		</textbutton>
	);
}
