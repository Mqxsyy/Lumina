import Roact, { useEffect, useRef, useState } from "@rbxts/roact";
import { Event } from "API/Bindables/Event";
import { GraphPoint, LineGraphField } from "API/Fields/LineGraphField";
import { RemapValue, RoundDecimal } from "API/Lib";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { NumberInput } from "Components/Basic/NumeberInput";
import Div from "Components/Div";
import { StyleColors } from "Style";
import { GetWindow, Windows } from "Windows/WindowSevice";
import LineGraphPoint from "./LineGraphPoint";

const DOUBLE_CLICK_TIME = 0.25;
const BOTTOM_SIZE = 50;

export function InitializeLineGraph() {
	Roact.mount(<LineGraph />, GetWindow(Windows.ValueGraph)!, "LineGraph");
}

const points: GraphPoint[] = [];
const pointsChanged = new Event();
let graphAPI: LineGraphField;

export function LoadGraph(graph: LineGraphField) {
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
	const [selectedPoint, setSelectedPoint] = useState(undefined as GraphPoint | undefined);
	const [selectedPointTimeLocked, setSelectedPointTimeLocked] = useState(false);
	const [windowSize, setWindowSize] = useState(new Vector2(0, 0));
	const [_, setForceRender] = useState(0);
	const lastClickTime = useRef(0);

	const ComparePoints = () => {
		const apiPoints = graphAPI!.GetPoints();
		for (let i = 0; i < points.size() - 2; i++) {
			if (points[i + 1].id !== apiPoints[i].id) {
				LoadGraph(graphAPI!);
				return true;
			}
		}

		return false;
	};

	const GetPointPosition = () => {
		const window = GetWindow(Windows.ValueGraph)!;
		const mousePosition = window.GetRelativeMousePosition();

		const percentX = (mousePosition.X - window.AbsoluteSize.X * 0.1) / (window.AbsoluteSize.X * 0.8);
		const percentY = (mousePosition.Y - window.AbsoluteSize.Y * 0.1) / (window.AbsoluteSize.Y * 0.8 - BOTTOM_SIZE);

		const x = RoundDecimal(math.clamp(percentX, 0, 1), 0.01);
		const y = RoundDecimal(math.clamp(1 - percentY, 0, 1), 0.01);

		return [x, y];
	};

	const UpdatePoint = (id: number, timeLock: number) => {
		const [time, value] = GetPointPosition();

		if (timeLock !== -1) {
			graphAPI!.UpdateGraphPoint(id, timeLock, value);
		} else {
			graphAPI!.UpdateGraphPoint(id, time, value);
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
		graphAPI!.RemoveGraphPoint(id);
		LoadGraph(graphAPI!);
	};

	const OnBackgroundClick = () => {
		if (os.clock() - lastClickTime.current < DOUBLE_CLICK_TIME) {
			const [x, y] = GetPointPosition();
			graphAPI!.AddGraphPoint(x, y);
			LoadGraph(graphAPI!);
			return;
		}

		lastClickTime.current = os.clock();
	};

	const SelectPoint = (id: number, isTimeLocked: boolean) => {
		const point = points.find((point) => point.id === id);
		setSelectedPoint(point);
		setSelectedPointTimeLocked(isTimeLocked);
	};

	const OnTimeInputChanged = (time: number) => {
		if (selectedPointTimeLocked) return;

		graphAPI.UpdateGraphPoint(selectedPoint!.id, math.clamp(time, 0, 1), selectedPoint!.value);

		if (ComparePoints()) return;

		selectedPoint!.time = time;
		pointsChanged.Fire();
	};

	const OnValueInputChanged = (value: number) => {
		print(selectedPoint!.id); // why is this always the first selected point????????????
		// it updates everywhere else????
		graphAPI.UpdateGraphPoint(selectedPoint!.id, selectedPoint!.time, math.clamp(value, 0, 1));

		if (ComparePoints()) return;

		selectedPoint!.value = value;
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
			<Div BackgroundColor={StyleColors.Background} onMouseButton1Down={OnBackgroundClick}>
				{/* Horizontal */}
				<frame
					AnchorPoint={new Vector2(0, 0.5)}
					Position={new UDim2(0, 0, 0.1, 0)}
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
			</Div>
			{points.map((point, index) => {
				const positionPercent = new Vector2(
					RemapValue(point.time, 0, 1, 0.1, 0.9),
					RemapValue(1 - point.value, 0, 1, 0.1, 0.9),
				);

				const position = UDim2.fromOffset(
					positionPercent.X * windowSize.X,
					positionPercent.Y * windowSize.Y - (1 - point.value) * BOTTOM_SIZE,
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
			{points.map((_, index) => {
				if (index === points.size() - 1) return;

				const p1 = points[index];
				const p2 = points[index + 1];

				const startTimePercent = RemapValue(p1.time, 0, 1, 0.1, 0.9);
				const startValuePercent = RemapValue(1 - p1.value, 0, 1, 0.1, 0.9);
				const startPos = new Vector2(
					startTimePercent * windowSize.X,
					startValuePercent * windowSize.Y - (1 - p1.value) * BOTTOM_SIZE,
				);

				const endTimePercent = RemapValue(p2.time, 0, 1, 0.1, 0.9);
				const endValuePercent = RemapValue(1 - p2.value, 0, 1, 0.1, 0.9);
				const endPos = new Vector2(
					endTimePercent * windowSize.X,
					endValuePercent * windowSize.Y - (1 - p2.value) * BOTTOM_SIZE,
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
						Text={selectedPoint === undefined ? "" : tostring(selectedPoint.time)}
						PlaceholderText={"..."}
						NumberChanged={OnTimeInputChanged}
						Disabled={selectedPoint === undefined || selectedPointTimeLocked}
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
						Text={selectedPoint === undefined ? "" : tostring(selectedPoint.value)}
						PlaceholderText={"..."}
						NumberChanged={OnValueInputChanged}
						Disabled={selectedPoint === undefined}
					/>
				</Div>
			</Div>
		</>
	);
}
