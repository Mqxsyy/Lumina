import Roact from "@rbxts/roact";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { StyleColors, StyleProperties } from "Style";

interface Props {
	AnchorPoint?: Vector2;
	Position?: UDim2;
	Size?: UDim2;
	Text?: string;
}

export function ControlButton({
	AnchorPoint = new Vector2(0, 0),
	Position = new UDim2(0, 0, 0, 0),
	Size = UDim2.fromScale(1, 1),
	Text = "Button",
}: Props) {
	return (
		<frame
			AnchorPoint={AnchorPoint}
			Position={Position}
			Size={Size}
			BackgroundColor3={StyleColors.Primary}
			BorderSizePixel={0}
		>
			<uicorner CornerRadius={StyleProperties.CornerRadius} />
			<BasicTextLabel
				Text={Text}
				TextSize={20}
				FontWeight={Enum.FontWeight.Bold}
				TextXAlignment={Enum.TextXAlignment.Center}
				IsAffectedByZoom={false}
			/>
		</frame>
	);
}
