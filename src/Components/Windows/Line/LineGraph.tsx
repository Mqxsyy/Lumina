import Roact, { useEffect, useRef, useState } from "@rbxts/roact";
import { Event } from "API/Bindables/Event";
import { GraphPoint, LineGraphField } from "API/Fields/LineGraphField";
import { FixFloatingPointError, RemapValue, RoundDecimal } from "API/Lib";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { NumberInput } from "Components/Basic/NumeberInput";
import Div from "Components/Div";
import { StyleColors } from "Style";
import { GetWindow, Windows } from "Windows/WindowSevice";
import LineGraphPoint from "./LineGraphPoint";

// TODO: Add min value

const DOUBLE_CLICK_TIME = 0.25;
const BOTTOM_SIZE = 50;

export function InitializeLineGraph() {
	Roact.mount(<LineGraph />, GetWindow(Windows.ValueGraph)!, "LineGraph");
}

const points: GraphPoint[] = [];
const pointsChanged = new Event();
let maxValue = 1;
let graphAPI: LineGraphField;

export function LoadGraph(graph: LineGraphField, max?: number) {
	if (max !== undefined) {
		maxValue = max;
	} else {
		maxValue = 1;
	}

	points.clear();

	graphAPI = graph;
	points.push(graph.startPoint);
	graph.graphPoints.forEach((point) => {
		points.push(point);
	});
	points.push(graph.endPoint);

	pointsChanged.Fire();
}

