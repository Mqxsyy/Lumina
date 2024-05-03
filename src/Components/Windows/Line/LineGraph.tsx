import React, { StrictMode, useEffect, useRef, useState } from "@rbxts/react";
import { createRoot } from "@rbxts/react-roblox";
import { Event } from "API/Bindables/Event";
import { GraphPoint, LineGraphField } from "API/Fields/LineGraphField";
import { FixFloatingPointError, RemapValue, RoundDecimal } from "API/Lib";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { NumberInput } from "Components/Basic/NumberInput";
import Div from "Components/Div";
import { StyleColors } from "Style";
import { GetWindow, Windows } from "Windows/WindowSevice";
import LineGraphPoint from "./LineGraphPoint";

// TODO: Add min value

const DOUBLE_CLICK_TIME = 0.25;
const BOTTOM_SIZE = 50;

export function InitializeLineGraph() {
	const window = GetWindow(Windows.ValueGraph)!;
	const root = createRoot(window);
	root.render(
		<StrictMode>
			<LineGraph />
		</StrictMode>,
	);
}

let loadedGraphAPI: LineGraphField;
let maxValue = 1;
const graphAPILoaded = new Event();

export function LoadGraph(graph: LineGraphField, max?: number) {
	loadedGraphAPI = graph;
	maxValue = max === undefined ? 1 : max;
	graphAPILoaded.Fire();
}

