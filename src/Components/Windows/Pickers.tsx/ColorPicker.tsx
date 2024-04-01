import Roact, { useEffect, useRef, useState } from "@rbxts/roact";
import Div from "Components/Div";
import { StyleColors } from "Style";
import { GetWindow, Windows } from "Windows/WindowSevice";
import PickerCursor from "./PickerCursor";
import { RunService } from "@rbxts/services";
import { ColorField } from "API/Fields/ColorField";
import { Event } from "API/Bindables/Event";

// TODO: add number field values

export function InitializeColorPicker() {
	Roact.mount(<ColorPicker />, GetWindow(Windows.ColorPicker)!, "LineGraph");
}

const blackGradient = new ColorSequence([
	new ColorSequenceKeypoint(0, Color3.fromRGB(0, 0, 0)),
	new ColorSequenceKeypoint(1, Color3.fromRGB(0, 0, 0)),
]);

const hueRangeGradient = new ColorSequence([
	new ColorSequenceKeypoint(0, Color3.fromRGB(255, 0, 0)),
	new ColorSequenceKeypoint(1 / 6, Color3.fromRGB(255, 255, 0)),
	new ColorSequenceKeypoint(2 / 6, Color3.fromRGB(0, 255, 0)),
	new ColorSequenceKeypoint(3 / 6, Color3.fromRGB(0, 255, 255)),
	new ColorSequenceKeypoint(4 / 6, Color3.fromRGB(0, 0, 255)),
	new ColorSequenceKeypoint(5 / 6, Color3.fromRGB(255, 0, 255)),
	new ColorSequenceKeypoint(1, Color3.fromRGB(255, 0, 0)),
]);

const transparency = new NumberSequence([new NumberSequenceKeypoint(0, 0), new NumberSequenceKeypoint(1, 1)]);

let colorPickerAPI: ColorField;
const colorPickerAPIChanged = new Event();

export function LoadColorPickerAPI(colorPicker: ColorField) {
	colorPickerAPI = colorPicker;
	colorPickerAPIChanged.Fire();
}

