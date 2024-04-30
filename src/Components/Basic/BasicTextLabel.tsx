import Roact, { useEffect, useState } from "@rbxts/roact";
import { StyleColors, StyleText } from "Style";
import { GetZoomScale, ZoomScaleChanged } from "ZoomScale";

interface Props {
	AnchorPoint?: Vector2;
	Position?: UDim2;
	Size?: UDim2;

	FontWeight?: Enum.FontWeight;
	TextSize?: number;
	TextColor?: Color3;
	TextXAlignment?: "Left" | "Center" | "Right";
	TextYAlignment?: "Top" | "Center" | "Bottom";
	Text: string;

	IsAffectedByZoom?: boolean;
}

export function BasicTextLabel({
	AnchorPoint = Vector2.zero,
	Position = UDim2.fromScale(0, 0),
	Size = UDim2.fromScale(1, 1),
	TextSize = StyleText.FontSize,
	FontWeight = StyleText.FontWeight,
	TextColor = StyleColors.TextLight,
	TextXAlignment = "Left",
	TextYAlignment = "Center",
	IsAffectedByZoom = true,
	Text,
}: Props) {
	const zoomScale = GetZoomScale();

	return (
		<textlabel
			AnchorPoint={AnchorPoint}
			Position={Position}
			Size={
				IsAffectedByZoom
					? new UDim2(Size.X.Scale, Size.X.Offset, Size.Y.Scale, Size.Y.Offset * zoomScale)
					: Size
			}
			BackgroundTransparency={1}
			BorderSizePixel={0}
			TextSize={IsAffectedByZoom ? TextSize * zoomScale : TextSize}
			FontFace={new Font(StyleText.FontId, FontWeight)}
			TextColor3={TextColor}
			TextXAlignment={TextXAlignment}
			TextYAlignment={TextYAlignment}
			Text={Text}
		/>
	);
}
