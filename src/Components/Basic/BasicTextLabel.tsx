import React, { type PropsWithChildren } from "@rbxts/react";
import { StyleColors, StyleText } from "API/Style";
import { GetZoomScale } from "ZoomScale";

interface Props {
    AnchorPoint?: Vector2;
    Position?: UDim2;
    Size?: UDim2;
    AutomaticSize?: "None" | "X" | "Y" | "XY";

    FontWeight?: Enum.FontWeight;
    TextSize?: number;
    TextColor?: Color3;
    TextXAlignment?: "Left" | "Center" | "Right";
    TextYAlignment?: "Top" | "Center" | "Bottom";
    TextWrapped?: boolean;
    TextTruncate?: "None" | "AtEnd" | "SplitWord";
    Text: string;

    ZIndex?: number;

    IsAffectedByZoom?: boolean;
}

export function BasicTextLabel({
    AnchorPoint = Vector2.zero,
    Position = UDim2.fromScale(0, 0),
    Size = UDim2.fromScale(1, 1),
    AutomaticSize = "None",
    TextSize = StyleText.FontSize,
    FontWeight = StyleText.FontWeight,
    TextColor = StyleColors.TextLight,
    TextXAlignment = "Left",
    TextYAlignment = "Center",
    TextWrapped = false,
    TextTruncate = "None",
    Text,
    ZIndex = 1,
    IsAffectedByZoom = true,
    children,
}: PropsWithChildren<Props>) {
    const zoomScale = GetZoomScale();

    return (
        <textlabel
            AnchorPoint={AnchorPoint}
            Position={Position}
            Size={IsAffectedByZoom ? new UDim2(Size.X.Scale, Size.X.Offset, Size.Y.Scale, Size.Y.Offset * zoomScale) : Size}
            AutomaticSize={AutomaticSize}
            BackgroundTransparency={1}
            BorderSizePixel={0}
            TextSize={IsAffectedByZoom ? TextSize * zoomScale : TextSize}
            FontFace={new Font(StyleText.FontId, FontWeight)}
            TextColor3={TextColor}
            TextXAlignment={TextXAlignment}
            TextYAlignment={TextYAlignment}
            TextWrapped={TextWrapped}
            TextTruncate={TextTruncate}
            Text={Text}
            ZIndex={ZIndex}
        >
            {children}
        </textlabel>
    );
}