function LineGraph() {
	const [windowSize, setWindowSize] = useState(new Vector2(0, 0));
	const [_, setForceRender] = useState(0);
	const lastClickTime = useRef(0);

	// need ref cuz state won't update properly inside a function
	const selectedPointRef = useRef(undefined as GraphPoint | undefined);
	const selectedPointTimeLockedRef = useRef(false);

	const ComparePoints = () => {
		const apiPoints = graphAPI!.GetPoints();
		for (let i = 0; i < points.size() - 2; i++) {
			if (points[i + 1].id !== apiPoints[i].id) {
				LoadGraph(graphAPI!, maxValue);
				return true;
			}
		}

		return false;
	};

	const GetPointPositionPercent = () => {
		const window = GetWindow(Windows.ValueGraph)!;
		const mousePosition = window.GetRelativeMousePosition();

		const percentX = (mousePosition.X - window.AbsoluteSize.X * 0.1) / (window.AbsoluteSize.X * 0.8);
		const percentY = (mousePosition.Y - window.AbsoluteSize.Y * 0.1) / (window.AbsoluteSize.Y * 0.8 - BOTTOM_SIZE);

		const x = RoundDecimal(math.clamp(percentX, 0, 1), 0.01);
		const y = RoundDecimal(math.clamp(1 - percentY, 0, 1), 0.01);

		return [x, y];
	};

	const UpdatePoint = (id: number, timeLock: number) => {
		const [time, valuePercent] = GetPointPositionPercent();
		const value = FixFloatingPointError(RemapValue(valuePercent, 0, 1, 0, maxValue));

		if (timeLock !== -1) {
			graphAPI!.UpdatePoint(id, timeLock, value);
		} else {
			graphAPI!.UpdatePoint(id, time, value);
		}

		if (ComparePoints()) return;

		const index = points.findIndex((point) => point.id === id);

		if (timeLock !== -1) {
			points[index].time = timeLock;
		} else {
			points[index].time = time;
		}

		points[index].value = value;
		pointsChanged.Fire();
	};

	const RemovePoint = (id: number) => {
		graphAPI!.RemovePoint(id);
		LoadGraph(graphAPI!, maxValue);
	};

	const OnBackgroundClick = () => {
		if (os.clock() - lastClickTime.current < DOUBLE_CLICK_TIME) {
			const [time, valuePercent] = GetPointPositionPercent();
			const value = FixFloatingPointError(RemapValue(valuePercent, 0, 1, 0, maxValue));

			graphAPI!.AddPoint(time, value);
			LoadGraph(graphAPI!, maxValue);

			return;
		}

		lastClickTime.current = os.clock();
	};

	const SelectPoint = (id: number, isTimeLocked: boolean) => {
		const point = points.find((point) => point.id === id);
		selectedPointRef.current = point;
		selectedPointTimeLockedRef.current = isTimeLocked;
		pointsChanged.Fire();
	};

	const OnTimeInputChanged = (time: number) => {
		if (selectedPointTimeLockedRef.current === true) return;

		const clampedTime = math.clamp(time, 0, maxValue);
		graphAPI.UpdatePoint(selectedPointRef.current!.id, clampedTime, selectedPointRef.current!.value);

		if (ComparePoints()) return;

		selectedPointRef.current!.time = clampedTime;
		pointsChanged.Fire();
	};

	const OnValueInputChanged = (value: number) => {
		const clampedValue = math.clamp(value, 0, maxValue);
		graphAPI.UpdatePoint(selectedPointRef.current!.id, selectedPointRef.current!.time, clampedValue);

		if (ComparePoints()) return;

		selectedPointRef.current!.value = clampedValue;
		pointsChanged.Fire();
	};

	useEffect(() => {
		pointsChanged.Connect(() => {
			setForceRender((prev) => (prev > 10 ? 0 : ++prev));
		});

		const window = GetWindow(Windows.ValueGraph)!;
		setWindowSize(window.AbsoluteSize);

		window.GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
			setWindowSize(window.AbsoluteSize);
		});
	}, []);

	return (
		<>
			{/* Background */}
			<Div BackgroundColor={StyleColors.Background} onMouseButton1Down={OnBackgroundClick}>
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
					TextXAlignment={Enum.TextXAlignment.Right}
				/>
				{/* Bottom Left Text */}
				<BasicTextLabel
					AnchorPoint={new Vector2(1, 0)}
					Position={new UDim2(0.1, -4, 0.9, -BOTTOM_SIZE)}
					Size={new UDim2(0.1, 0, 0, 20)}
					Text={"0"}
					TextXAlignment={Enum.TextXAlignment.Right}
				/>
				{/* Bottom Right Text */}
				<BasicTextLabel
					AnchorPoint={new Vector2(1, 0)}
					Position={new UDim2(0.9, -4, 0.9, -BOTTOM_SIZE)}
					Size={new UDim2(0.1, 0, 0, 20)}
					Text={"1"}
					TextXAlignment={Enum.TextXAlignment.Right}
				/>
			</Div>
			{/* Points */}
			{points.map((point, index) => {
				const positionPercent = new Vector2(
					RemapValue(point.time, 0, 1, 0.1, 0.9),
					RemapValue(maxValue - point.value, 0, maxValue, 0.1, 0.9),
				);

				const position = UDim2.fromOffset(
					positionPercent.X * windowSize.X,
					positionPercent.Y * windowSize.Y -
						RemapValue(maxValue - point.value, 0, maxValue, 0, 1) * BOTTOM_SIZE,
				);

				if (index === 0 || index === points.size() - 1) {
					return (
						<LineGraphPoint
							key={point.id}
							Id={point.id}
							Position={position}
							TimeLock={index === 0 ? 0 : 1}
							OnSelect={SelectPoint}
							UpdatePoint={UpdatePoint}
						/>
					);
				}

				return (
					<LineGraphPoint
						key={point.id}
						Id={point.id}
						Position={position}
						OnSelect={SelectPoint}
						UpdatePoint={UpdatePoint}
						RemovePoint={RemovePoint}
					/>
				);
			})}
			{/* Lines */}
			{points.map((_, index) => {
				if (index === points.size() - 1) return;

				const p1 = points[index];
				const p2 = points[index + 1];

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

					<BasicTextLabel
						Size={new UDim2(0.25, 0, 0, 20)}
						TextXAlignment={Enum.TextXAlignment.Right}
						Text="Time"
					/>
					<NumberInput
						Size={new UDim2(0.75, 0, 0, 20)}
						Text={selectedPointRef.current === undefined ? "" : tostring(selectedPointRef.current.time)}
						PlaceholderText={"..."}
						NumberChanged={OnTimeInputChanged}
						Disabled={selectedPointRef.current === undefined || selectedPointTimeLockedRef.current}
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

					<BasicTextLabel
						Size={new UDim2(0.25, 0, 0, 20)}
						TextXAlignment={Enum.TextXAlignment.Right}
						Text="Value"
					/>
					<NumberInput
						Size={new UDim2(0.75, 0, 0, 20)}
						Text={selectedPointRef.current === undefined ? "" : tostring(selectedPointRef.current.value)}
						PlaceholderText={"..."}
						NumberChanged={OnValueInputChanged}
						Disabled={(selectedPointRef.current === undefined) === undefined}
					/>
				</Div>
			</Div>
		</>
	);
}
