import Roact, { useEffect, useRef, useState } from "@rbxts/roact";
import { Event } from "API/Bindables/Event";
import { ColorPoint, ColorRampField } from "API/Fields/ColorRampField";
import Div from "Components/Div";
import { StyleColors } from "Style";
import { GetWindow, Windows } from "Windows/WindowSevice";
import ColorRampPoint from "./ColorRampPoint";
import { NumberInput } from "Components/Basic/NumberInput";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { RoundDecimal } from "API/Lib";

const DOUBLE_CLICK_TIME = 0.25;

export function InitializeColorRamp() {
	Roact.mount(<ColorRamp />, GetWindow(Windows.ColorRamp)!, "LineGraph");
}

let loadedRampAPI: ColorRampField;
const loadedRampChanged = new Event();

const placeholderGradient = new ColorSequence([
	new ColorSequenceKeypoint(0, Color3.fromRGB(0, 0, 0)),
	new ColorSequenceKeypoint(1, Color3.fromRGB(255, 255, 255)),
]);

export function LoadColorRampAPI(ramp: ColorRampField) {
	loadedRampAPI = ramp;
	loadedRampChanged.Fire();
}

function ColorRamp() {
	const [forceRender, setForceRender] = useState(0);
	const [rampAPI, setRampAPI] = useState<ColorRampField>();
	const [selectedPoint, setSelectedPoint] = useState<ColorPoint | undefined>();

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
			const newPoint = rampAPI.AddPoint(RoundDecimal(percentX, 0.01), new Vector3(0, 0, 1));
			setSelectedPoint(newPoint);

			setForceRender((prev) => (prev > 10 ? 0 : ++prev));
			return;
		}

		lastClickTime.current = os.clock();
	};

	const selectPoint = (point: ColorPoint) => {
		setSelectedPoint(point);
	};

	const updatePointTime = (id: number, time: number) => {
		if (rampAPI === undefined) return;

		rampAPI.UpdatePointTime(id, time);
		setForceRender((prev) => (prev > 10 ? 0 : ++prev));
	};

	const removePoint = (id: number) => {
		if (rampAPI === undefined) return;

		rampAPI.RemovePoint(id);
		setForceRender((prev) => (prev > 10 ? 0 : ++prev));
	};

	useEffect(() => {
		const connection = loadedRampChanged.Connect(() => {
			if (loadedRampAPI !== undefined) {
				setRampAPI(loadedRampAPI);
				setSelectedPoint(undefined);
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
				AnchorPoint={new Vector2(0.5, 0)}
				Position={UDim2.fromScale(0.5, 0.2)}
				Size={UDim2.fromScale(0.8, 0.3)}
				BackgroundColor={StyleColors.FullWhite}
				onMouseButton1Down={onClick}
			>
				<uigradient Color={rampAPI === undefined ? placeholderGradient : rampAPI.GetGradient()} />

				{rampAPI?.GetAllPoints().map((point, _) => {
					return (
						<ColorRampPoint
							key={point.id}
							Point={point}
							SetSelectedPoint={selectPoint}
							UpdateTime={point.canEditTime ? updatePointTime : undefined}
							RemovePoint={point.canEditTime ? removePoint : undefined}
						/>
					);
				})}
			</Div>
			<Div
				Position={UDim2.fromScale(0, 0.7)}
				Size={UDim2.fromScale(1, 0.3)}
				BackgroundColor={StyleColors.Primary}
			>
				<uilistlayout FillDirection={Enum.FillDirection.Horizontal} Padding={new UDim(0, 10)} />

				<Div Size={UDim2.fromScale(0.5, 1)}>
					<uilistlayout
						FillDirection={Enum.FillDirection.Horizontal}
						VerticalAlignment={"Center"}
						HorizontalAlignment={"Center"}
						Padding={new UDim(0, 10)}
					/>

					<BasicTextLabel Size={new UDim2(0.4, 0, 0, 20)} Text={"Time:"} TextXAlignment={"Right"} />
					{selectedPoint !== undefined ? (
						<NumberInput
							Size={new UDim2(0.4, 0, 0, 20)}
							Text={tostring(selectedPoint.time)}
							Disabled={!selectedPoint.canEditTime}
							NumberChanged={(number) => updatePointTime(selectedPoint.id, number)}
						/>
					) : (
						<NumberInput Size={new UDim2(0.4, 0, 0, 20)} Disabled={true} />
					)}
				</Div>
				<Div Size={UDim2.fromScale(0.5, 1)}>
					<Div
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.8, 0.5)}
						BackgroundColor={StyleColors.FullWhite}
					/>
				</Div>
			</Div>
		</Div>
	);
}
