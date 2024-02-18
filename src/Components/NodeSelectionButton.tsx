import Roact, { useState } from "@rbxts/roact";
import { Div } from "./Div";
import { StyleColors, StyleFont, StyleProperties } from "Style";

interface Props {
	Text: string;
}

export function NodeSelectionButton({ Text }: Props) {
	const [displayHighlight, setDisplayHighlight] = useState(false);

	const onHover = () => {
		setDisplayHighlight(true);
	};

	const onUnhover = () => {
		setDisplayHighlight(false);
	};

	return (
		<Div Size={new UDim2(1, 0, 0, 25)} onHover={onHover} onUnhover={onUnhover}>
			{displayHighlight && (
				<frame
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.95, 0.9)}
					BackgroundColor3={StyleColors.hex600}
				>
					<uicorner CornerRadius={StyleProperties.CornerRadius} />
				</frame>
			)}
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
