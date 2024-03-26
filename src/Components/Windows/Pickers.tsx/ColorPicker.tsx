import Roact from "@rbxts/roact";
import Div from "Components/Div";
import { StyleColors } from "Style";
import { GetWindow, Windows } from "Windows/WindowSevice";
import PickerCursor from "./PickerCursor";

export function InitializeColorPicker() {
	Roact.mount(<ColorPicker />, GetWindow(Windows.ColorPicker)!, "LineGraph");
}

const colorSequence1 = new ColorSequence([
	new ColorSequenceKeypoint(0, Color3.fromRGB(255, 0, 0)),
	new ColorSequenceKeypoint(1, Color3.fromRGB(255, 0, 0)),
]);

const colorSequence2 = new ColorSequence([
	new ColorSequenceKeypoint(0, Color3.fromRGB(0, 0, 0)),
	new ColorSequenceKeypoint(1, Color3.fromRGB(0, 0, 0)),
]);

const colorSequence3 = new ColorSequence([
	new ColorSequenceKeypoint(0, Color3.fromRGB(255, 0, 0)),
	new ColorSequenceKeypoint(1 / 6, Color3.fromRGB(255, 255, 0)),
	new ColorSequenceKeypoint(2 / 6, Color3.fromRGB(0, 255, 0)),
	new ColorSequenceKeypoint(3 / 6, Color3.fromRGB(0, 255, 255)),
	new ColorSequenceKeypoint(4 / 6, Color3.fromRGB(0, 0, 255)),
	new ColorSequenceKeypoint(5 / 6, Color3.fromRGB(255, 0, 255)),
	new ColorSequenceKeypoint(1, Color3.fromRGB(255, 0, 0)),
]);

const transparency = new NumberSequence([new NumberSequenceKeypoint(0, 0), new NumberSequenceKeypoint(1, 1)]);

function ColorPicker() {
	return (
		<Div BackgroundColor={StyleColors.Background}>
			{/* padding */}

			<Div
				AnchorPoint={new Vector2(0.5, 0)}
				Position={UDim2.fromScale(0.5, 0.1)}
				Size={UDim2.fromScale(0.75, 0.5)}
				BackgroundColor={Color3.fromHex("#FFFFFF")}
			>
				<uicorner CornerRadius={new UDim(0, 6)} />

				<Div BackgroundColor={StyleColors.FullWhite}>
					<uicorner CornerRadius={new UDim(0, 6)} />
					<uigradient Color={colorSequence1} Transparency={transparency} Rotation={180} />
					<uistroke Color={StyleColors.Background} Thickness={1} />
				</Div>
				<Div BackgroundColor={StyleColors.FullWhite}>
					<uicorner CornerRadius={new UDim(0, 6)} />
					<uigradient Color={colorSequence2} Transparency={transparency} Rotation={-90} />
					<uistroke Color={StyleColors.Background} Thickness={1} />
				</Div>
				<Div>
					<uipadding
						PaddingTop={new UDim(0, 6)}
						PaddingBottom={new UDim(0, 6)}
						PaddingLeft={new UDim(0, 6)}
						PaddingRight={new UDim(0, 6)}
					/>

					<PickerCursor Position={UDim2.fromScale(0, 0)} />
				</Div>
			</Div>
			<Div
				AnchorPoint={new Vector2(0.5, 0)}
				Position={UDim2.fromScale(0.5, 0.65)}
				Size={new UDim2(0.75, 0, 0, 10)}
				BackgroundColor={Color3.fromHex("#FFFFFF")}
			>
				<uicorner CornerRadius={new UDim(0, 6)} />
				<uigradient Color={colorSequence3} />
				<uipadding PaddingLeft={new UDim(0, 6)} PaddingRight={new UDim(0, 6)} />

				<PickerCursor Position={UDim2.fromScale(0, 0.5)} />
			</Div>
		</Div>
	);
}
