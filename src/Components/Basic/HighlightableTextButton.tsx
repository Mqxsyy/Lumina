import React, { useState } from "@rbxts/react";
import Div from "Components/Div";
import { StyleColors, StyleProperties, StyleText } from "API/Style";
import { GetZoomScale } from "ZoomScale";

interface Props {
    AnchorPoint?: Vector2;
    Position?: UDim2;
    Size?: UDim2;
    AutomaticSize?: "None" | "X" | "Y" | "XY";

    Text: string;

    IsAffectedByZoom?: boolean;

    OnClick?: () => void;
}

export default function HighlightableTextButton({
    AnchorPoint = Vector2.zero,
    Position = UDim2.fromScale(0, 0),
    Size = UDim2.fromScale(0, 0),
    AutomaticSize = "XY",
    Text,
    IsAffectedByZoom = true,
    OnClick = undefined,
}: Props) {
    const [displayHighlight, setDisplayHighlight] = useState(false);
    const zoomScale = GetZoomScale();

    const onHover = () => {
        setDisplayHighlight(true);
    };

    const onUnhover = () => {
        setDisplayHighlight(false);
    };

    const onClick = () => {
        if (OnClick === undefined) return;
        OnClick();
    };

    return (
        <Div
            AnchorPoint={AnchorPoint}
            Position={Position}
            Size={Size}
            AutomaticSize={AutomaticSize}
            BackgroundColor={displayHighlight ? StyleColors.Highlight : StyleColors.Primary}
        >
            <uicorner CornerRadius={StyleProperties.CornerRadius} />
            <uipadding
                PaddingLeft={new UDim(0, math.clamp(4 * zoomScale, 1, math.huge))}
                PaddingRight={new UDim(0, math.clamp(4 * zoomScale, 1, math.huge))}
            />

            <textbutton
                Size={Size}
                AutomaticSize={AutomaticSize}
                Text={Text}
                TextColor3={StyleColors.TextLight}
                TextSize={IsAffectedByZoom ? StyleText.FontSize * zoomScale : StyleText.FontSize}
                TextXAlignment={"Center"}
                TextYAlignment={"Center"}
                TextWrapped={true}
                FontFace={new Font(StyleText.FontId, StyleText.FontWeight)}
                BackgroundTransparency={1}
                AutoButtonColor={false}
                Event={{
                    MouseEnter: onHover,
                    MouseLeave: onUnhover,
                    MouseButton1Down: onClick,
                }}
            />
        </Div>
    );
}
