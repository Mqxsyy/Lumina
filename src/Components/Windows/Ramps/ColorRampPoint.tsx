import React, { useEffect, useRef } from "@rbxts/react";
import { RunService } from "@rbxts/services";
import { ColorPoint } from "API/Fields/ColorRampField";
import { RoundDecimal } from "API/Lib";
import Div from "Components/Div";
import { GetWindow, Windows } from "Windows/WindowSevice";
import { LoadColorPickerAPI } from "../Pickers.tsx/ColorPicker";

const DOUBLE_CLICK_TIME = 0.25;

interface Props {
    Point: ColorPoint;
    SetSelectedPoint: (point: ColorPoint) => void;
    UpdateTime?: (id: number, time: number) => void;
    RemovePoint?: (id: number) => void;
}

export default function ColorRampPoint({ Point, SetSelectedPoint, UpdateTime, RemovePoint }: Props) {
    const lastClickTime = useRef(0);
    const isMovingRef = useRef(false);
    const colorWindow = useRef<DockWidgetPluginGui>();

    const onMouseButton1Down = () => {
        SetSelectedPoint(Point);

        if (os.clock() - lastClickTime.current < DOUBLE_CLICK_TIME) {
            LoadColorPickerAPI(Point.color);
            colorWindow.current!.Enabled = true;
            return;
        }

        if (UpdateTime !== undefined && !isMovingRef.current) {
            isMovingRef.current = true;

            task.wait(0.075);
            if (!isMovingRef.current) return;

            RunService.BindToRenderStep("MoveColorRampPoint", Enum.RenderPriority.Input.Value, () => {
                const window = GetWindow(Windows.ColorRamp)!;
                const mousePosition = window.GetRelativeMousePosition();

                const padding = window.AbsoluteSize.X * 0.1;
                const max = window.AbsoluteSize.X * 0.8;
                const x = math.clamp(mousePosition.X - padding, 0, max);
                UpdateTime(Point.id, RoundDecimal(x / max, 0.01));
            });
        }

        lastClickTime.current = os.clock();
    };

    const onMouseButton1Up = () => {
        isMovingRef.current = false;
        if (UpdateTime === undefined) return;
        RunService.UnbindFromRenderStep("MoveColorRampPoint");
    };

    const onMouseButton2Down = () => {
        if (RemovePoint === undefined) return;
        RemovePoint(Point.id);
    };

    useEffect(() => {
        colorWindow.current = GetWindow(Windows.ColorPicker);
    }, []);

    return (
        <imagebutton
            AnchorPoint={new Vector2(0.5, 0)}
            Position={UDim2.fromScale(Point.time, 1)}
            Size={UDim2.fromOffset(15, 10)}
            BackgroundTransparency={1}
            ImageTransparency={1}
            AutoButtonColor={false}
        >
            <Div
                onMouseButton1Down={onMouseButton1Down}
                onMouseButton1Up={onMouseButton1Up}
                onMouseButton2Down={onMouseButton2Down}
            />
            <imagelabel
                AnchorPoint={new Vector2(0.5, 0)}
                Position={UDim2.fromScale(0.5, 0)}
                Size={UDim2.fromOffset(10, 10)}
                BackgroundTransparency={1}
                Image={"rbxassetid://13873199961"}
            />
        </imagebutton>
    );
}
