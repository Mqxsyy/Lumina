import Roact from "@rbxts/roact";
import { Div } from "./Div";
import { StyleColors, StyleFont, StyleProperties } from "Style";

interface Props {
	Text: string;
}

export function NodeSelectionLabel({ Text }: Props) {
	return (
		<Div Size={new UDim2(1, 0, 0, 25)}>
			<textlabel
				Size={UDim2.fromScale(1, 1)}
				BackgroundTransparency={1}
				Text={Text}
				FontFace={StyleFont}
				TextColor3={StyleColors.hex100}
				TextXAlignment={"Center"}
				TextSize={StyleProperties.FontSize}
			/>
		</Div>
	);
}
