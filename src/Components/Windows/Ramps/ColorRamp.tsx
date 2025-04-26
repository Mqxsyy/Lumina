import React, { StrictMode, useEffect, useRef, useState } from "@rbxts/react";
import { createRoot } from "@rbxts/react-roblox";
import { Event } from "API/Bindables/Event";
import type { ColorPoint, ColorRampField } from "API/Fields/ColorRampField";
import { RoundDecimal } from "API/Lib";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { NumberInput } from "Components/Basic/NumberInput";
import Div from "Components/Div";
import { GetWindow, Windows } from "Services/WindowSevice";
import { StyleColors } from "API/Style";
import { LoadColorPickerAPI } from "../Pickers.tsx/ColorPicker";
import ColorRampPoint from "./ColorRampPoint";

const DOUBLE_CLICK_TIME = 0.25;

export function InitializeColorRamp() {
    const window = GetWindow(Windows.ColorRamp);
    const root = createRoot(window);
    root.render(
        <StrictMode>
            <ColorRamp />
        </StrictMode>,
    );
}

let loadedRampAPI: ColorRampField;
const loadedRampChanged = new Event();

const placeholderGradient = new ColorSequence([
    new ColorSequenceKeypoint(0, Color3.fromRGB(0, 0, 0)),
    new ColorSequenceKeypoint(1, Color3.fromRGB(255, 255, 255)),
]);

export function LoadColorRampAPI(ramp: ColorRampField) {
    loadedRampAPI = ramp;
    loadedRampChanged.Fire();
}

function ColorRamp() {
    const [forceRender, setForceRender] = useState(0);

    const rampAPIRef = useRef<ColorRampField>();
    const colorPickerWindowRef = useRef(GetWindow(Windows.ColorPicker));
    const selectedPointRef = useRef<ColorPoint | undefined>();
    const lastClickTime = useRef(0);

    const onClick = () => {
        if (rampAPIRef.current === undefined) return;

        if (os.clock() - lastClickTime.current < DOUBLE_CLICK_TIME) {
            if (rampAPIRef.current.CountPoints() >= 20) {
                warn("Max amount of color gradient points reached");
                return;
            }

            const window = GetWindow(Windows.ColorRamp);
            const mousePosition = window.GetRelativeMousePosition();

            const percentX = (mousePosition.X - window.AbsoluteSize.X * 0.1) / (window.AbsoluteSize.X * 0.8);
            const newPoint = rampAPIRef.current.AddPoint(RoundDecimal(percentX, 0.01), new Vector3(0, 0, 1));
            selectedPointRef.current = newPoint;

            setForceRender((prev) => prev + 1);
            return;
        }

        lastClickTime.current = os.clock();
    };

    const selectPoint = (point: ColorPoint) => {
        selectedPointRef.current = point;
        setForceRender((prev) => prev + 1);
    };

    const updatePointTime = (id: number, time: number) => {
        if (rampAPIRef.current === undefined) return;

        let validatedTime = time;
        if (validatedTime > 1) {
            validatedTime = 1;
        }

        rampAPIRef.current.UpdatePointTime(id, validatedTime);
        setForceRender((prev) => prev + 1);

        return time;
    };

    const removePoint = (id: number) => {
        if (rampAPIRef.current === undefined) return;

        rampAPIRef.current.RemovePoint(id);
        setForceRender((prev) => prev + 1);
    };

    const openColorPicker = () => {
        if (selectedPointRef.current === undefined) return;

        LoadColorPickerAPI(selectedPointRef.current.color);
        colorPickerWindowRef.current.Enabled = true;
    };

    useEffect(() => {
        const connection = loadedRampChanged.Connect(() => {
            if (loadedRampAPI !== undefined) {
                rampAPIRef.current = loadedRampAPI;
                selectedPointRef.current = undefined;
                setForceRender((prev) => prev + 1);
            }
        });

        return () => connection.Disconnect();
    }, []);

    useEffect(() => {
        const connections: RBXScriptConnection[] = [];
        let changedConnection: RBXScriptConnection;

        if (rampAPIRef.current !== undefined) {
            changedConnection = rampAPIRef.current.FieldChanged.Connect(() => {
                for (const connection of connections) connection.Disconnect();
                setForceRender((prev) => prev + 1);
            });

            for (const point of rampAPIRef.current.GetAllPoints()) {
                const connection = point.color.FieldChanged.Connect(() => {
                    setForceRender((prev) => prev + 1);
                });

                connections.push(connection);
            }
        }

        return () => {
            for (const connection of connections) connection.Disconnect();

            if (changedConnection !== undefined) {
                changedConnection.Disconnect();
            }
        };
    }, [rampAPIRef.current, forceRender]);

    return (
        <Div BackgroundColor={StyleColors.Background}>
            <Div
                AnchorPoint={new Vector2(0.5, 0)}
                Position={UDim2.fromScale(0.5, 0.2)}
                Size={UDim2.fromScale(0.8, 0.3)}
                BackgroundColor={StyleColors.FullWhite}
                onMouseButton1Down={onClick}
            >
                <uigradient Color={rampAPIRef.current === undefined ? placeholderGradient : rampAPIRef.current.GetGradient()} />

                {rampAPIRef.current?.GetAllPoints().map((point, _) => {
                    return (
                        <ColorRampPoint
                            key={`point_${point.id}`}
                            Point={point}
                            SetSelectedPoint={selectPoint}
                            UpdateTime={point.canEditTime ? updatePointTime : undefined}
                            RemovePoint={point.canEditTime ? removePoint : undefined}
                        />
                    );
                })}
            </Div>
            <Div Position={UDim2.fromScale(0, 0.7)} Size={UDim2.fromScale(1, 0.3)} BackgroundColor={StyleColors.Primary}>
                <uilistlayout FillDirection={Enum.FillDirection.Horizontal} Padding={new UDim(0, 10)} />

                <Div Size={UDim2.fromScale(0.5, 1)}>
                    <uilistlayout
                        FillDirection={Enum.FillDirection.Horizontal}
                        VerticalAlignment={"Center"}
                        HorizontalAlignment={"Center"}
                        Padding={new UDim(0, 10)}
                    />

                    <BasicTextLabel Size={new UDim2(0.4, 0, 0, 20)} Text={"Time:"} TextXAlignment={"Right"} IsAffectedByZoom={false} />
                    {selectedPointRef.current !== undefined ? (
                        <NumberInput
                            Size={new UDim2(0.4, 0, 0, 20)}
                            Text={tostring(selectedPointRef.current.time)}
                            Disabled={!selectedPointRef.current.canEditTime}
                            NumberChanged={(number) => updatePointTime((selectedPointRef.current as ColorPoint).id, number)}
                            IsAffectedByZoom={false}
                        />
                    ) : (
                        <NumberInput Size={new UDim2(0.4, 0, 0, 20)} Disabled={true} IsAffectedByZoom={false} />
                    )}
                </Div>
                <Div Size={UDim2.fromScale(0.5, 1)}>
                    {selectedPointRef.current && (
                        <Div
                            AnchorPoint={new Vector2(0.5, 0.5)}
                            Position={UDim2.fromScale(0.5, 0.5)}
                            Size={UDim2.fromScale(0.8, 0.5)}
                            BackgroundColor={(selectedPointRef.current as ColorPoint).color.GetColor()}
                            onMouseButton1Down={openColorPicker}
                        />
                    )}
                </Div>
            </Div>
        </Div>
    );
}
