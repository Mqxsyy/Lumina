import Roact from "@rbxts/roact";
import { StyleColors, StyleProperties } from "Style";
import { Div } from "./Div";

interface Props {
	AnchorPoint?: Vector2;
	Position?: UDim2;
	Size?: UDim2;
	Text?: string;
}

export function PrimaryButton({
	AnchorPoint = new Vector2(0, 0),
	Position = new UDim2(0, 0, 0, 0),
	Size = UDim2.fromScale(1, 1),
	Text = "Button",
}: Props) {
	return (
		<Div AnchorPoint={AnchorPoint} Position={Position} Size={Size}>
			<uipadding
				PaddingBottom={new UDim(0, StyleProperties.BorderThicknes)}
				PaddingLeft={new UDim(0, StyleProperties.BorderThicknes)}
				PaddingRight={new UDim(0, StyleProperties.BorderThicknes)}
				PaddingTop={new UDim(0, StyleProperties.BorderThicknes)}
			/>
			<frame Size={UDim2.fromScale(1, 1)} BackgroundColor3={StyleColors.hex700} BorderSizePixel={0}>
				<uistroke Thickness={StyleProperties.BorderThicknes} Color={StyleColors.hex800} />
				<uicorner CornerRadius={StyleProperties.CornerRadius} />
				<textlabel
					Size={UDim2.fromScale(1, 1)}
					BackgroundTransparency={1}
					TextColor3={StyleColors.hex100}
					FontFace={new Font(StyleProperties.FontId, Enum.FontWeight.Bold)}
					TextSize={20}
					Text={Text}
				/>
			</frame>
		</Div>
	);
}
