import React from "@rbxts/react";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { StyleColors, StyleProperties } from "Style";

interface Props {
    AnchorPoint?: Vector2;
    Position?: UDim2;
    Size?: UDim2;
    Text?: string;
    MouseButton1Down?: () => void;
}

export function ControlButton({
    AnchorPoint = new Vector2(0, 0),
    Position = new UDim2(0, 0, 0, 0),
    Size = UDim2.fromScale(1, 1),
    Text = "Button",
    MouseButton1Down = undefined,
}: Props) {
    return (
        <frame
            AnchorPoint={AnchorPoint}
            Position={Position}
            Size={Size}
            BackgroundColor3={StyleColors.Primary}
            BorderSizePixel={0}
            Event={{
                InputBegan: (_, inputObject) => {
                    if (inputObject.UserInputType === Enum.UserInputType.MouseButton1) {
                        if (MouseButton1Down === undefined) return;
                        MouseButton1Down();
                    }
                },
            }}
        >
            <uicorner CornerRadius={StyleProperties.CornerRadius} />
            <BasicTextLabel
                Text={Text}
                TextSize={20}
                FontWeight={Enum.FontWeight.Bold}
                TextXAlignment={"Center"}
                IsAffectedByZoom={false}
            />
        </frame>
    );
}
