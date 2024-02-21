import Roact, { useState } from "@rbxts/roact";
import { Div } from "./Div";
import { StyleColors, StyleFont, StyleProperties } from "Style";

interface Props {
	Text: string;
	CreateFn?: () => void;
}

export function NodeSelectionButton({ Text, CreateFn }: Props) {
	const [displayHighlight, setDisplayHighlight] = useState(false);

	const onHover = () => {
		setDisplayHighlight(true);
	};

	const onUnhover = () => {
		setDisplayHighlight(false);
	};

	const onClick = () => {
		if (CreateFn !== undefined) {
			CreateFn();
		}
	};

	return (
		<Div Size={new UDim2(1, 0, 0, 25)} onHover={onHover} onUnhover={onUnhover} onMouseButton1Down={onClick}>
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
