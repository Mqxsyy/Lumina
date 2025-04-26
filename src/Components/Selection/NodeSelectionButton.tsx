import React, { useState } from "@rbxts/react";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { StyleColors, StyleProperties } from "API/Style";

interface Props {
    ElementName: string;
    Text: string;
    ToggleSelection: () => void;
    CreateFn?: () => void;
}

export function NodeSelectionButton({ ElementName, Text, ToggleSelection, CreateFn }: Props) {
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

        ToggleSelection();
    };

    return (
        <imagebutton
            key={ElementName}
            Size={new UDim2(1, 0, 0, 25)}
            BackgroundTransparency={1}
            ImageTransparency={1}
            Event={{
                MouseEnter: onHover,
                MouseLeave: onUnhover,
                MouseButton1Down: onClick,
            }}
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

            <BasicTextLabel Text={Text} TextXAlignment={"Center"} IsAffectedByZoom={false} ZIndex={2} />
        </imagebutton>
    );
}
