import Roact, { useEffect, useRef, useState } from "@rbxts/roact";
import { GraphPoint, LineGraphField } from "API/Fields/LineGraphField";
import { RemapValue, RoundDecimal } from "API/Lib";
import Div from "Components/Div";
import { StyleColors } from "Style";
import { GetWindow, Windows } from "Windows/WindowSevice";
import LineGraphPoint from "./LineGraphPoint";
import { Event } from "API/Bindables/Event";

const DOUBLE_CLICK_TIME = 0.25;

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
	const [windowSize, setWindowSize] = useState(new Vector2(0, 0));
	const [_, setForceRender] = useState(0);
	const lastClickTime = useRef(0);

	const UpdatePoint = (id: number, time: number, value: number) => {
		const index = points.findIndex((point) => point.id === id);
		if (index === -1) return;

		points[index].time = time;
		points[index].value = value;

		graphAPI!.UpdateGraphPoint(id, time, value);
		pointsChanged.Fire();

		// may be less efficient than reloading each frame idk
		const apiPoints = graphAPI!.GetPoints();
		for (let i = 0; i < points.size() - 2; i++) {
			if (points[i + 1].id !== apiPoints[i].id) {
				LoadGraph(graphAPI!);
			}
		}
	};

	const RemovePoint = (id: number) => {
		graphAPI!.RemoveGraphPoint(id);
		LoadGraph(graphAPI!);
	};

	const OnBackgroundClick = () => {
		if (os.clock() - lastClickTime.current < DOUBLE_CLICK_TIME) {
			const window = GetWindow(Windows.ValueGraph)!;
			const mousePosition = window.GetRelativeMousePosition();

			const percentX = mousePosition.X / window.AbsoluteSize.X;
			const percentY = mousePosition.Y / window.AbsoluteSize.Y;

			const x = RoundDecimal(math.clamp(percentX, 0.1, 0.9), 0.01);
			const y = RoundDecimal(math.clamp(1 - percentY, 0.1, 0.9), 0.01);

			graphAPI!.AddGraphPoint(RemapValue(x, 0.1, 0.9, 0, 1), RemapValue(y, 0.1, 0.9, 0, 1));
			LoadGraph(graphAPI!);
			return;
		}

		lastClickTime.current = os.clock();
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
				<frame
					AnchorPoint={new Vector2(0, 0.5)}
					Position={UDim2.fromOffset(0, 0.1 * windowSize.Y)}
					Size={UDim2.fromOffset(windowSize.X, 1)}
					BackgroundColor3={StyleColors.FullWhite}
					BackgroundTransparency={0.75}
					BorderSizePixel={0}
				/>
				<frame
					AnchorPoint={new Vector2(0, 0.5)}
					Position={UDim2.fromOffset(0, 0.9 * windowSize.Y)}
					Size={UDim2.fromOffset(windowSize.X, 1)}
					BackgroundColor3={StyleColors.FullWhite}
					BackgroundTransparency={0.75}
					BorderSizePixel={0}
				/>
				<frame
					AnchorPoint={new Vector2(0.5, 0)}
					Position={UDim2.fromOffset(0.1 * windowSize.X, 0)}
					Size={UDim2.fromOffset(1, windowSize.Y)}
					BackgroundColor3={StyleColors.FullWhite}
					BackgroundTransparency={0.75}
					BorderSizePixel={0}
				/>
				<frame
					AnchorPoint={new Vector2(0.5, 0)}
					Position={UDim2.fromOffset(0.9 * windowSize.X, 0)}
					Size={UDim2.fromOffset(1, windowSize.Y)}
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

				const position = UDim2.fromOffset(positionPercent.X * windowSize.X, positionPercent.Y * windowSize.Y);

				if (index === 0 || index === points.size() - 1) {
					return (
						<LineGraphPoint
							key={point.id}
							Id={point.id}
							Position={position}
							LockHorizontal={index === 0 ? 0 : 1}
							UpdatePoint={UpdatePoint}
						/>
					);
				}

				return (
					<LineGraphPoint
						key={point.id}
						Id={point.id}
						Position={position}
						UpdatePoint={UpdatePoint}
						RemovePoint={RemovePoint}
					/>
				);
			})}
			{points.map((_, index) => {
				if (index === points.size() - 1) return;

				const p1 = points[index];
				const p2 = points[index + 1];

				const startPos = new Vector2(
					RemapValue(p1.time, 0, 1, 0.1, 0.9) * windowSize.X,
					RemapValue(1 - p1.value, 0, 1, 0.1, 0.9) * windowSize.Y,
				);

				const endPos = new Vector2(
					RemapValue(p2.time, 0, 1, 0.1, 0.9) * windowSize.X,
					RemapValue(1 - p2.value, 0, 1, 0.1, 0.9) * windowSize.Y,
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
		</>
	);
}