function LineGraph() {
	const [forceRender, setForceRender] = useState(0);
	const [windowSize, setWindowSize] = useState(Vector2.zero);

	const graphAPIRef = useRef<LineGraphField>();
	const lastClickTime = useRef(0);

	// need ref cuz state won't update properly inside a function
	const selectedPointRef = useRef(undefined as GraphPoint | undefined);

	const getPointPositionPercent = () => {
		const window = GetWindow(Windows.ValueGraph)!;
		const mousePosition = window.GetRelativeMousePosition();

		const percentX = (mousePosition.X - window.AbsoluteSize.X * 0.1) / (window.AbsoluteSize.X * 0.8);
		const percentY = (mousePosition.Y - window.AbsoluteSize.Y * 0.1) / (window.AbsoluteSize.Y * 0.8 - BOTTOM_SIZE);

		const x = RoundDecimal(math.clamp(percentX, 0, 1), 0.01);
		const y = RoundDecimal(math.clamp(1 - percentY, 0, 1), 0.01);

		return [x, y];
	};

	const updatePoint = (id: number) => {
		if (graphAPIRef.current === undefined) return;

		const [time, valuePercent] = getPointPositionPercent();
		const value = FixFloatingPointError(RemapValue(valuePercent, 0, 1, 0, maxValue));

		graphAPIRef.current.UpdatePoint(id, time, value);
	};

	const removePoint = (id: number) => {
		graphAPIRef.current!.RemovePoint(id);
	};

	const onBackgroundClick = () => {
		if (os.clock() - lastClickTime.current < DOUBLE_CLICK_TIME) {
			const [time, valuePercent] = getPointPositionPercent();
			const value = FixFloatingPointError(RemapValue(valuePercent, 0, 1, 0, maxValue));

			const newPoint = graphAPIRef.current!.AddPoint(time, value);
			selectPoint(newPoint.id);
			return;
		}

		lastClickTime.current = os.clock();
	};

	const selectPoint = (id: number) => {
		if (graphAPIRef.current === undefined) return;

		selectedPointRef.current = graphAPIRef.current.GetAllPoints().find((point) => point.id === id);
		setForceRender((prev) => (prev > 10 ? 0 : ++prev));
	};

	const controlsTimeChanged = (time: number) => {
		if (graphAPIRef.current === undefined || selectedPointRef.current === undefined) return;

		const clampedTime = math.clamp(time, 0, maxValue);
		graphAPIRef.current.UpdatePoint(selectedPointRef.current!.id, clampedTime, selectedPointRef.current!.value);
	};

	const controlsValueChanged = (value: number) => {
		if (graphAPIRef.current === undefined || selectedPointRef.current === undefined) return;

		const clampedValue = math.clamp(value, 0, maxValue);
		graphAPIRef.current.UpdatePoint(selectedPointRef.current!.id, selectedPointRef.current!.time, clampedValue);
	};

	useEffect(() => {
		const loadedConnection = graphAPILoaded.Connect(() => {
			if (loadedGraphAPI !== undefined) {
				graphAPIRef.current = loadedGraphAPI;
				selectedPointRef.current = undefined;
				setForceRender((prev) => (prev > 10 ? 0 : ++prev));
			}
		});

		const window = GetWindow(Windows.ValueGraph);
		let resizeConnection: RBXScriptConnection;

		if (window !== undefined) {
			setWindowSize(window.AbsoluteSize);
			resizeConnection = window.GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
				setWindowSize(window.AbsoluteSize);
			});
		}

		return () => {
			loadedConnection.Disconnect();

			if (resizeConnection !== undefined) {
				resizeConnection.Disconnect();
			}
		};
	}, []);

	useEffect(() => {
		if (graphAPIRef.current === undefined) return;

		const valuesChangedConnection = graphAPIRef.current.FieldChanged.Connect(() => {
			setForceRender((prev) => (prev > 10 ? 0 : ++prev));
		});

		return () => valuesChangedConnection.Disconnect();
	}, [graphAPIRef.current, forceRender]);

	return (
		<>
			{/* Background */}
			<Div BackgroundColor={StyleColors.Background} onMouseButton1Down={onBackgroundClick}>
				{/* Horizontal */}
				<frame
					AnchorPoint={new Vector2(0, 0.5)}
					Position={UDim2.fromScale(0, 0.1)}
					Size={UDim2.fromOffset(windowSize.X, 1)}
					BackgroundColor3={StyleColors.FullWhite}
					BackgroundTransparency={0.75}
					BorderSizePixel={0}
				/>
				<frame
					AnchorPoint={new Vector2(0, 0.5)}
					Position={new UDim2(0, 0, 0.9, -BOTTOM_SIZE)}
					Size={UDim2.fromOffset(windowSize.X, 1)}
					BackgroundColor3={StyleColors.FullWhite}
					BackgroundTransparency={0.75}
					BorderSizePixel={0}
				/>
				{/* Vertical */}
				<frame
					AnchorPoint={new Vector2(0.5, 0)}
					Position={UDim2.fromOffset(0.1 * windowSize.X, 0)}
					Size={new UDim2(0, 1, 1, -BOTTOM_SIZE)}
					BackgroundColor3={StyleColors.FullWhite}
					BackgroundTransparency={0.75}
					BorderSizePixel={0}
				/>
				<frame
					AnchorPoint={new Vector2(0.5, 0)}
					Position={UDim2.fromOffset(0.9 * windowSize.X, 0)}
					Size={new UDim2(0, 1, 1, -BOTTOM_SIZE)}
					BackgroundColor3={StyleColors.FullWhite}
					BackgroundTransparency={0.75}
					BorderSizePixel={0}
				/>
				{/* Top Left Text */}
				<BasicTextLabel
					AnchorPoint={new Vector2(1, 0)}
					Position={new UDim2(0.1, -4, 0.1, 0)}
					Size={new UDim2(0.1, 0, 0, 20)}
					Text={tostring(maxValue)}
					TextXAlignment={"Right"}
				/>
				{/* Bottom Left Text */}
				<BasicTextLabel
					AnchorPoint={new Vector2(1, 0)}
					Position={new UDim2(0.1, -4, 0.9, -BOTTOM_SIZE)}
					Size={new UDim2(0.1, 0, 0, 20)}
					Text={"0"}
					TextXAlignment={"Right"}
				/>
				{/* Bottom Right Text */}
				<BasicTextLabel
					AnchorPoint={new Vector2(1, 0)}
					Position={new UDim2(0.9, -4, 0.9, -BOTTOM_SIZE)}
					Size={new UDim2(0.1, 0, 0, 20)}
					Text={"1"}
					TextXAlignment={"Right"}
				/>
			</Div>
			{/* Points */}
			{graphAPIRef.current?.GetAllPoints().map((point, index) => {
				const positionPercent = new Vector2(
					RemapValue(point.time, 0, 1, 0.1, 0.9),
					RemapValue(maxValue - point.value, 0, maxValue, 0.1, 0.9),
				);

				const position = UDim2.fromOffset(
					positionPercent.X * windowSize.X,
					positionPercent.Y * windowSize.Y -
						RemapValue(maxValue - point.value, 0, maxValue, 0, 1) * BOTTOM_SIZE,
				);

				if (index === 0 || index === graphAPIRef.current!.GetAllPoints().size() - 1) {
					return (
						<LineGraphPoint
							key={"endpoint_" + point.id}
							Id={point.id}
							Position={position}
							OnSelect={selectPoint}
							UpdatePoint={updatePoint}
						/>
					);
				}

				return (
					<LineGraphPoint
						key={"point_" + point.id}
						Id={point.id}
						Position={position}
						OnSelect={selectPoint}
						UpdatePoint={updatePoint}
						RemovePoint={removePoint}
					/>
				);
			})}
			{/* Lines */}
			{graphAPIRef.current?.GetAllPoints().map((_, index) => {
				const allPoints = graphAPIRef.current!.GetAllPoints();

				if (index === allPoints.size() - 1) return;

				const p1 = allPoints[index];
				const p2 = allPoints[index + 1];

				const startTimePercent = RemapValue(p1.time, 0, 1, 0.1, 0.9);
				const startValuePercent = RemapValue(maxValue - p1.value, 0, maxValue, 0.1, 0.9);
				const startPos = new Vector2(
					startTimePercent * windowSize.X,
					startValuePercent * windowSize.Y - RemapValue(maxValue - p1.value, 0, maxValue, 0, 1) * BOTTOM_SIZE,
				);

				const endTimePercent = RemapValue(p2.time, 0, 1, 0.1, 0.9);
				const endValuePercent = RemapValue(maxValue - p2.value, 0, maxValue, 0.1, 0.9);
				const endPos = new Vector2(
					endTimePercent * windowSize.X,
					endValuePercent * windowSize.Y - RemapValue(maxValue - p2.value, 0, maxValue, 0, 1) * BOTTOM_SIZE,
				);

				const position = startPos.add(endPos.sub(startPos).mul(0.5));

				const vectorDiff = endPos.sub(startPos);
				const rotationRad = math.atan2(vectorDiff.Y, vectorDiff.X);
				const rotation = RoundDecimal(math.deg(rotationRad), 0.01);

				const length = endPos.sub(startPos).Magnitude;

				return (
					<Div
						key={"Line_" + index}
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromOffset(position.X, position.Y)}
						Size={UDim2.fromOffset(length, 2)}
						BackgroundColor={StyleColors.Highlight}
						Rotation={rotation}
					/>
				);
			})}
			{/* Controls */}
			<Div
				AnchorPoint={new Vector2(0, 1)}
				Position={UDim2.fromScale(0, 1)}
				Size={new UDim2(1, 0, 0, BOTTOM_SIZE)}
				BackgroundColor={StyleColors.Primary}
			>
				<uilistlayout FillDirection={"Horizontal"} Padding={new UDim(0, 20)} />

				<Div Size={UDim2.fromScale(0.5, 1)}>
					<uipadding PaddingLeft={new UDim(0.25, 0)} PaddingRight={new UDim(0.25, 0)} />
					<uilistlayout
						FillDirection={"Horizontal"}
						VerticalAlignment={"Center"}
						HorizontalAlignment={"Center"}
						Padding={new UDim(0, 10)}
					/>

					<BasicTextLabel Size={new UDim2(0.25, 0, 0, 20)} TextXAlignment={"Right"} Text="Time" />
					<NumberInput
						Size={new UDim2(0.75, 0, 0, 20)}
						Text={
							selectedPointRef.current === undefined ? "" : () => tostring(selectedPointRef.current!.time)
						}
						NumberChanged={controlsTimeChanged}
						Disabled={selectedPointRef.current === undefined || !selectedPointRef.current.canEditTime}
					/>
				</Div>
				<Div Size={UDim2.fromScale(0.5, 1)}>
					<uipadding PaddingLeft={new UDim(0.25, 0)} PaddingRight={new UDim(0.25, 0)} />
					<uilistlayout
						FillDirection={"Horizontal"}
						VerticalAlignment={"Center"}
						HorizontalAlignment={"Center"}
						Padding={new UDim(0, 10)}
					/>

					<BasicTextLabel Size={new UDim2(0.25, 0, 0, 20)} TextXAlignment={"Right"} Text="Value" />
					<NumberInput
						Size={new UDim2(0.75, 0, 0, 20)}
						Text={
							selectedPointRef.current === undefined
								? ""
								: () => tostring(selectedPointRef.current!.value)
						}
						NumberChanged={controlsValueChanged}
						Disabled={selectedPointRef.current === undefined}
					/>
				</Div>
			</Div>
		</>
	);
}
