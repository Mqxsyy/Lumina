import Roact, { useEffect, useRef, useState } from "@rbxts/roact";
import Div from "Components/Div";
import { StyleColors } from "Style";
import { GetWindow, Windows } from "Windows/WindowSevice";
import ColorRampPoint from "./ColorRampPoint";
import { ColorPoint, ColorRampField } from "API/Fields/ColorRampField";
import { Event } from "API/Bindables/Event";

// TODO: add number field values

const DOUBLE_CLICK_TIME = 0.25;

export function InitializeColorRamp() {
	Roact.mount(<ColorRamp />, GetWindow(Windows.ColorRamp)!, "LineGraph");
}

const points: ColorPoint[] = [];
const pointsChanged = new Event();
let rampAPI: ColorRampField;

let gradient = new ColorSequence([
	new ColorSequenceKeypoint(0, Color3.fromRGB(255, 255, 255)),
	new ColorSequenceKeypoint(1, Color3.fromRGB(0, 0, 0)),
]);

export function LoadColorRampAPI(ramp: ColorRampField) {
	points.clear();

	rampAPI = ramp;
	points.push(ramp.startPoint);
	ramp.colorPoints.forEach((point) => {
		points.push(point);
	});
	points.push(ramp.endPoint);

	UpdateGradient();
	pointsChanged.Fire();
}

function UpdateGradient() {
	const keypoints = points.map((point) => new ColorSequenceKeypoint(point.time, point.color.GetColor()));
	gradient = new ColorSequence(keypoints);
}

function ColorRamp() {
	const [_, setForceRender] = useState(0);
	const lastClickTime = useRef(0);

	const onClick = () => {
		if (os.clock() - lastClickTime.current < DOUBLE_CLICK_TIME) {
			if (points.size() >= 20) {
				warn("Max amount of color gradient points reached");
				return;
			}

			const window = GetWindow(Windows.ColorRamp)!;
			const mousePosition = window.GetRelativeMousePosition();

			const percentX = (mousePosition.X - window.AbsoluteSize.X * 0.1) / (window.AbsoluteSize.X * 0.8);
			rampAPI.AddRampPoint(percentX, new Vector3(0, 0, 1));
			LoadColorRampAPI(rampAPI);

			return;
		}

		lastClickTime.current = os.clock();
	};

	const updatePointTime = (id: number, time: number) => {
		const index = points.findIndex((point) => point.id === id);
		if (index === -1) return;

		rampAPI.UpdateRampPointTime(id, time);

		const apiPoints = rampAPI!.GetPoints();
		for (let i = 0; i < points.size() - 2; i++) {
			if (points[i + 1].id !== apiPoints[i].id) {
				LoadColorRampAPI(rampAPI!);
				return;
			}
		}

		points[index].time = time;
		UpdateGradient();
		pointsChanged.Fire();
	};

	const removePoint = (id: number) => {
		rampAPI.RemoveRampPoint(id);
		LoadColorRampAPI(rampAPI);
	};

	useEffect(() => {
		const connections: RBXScriptConnection[] = [];

		const changedConnection = pointsChanged.Connect(() => {
			connections.forEach((connection) => connection.Disconnect());
			setForceRender((prev) => (prev > 10 ? 0 : ++prev));

			points.forEach((point) => {
				const connection = point.color.FieldChanged.Connect(() => {
					UpdateGradient();
					setForceRender((prev) => (prev > 10 ? 0 : ++prev));
				});

				connections.push(connection);
			});
		});

		return () => {
			changedConnection.Disconnect();
			connections.forEach((connection) => connection.Disconnect());
		};
	}, []);

	return (
		<Div BackgroundColor={StyleColors.Background}>
			<Div
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.4)}
				Size={UDim2.fromScale(0.8, 0.5)}
				BackgroundColor={StyleColors.FullWhite}
				onMouseButton1Down={onClick}
			>
				<uigradient Color={gradient} />

				{points.map((point, index) => {
					return (
						<ColorRampPoint
							Id={point.id}
							Position={UDim2.fromScale(point.time, 1)}
							Color={point.color}
							UpdateTime={index === 0 || index === points.size() - 1 ? undefined : updatePointTime}
							RemovePoint={index === 0 || index === points.size() - 1 ? undefined : removePoint}
						/>
					);
				})}
			</Div>
		</Div>
	);
}
