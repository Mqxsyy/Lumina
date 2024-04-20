import Roact, { useEffect, useRef, useState } from "@rbxts/roact";
import { Event } from "API/Bindables/Event";
import { ColorRampField } from "API/Fields/ColorRampField";
import Div from "Components/Div";
import { StyleColors } from "Style";
import { GetWindow, Windows } from "Windows/WindowSevice";
import ColorRampPoint from "./ColorRampPoint";

// TODO: add number field values

const DOUBLE_CLICK_TIME = 0.25;

export function InitializeColorRamp() {
	Roact.mount(<ColorRamp />, GetWindow(Windows.ColorRamp)!, "LineGraph");
}

let loadedRampAPI: ColorRampField;
const setRampApiEvent = new Event();

const placeholderGradient = new ColorSequence([
	new ColorSequenceKeypoint(0, Color3.fromRGB(0, 0, 0)),
	new ColorSequenceKeypoint(1, Color3.fromRGB(255, 255, 255)),
]);

export function LoadColorRampAPI(ramp: ColorRampField) {
	loadedRampAPI = ramp;
	setRampApiEvent.Fire();
}

function ColorRamp() {
	const [forceRender, setForceRender] = useState(0);
	const [rampAPI, setRampAPI] = useState<ColorRampField>();

	const lastClickTime = useRef(0);

	const onClick = () => {
		if (rampAPI === undefined) return;

		if (os.clock() - lastClickTime.current < DOUBLE_CLICK_TIME) {
			if (rampAPI.CountPoints() >= 20) {
				warn("Max amount of color gradient points reached");
				return;
			}

			const window = GetWindow(Windows.ColorRamp)!;
			const mousePosition = window.GetRelativeMousePosition();

			const percentX = (mousePosition.X - window.AbsoluteSize.X * 0.1) / (window.AbsoluteSize.X * 0.8);
			rampAPI.AddPoint(percentX, new Vector3(0, 0, 1));

			setForceRender((prev) => (prev > 10 ? 0 : ++prev));
			return;
		}

		lastClickTime.current = os.clock();
	};

	const updatePointTime = (id: number, time: number) => {
		if (rampAPI === undefined) return;

		const points = rampAPI.GetAllPoints();
		const index = points.findIndex((point) => point.id === id);
		if (index === -1) return;

		rampAPI.UpdatePointTime(id, time);

		points[index].time = time;
		setForceRender((prev) => (prev > 10 ? 0 : ++prev));
	};

	const removePoint = (id: number) => {
		if (rampAPI === undefined) return;

		rampAPI.RemovePoint(id);
		setForceRender((prev) => (prev > 10 ? 0 : ++prev));
	};

	useEffect(() => {
		const connection = setRampApiEvent.Connect(() => {
			if (loadedRampAPI !== undefined) {
				setRampAPI(loadedRampAPI);
				setForceRender((prev) => (prev > 10 ? 0 : ++prev));
			}
		});

		return () => connection.Disconnect();
	}, []);

	useEffect(() => {
		const connections: RBXScriptConnection[] = [];
		let changedConnection: RBXScriptConnection;

		if (rampAPI !== undefined) {
			changedConnection = rampAPI.FieldChanged.Connect(() => {
				connections.forEach((connection) => connection.Disconnect());
				setForceRender((prev) => (prev > 10 ? 0 : ++prev));
			});

			rampAPI.GetAllPoints().forEach((point) => {
				const connection = point.color.FieldChanged.Connect(() => {
					setForceRender((prev) => (prev > 10 ? 0 : ++prev));
				});

				connections.push(connection);
			});
		}

		return () => {
			connections.forEach((connection) => connection.Disconnect());

			if (changedConnection !== undefined) {
				changedConnection.Disconnect();
			}
		};
	}, [rampAPI, forceRender]);

	return (
		<Div BackgroundColor={StyleColors.Background}>
			<Div
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.4)}
				Size={UDim2.fromScale(0.8, 0.5)}
				BackgroundColor={StyleColors.FullWhite}
				onMouseButton1Down={onClick}
			>
				<uigradient Color={rampAPI === undefined ? placeholderGradient : rampAPI.GetGradient()} />

				{rampAPI?.GetAllPoints().map((point, index) => {
					return (
						<ColorRampPoint
							Id={point.id}
							key={point.id}
							Position={UDim2.fromScale(point.time, 1)}
							Color={point.color}
							UpdateTime={
								index === 0 || index === rampAPI.CountPoints() - 1 ? undefined : updatePointTime
							}
							RemovePoint={index === 0 || index === rampAPI.CountPoints() - 1 ? undefined : removePoint}
						/>
					);
				})}
			</Div>
		</Div>
	);
}
