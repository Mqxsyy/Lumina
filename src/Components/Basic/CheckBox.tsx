import React from "@rbxts/react";
import Div from "Components/Div";
import { StyleColors } from "API/Style";
import { GetZoomScale } from "ZoomScale";

interface Props {
    AnchorPoint?: Vector2;
    Position?: UDim2;
    Size?: UDim2;
    IsAffectedByZoom?: boolean;
    IsChecked?: boolean;
    OnChecked: (newValue: boolean) => void;
}

export default function CheckBox({
    AnchorPoint = Vector2.zero,
    Position = UDim2.fromScale(0, 0),
    Size = UDim2.fromScale(1, 1),
    IsAffectedByZoom = true,
    IsChecked = false,
    OnChecked,
}: Props) {
    const zoomScale = GetZoomScale();

    return (
        <Div
            AnchorPoint={AnchorPoint}
            Position={Position}
            Size={IsAffectedByZoom ? new UDim2(Size.X.Scale, Size.X.Offset * zoomScale, Size.Y.Scale, Size.Y.Offset * zoomScale) : Size}
            BackgroundColor={StyleColors.Highlight}
            onMouseButton1Down={() => OnChecked(!IsChecked)}
        >
            <uicorner CornerRadius={new UDim(0, 10 * zoomScale)} />
            <uipadding
                PaddingLeft={new UDim(0, math.clamp(3 * zoomScale, 1, math.huge))}
                PaddingRight={new UDim(0, math.clamp(3 * zoomScale, 1, math.huge))}
                PaddingTop={new UDim(0, math.clamp(3 * zoomScale, 1, math.huge))}
                PaddingBottom={new UDim(0, math.clamp(3 * zoomScale, 1, math.huge))}
            />

            {IsChecked && (
                <Div AnchorPoint={new Vector2(0.5, 0.5)} Position={UDim2.fromScale(0.5, 0.5)} BackgroundColor={StyleColors.Primary}>
                    <uicorner CornerRadius={new UDim(0, 10 * zoomScale)} />
                </Div>
            )}
        </Div>
    );
}
