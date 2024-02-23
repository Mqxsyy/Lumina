import Roact, { useEffect, useState } from "@rbxts/roact";
import { StyleColors, StyleProperties, StyleText } from "Style";
import { GetZoomScale, ZoomScaleChanged } from "ZoomScale";

interface Props {
	AnchorPoint?: Vector2;
	Position?: UDim2;
	Size?: UDim2;

	FontWeight?: Enum.FontWeight;
	TextSize?: number;
	TextColor?: Color3;
	TextXAlignment?: Enum.TextXAlignment;
	PlaceholderText: string;

	IsAffectedByZoom?: boolean;
}

export function TextInput({
	AnchorPoint = Vector2.zero,
	Position = UDim2.fromScale(0, 0),
	Size = UDim2.fromScale(1, 1),
	TextSize = StyleText.FontSize,
	FontWeight = StyleText.FontWeight,
	TextColor = StyleColors.TextDark,
	TextXAlignment = Enum.TextXAlignment.Left,
	PlaceholderText,
	IsAffectedByZoom = true,
}: Props) {
	const [zoomScale, setZoomScale] = useState(GetZoomScale());

	useEffect(() => {
		if (!IsAffectedByZoom) return;

		ZoomScaleChanged.Connect((zoomScale) => {
			setZoomScale(zoomScale as number);
		});
	}, []);

	return (
		<textbox
			AnchorPoint={AnchorPoint}
			Position={Position}
			Size={Size}
			BackgroundColor3={StyleColors.Highlight}
			BorderSizePixel={0}
			TextSize={IsAffectedByZoom ? TextSize * zoomScale : TextSize}
			FontFace={new Font(StyleText.FontId, FontWeight)}
			TextColor3={TextColor}
			TextXAlignment={TextXAlignment}
			PlaceholderText={PlaceholderText}
			PlaceholderColor3={TextColor}
			TextWrapped={true}
			TextTruncate={Enum.TextTruncate.AtEnd}
			Text={""}
		>
			<uipadding PaddingLeft={new UDim(0, 5)} />
			<uicorner CornerRadius={StyleProperties.CornerRadius} />
		</textbox>
	);
}
