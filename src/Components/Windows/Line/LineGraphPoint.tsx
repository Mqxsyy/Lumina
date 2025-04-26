import React, { useRef } from "@rbxts/react";
import { RunService } from "@rbxts/services";
import Div from "Components/Div";
import { StyleColors } from "API/Style";

interface Props {
    Id: number;
    Position: UDim2;
    OnSelect: (id: number) => void;
    UpdatePoint: (id: number) => void;
    RemovePoint?: (id: number) => void;
}

export default function LineGraphPoint({ Id, Position, OnSelect, UpdatePoint, RemovePoint = undefined }: Props) {
    const isMovingRef = useRef(false);

    const onMouseButton1Down = () => {
        OnSelect(Id);

        if (!isMovingRef.current) {
            isMovingRef.current = true;

            task.wait(0.075);
            if (!isMovingRef.current) return;

            RunService.BindToRenderStep("MoveGraphPoint", Enum.RenderPriority.Input.Value, () => {
                UpdatePoint(Id);
            });
        }
    };

    const onMouseButton1Up = () => {
        isMovingRef.current = false;
        RunService.UnbindFromRenderStep("MoveGraphPoint");
    };

    const onMouseButton2Up = () => {
        if (RemovePoint === undefined) return;
        RemovePoint(Id);
    };

    return (
        <imagebutton
            AnchorPoint={new Vector2(0.5, 0.5)}
            Position={Position}
            Size={UDim2.fromOffset(10, 10)}
            BackgroundTransparency={1}
            ImageTransparency={1}
            AutoButtonColor={false}
        >
            <Div onMouseButton1Down={onMouseButton1Down} onMouseButton1Up={onMouseButton1Up} onMouseButton2Up={onMouseButton2Up} />
            <Div
                AnchorPoint={new Vector2(0.5, 0.5)}
                Position={UDim2.fromScale(0.5, 0.5)}
                Size={UDim2.fromOffset(6, 6)}
                BackgroundColor={StyleColors.Highlight}
            >
                <uicorner CornerRadius={new UDim(1, 0)} />
            </Div>
        </imagebutton>
    );
}
