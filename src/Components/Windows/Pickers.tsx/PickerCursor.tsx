import React from "@rbxts/react";
import Div from "Components/Div";
import { StyleColors } from "API/Style";

interface Props {
    Position: UDim2;
}

export default function PickerCursor({ Position }: Props) {
    return (
        <Div AnchorPoint={new Vector2(0.5, 0.5)} Position={Position} Size={UDim2.fromOffset(6, 6)}>
            <Div>
                <uicorner CornerRadius={new UDim(1, 0)} />
                <uistroke Color={StyleColors.FullWhite} Thickness={3} />
            </Div>
        </Div>
    );
}
