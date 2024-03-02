import { StyleColors, StyleText } from "Style";
import { TextInput } from "./TextInput";
import Roact from "@rbxts/roact";

interface Props {
	AnchorPoint?: Vector2;
	Position?: UDim2;
	Size?: UDim2;

	TextSize?: number;
	FontWeight?: Enum.FontWeight;
	TextColor?: Color3;
	TextXAlignment?: Enum.TextXAlignment;
	PlaceholderText: string;
	Text?: string;

	IsAffectedByZoom?: boolean;
	AllowNegative?: boolean;

	NumberChanged?: (number: number) => void;
}

export function NumberInput({
	AnchorPoint = Vector2.zero,
	Position = UDim2.fromScale(0, 0),
	Size = UDim2.fromScale(1, 1),
	TextSize = StyleText.FontSize,
	FontWeight = StyleText.FontWeight,
	TextColor = StyleColors.TextDark,
	TextXAlignment = Enum.TextXAlignment.Left,
	PlaceholderText,
	Text = "",
	IsAffectedByZoom = true,
	AllowNegative = false,
	NumberChanged = undefined,
}: Props) {
	const onTextChanged = (text: string) => {
		const number = tonumber(text);

		if (number === undefined) {
			if (AllowNegative) {
				if (text === "-") return text;
			}

			return "";
		}

		if (NumberChanged === undefined) return text;

		NumberChanged(number);
		return text;
	};

	return (
		<TextInput
			AnchorPoint={AnchorPoint}
			Position={Position}
			Size={Size}
			TextSize={TextSize}
			FontWeight={FontWeight}
			TextColor={TextColor}
			TextXAlignment={TextXAlignment}
			PlaceholderText={PlaceholderText}
			Text={Text}
			IsAffectedByZoom={IsAffectedByZoom}
			TextChanged={onTextChanged}
		/>
	);
}
