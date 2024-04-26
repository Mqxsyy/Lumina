import Roact, { useState } from "@rbxts/roact";
import Div from "../Div";
import { StyleColors, StyleProperties } from "Style";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";

interface Props {
	ElementName: string;
	Text: string;
	CreateFn?: () => void;
}

export function NodeSelectionButton({ ElementName, Text, CreateFn }: Props) {
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
		<Div
			ElementName={ElementName}
			Size={new UDim2(1, 0, 0, 25)}
			onHover={onHover}
			onUnhover={onUnhover}
			onMouseButton1Down={onClick}
		>
			{displayHighlight && (
				<frame
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.95, 0.9)}
					BackgroundColor3={StyleColors.Highlight}
				>
					<uicorner CornerRadius={StyleProperties.CornerRadius} />
				</frame>
			)}

			<BasicTextLabel Text={Text} TextXAlignment={"Center"} IsAffectedByZoom={false} />
		</Div>
	);
}