function ColorPicker() {
	const [cursor1, setCursor1] = useState(UDim2.fromScale(0, 0));
	const [cursor2, setCursor2] = useState(UDim2.fromScale(0, 0.5));

	const [hue, setHue] = useState(1);
	const [saturation, setSaturation] = useState(1);
	const [value, setValue] = useState(1);

	const window = useRef<DockWidgetPluginGui>();

	const onCursor1Down = () => {
		RunService.BindToRenderStep("ColorPickerCursor1", Enum.RenderPriority.Input.Value, () => {
			const mousePosition = window.current!.GetRelativeMousePosition();

			const paddingX = window.current!.AbsoluteSize.X * 0.1;
			const maxX = window.current!.AbsoluteSize.X * 0.8;
			const x = math.clamp(mousePosition.X - paddingX, 1, maxX - 4);

			const paddingY = window.current!.AbsoluteSize.Y * 0.1;
			const maxY = window.current!.AbsoluteSize.Y * 0.5;
			const y = math.clamp(mousePosition.Y - paddingY, 1, maxY - 4);

			setCursor1(UDim2.fromOffset(x - 4.5, y - 4.5));

			const saturation = math.clamp(x / maxX, 0, 1);
			setSaturation(saturation);
			colorPickerAPI.SetSaturation(saturation);

			const value = 1 - math.clamp(y / maxY, 0, 1);
			setValue(value);
			colorPickerAPI.SetValue(value);
		});
	};

	const onCursor1Up = () => {
		RunService.UnbindFromRenderStep("ColorPickerCursor1");
	};

	const onCursor2Down = () => {
		RunService.BindToRenderStep("ColorPickerCursor2", Enum.RenderPriority.Input.Value, () => {
			const mousePosition = window.current!.GetRelativeMousePosition();

			const paddingX = window.current!.AbsoluteSize.X * 0.1;
			const maxX = window.current!.AbsoluteSize.X * 0.8;
			const x = math.clamp(mousePosition.X - paddingX, 1, maxX - 4);

			setCursor2(new UDim2(0, x - 4.5, 0.5, 0));
			const hue = x / maxX;

			setHue(hue);
			colorPickerAPI.SetHue(hue);
		});
	};

	const onCursor2Up = () => {
		RunService.UnbindFromRenderStep("ColorPickerCursor2");
	};

	useEffect(() => {
		window.current = GetWindow(Windows.ColorPicker);
		colorPickerAPIChanged.Connect(() => {
			setHue(colorPickerAPI.hue);
			setSaturation(colorPickerAPI.saturation);
			setValue(colorPickerAPI.value);
		});
	}, []);

	useEffect(() => {
		if (window.current!.AbsoluteSize !== Vector2.zero) {
			const maxX = window.current!.AbsoluteSize.X * 0.8;
			const x = math.clamp(saturation * maxX, 1, maxX - 4);

			const maxY = window.current!.AbsoluteSize.Y * 0.5;
			const y = math.clamp((1 - value) * maxY, 1, maxY - 4);

			setCursor1(UDim2.fromOffset(x - 4.5, y - 4.5));
		}

		const connection = window.current!.GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
			const maxX = window.current!.AbsoluteSize.X * 0.8;
			const x = math.clamp(saturation * maxX, 1, maxX - 4);

			const maxY = window.current!.AbsoluteSize.Y * 0.5;
			const y = math.clamp((1 - value) * maxY, 1, maxY - 4);

			setCursor1(UDim2.fromOffset(x - 4.5, y - 4.5));
		});

		return () => connection.Disconnect();
	}, [saturation, value]);

	useEffect(() => {
		if (window.current!.AbsoluteSize !== Vector2.zero) {
			const maxX = window.current!.AbsoluteSize.X * 0.8;
			const x = math.clamp(hue * maxX, 1, maxX - 4);
			setCursor2(new UDim2(0, x - 4.5, 0.5, 0));
		}

		const connection = window.current!.GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
			const maxX = window.current!.AbsoluteSize.X * 0.8;
			const x = math.clamp(hue * maxX, 1, maxX - 4);
			setCursor2(new UDim2(0, x - 4.5, 0.5, 0));
		});

		return () => connection.Disconnect();
	}, [hue]);

	return (
		<Div BackgroundColor={StyleColors.Background}>
			<Div
				AnchorPoint={new Vector2(0.5, 0)}
				Size={UDim2.fromScale(0.8, 0.5)}
				Position={UDim2.fromScale(0.5, 0.1)}
				BackgroundColor={Color3.fromHex("#FFFFFF")}
				onMouseButton1Down={onCursor1Down}
				onMouseButton1Up={onCursor1Up}
			>
				<uicorner CornerRadius={new UDim(0, 6)} />

				<Div BackgroundColor={StyleColors.FullWhite}>
					<uicorner CornerRadius={new UDim(0, 6)} />
					<uigradient
						Color={
							new ColorSequence([
								new ColorSequenceKeypoint(0, Color3.fromHSV(hue, 1, 1)),
								new ColorSequenceKeypoint(1, Color3.fromHSV(hue, 1, 1)),
							])
						}
						Transparency={transparency}
						Rotation={180}
					/>
					<uistroke Color={StyleColors.Background} Thickness={1} />
				</Div>
				<Div BackgroundColor={StyleColors.FullWhite}>
					<uicorner CornerRadius={new UDim(0, 6)} />
					<uigradient Color={blackGradient} Transparency={transparency} Rotation={-90} />
					<uistroke Color={StyleColors.Background} Thickness={1} />
				</Div>
				<Div>
					<uipadding
						PaddingTop={new UDim(0, 6)}
						PaddingBottom={new UDim(0, 6)}
						PaddingLeft={new UDim(0, 6)}
						PaddingRight={new UDim(0, 6)}
					/>

					<PickerCursor Position={cursor1} />
				</Div>
			</Div>
			<Div
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.7)}
				Size={new UDim2(0.8, 0, 0, 10)}
				BackgroundColor={Color3.fromHex("#FFFFFF")}
				onMouseButton1Down={onCursor2Down}
				onMouseButton1Up={onCursor2Up}
			>
				<uicorner CornerRadius={new UDim(0, 6)} />
				<uigradient Color={hueRangeGradient} />
				<uipadding PaddingLeft={new UDim(0, 6)} PaddingRight={new UDim(0, 6)} />

				<PickerCursor Position={cursor2} />
			</Div>
			<Div
				AnchorPoint={new Vector2(0.5, 0)}
				Position={UDim2.fromScale(0.5, 0.8)}
				Size={UDim2.fromScale(0.8, 0.1)}
				BackgroundColor={Color3.fromHSV(hue, saturation, value)}
			/>
		</Div>
	);
}
