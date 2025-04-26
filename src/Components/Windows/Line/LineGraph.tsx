import React, { StrictMode, useEffect, useRef, useState } from "@rbxts/react";
import { createRoot } from "@rbxts/react-roblox";
import { Event } from "API/Bindables/Event";
import { FastEvent } from "API/Bindables/FastEvent";
import type { GraphPoint, LineGraphField } from "API/Fields/LineGraphField";
import { LerpNumber, ReduceDecimals, RemapValue, RoundDecimal } from "API/Lib";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { NumberInput } from "Components/Basic/NumberInput";
import Div from "Components/Div";
import { StyleColors } from "API/Style";
import { GetWindow, Windows } from "Services/WindowSevice";
import LineGraphPoint from "./LineGraphPoint";

const DOUBLE_CLICK_TIME = 0.25;
const BOTTOM_SIZE = 50;

export function InitializeLineGraph() {
    const window = GetWindow(Windows.ValueGraph);
    const root = createRoot(window);
    root.render(
        <StrictMode>
            <LineGraph />
        </StrictMode>,
    );
}

let loadedGraphAPI: LineGraphField;
let maxValue = 1;
let minValue = 0;
const graphAPILoaded = new Event();
const graphAPIChanged = new FastEvent();

export function LoadGraph(graph: LineGraphField, max = 1, min = 0) {
    loadedGraphAPI = graph;
    maxValue = max;
    minValue = min;

    graphAPILoaded.Fire();
}

function LineGraph() {
    const [forceRender, setForceRender] = useState(0);
    const [windowSize, setWindowSize] = useState(Vector2.zero);

    const graphAPIRef = useRef<LineGraphField>();
    const lastClickTime = useRef(0);

    // need ref cuz state won't update properly inside a function
    const selectedPointRef = useRef(undefined as GraphPoint | undefined);

    const getMousePositionPercent = () => {
        const window = GetWindow(Windows.ValueGraph);
        const mousePosition = window.GetRelativeMousePosition();

        const percentX = (mousePosition.X - window.AbsoluteSize.X * 0.1) / (window.AbsoluteSize.X * 0.8);
        const percentY = (mousePosition.Y - window.AbsoluteSize.Y * 0.1) / (window.AbsoluteSize.Y * 0.8 - BOTTOM_SIZE);

        const x = RoundDecimal(math.clamp(percentX, 0, 1), 0.01);
        const y = RoundDecimal(math.clamp(1 - percentY, 0, 1), 0.01);

        return [x, y];
    };

    const updatePoint = (id: number) => {
        if (graphAPIRef.current === undefined) return;

        const [time, valuePercent] = getMousePositionPercent();
        const value = ReduceDecimals(RemapValue(valuePercent, 0, 1, minValue, maxValue));

        graphAPIRef.current.UpdatePoint(id, time, value);
    };

    const removePoint = (id: number) => {
        (graphAPIRef.current as LineGraphField).RemovePoint(id);
    };

    const onBackgroundClick = () => {
        if (os.clock() - lastClickTime.current < DOUBLE_CLICK_TIME) {
            const [time, valuePercent] = getMousePositionPercent();
            const value = ReduceDecimals(RemapValue(valuePercent, 0, 1, minValue, maxValue));

            const newPoint = (graphAPIRef.current as LineGraphField).AddPoint(time, value);
            selectPoint(newPoint.id);
            return;
        }

        lastClickTime.current = os.clock();
    };

    const selectPoint = (id: number) => {
        if (graphAPIRef.current === undefined) return;

        selectedPointRef.current = graphAPIRef.current.GetAllPoints().find((point) => point.id === id);
        setForceRender((prev) => prev + 1);
    };

    const controlsTimeChanged = (time: number) => {
        if (graphAPIRef.current === undefined || selectedPointRef.current === undefined) return;

        const clampedTime = math.clamp(time, 0, 1);
        graphAPIRef.current.UpdatePoint(selectedPointRef.current.id, clampedTime, selectedPointRef.current.value);

        return clampedTime;
    };

    const controlsValueChanged = (value: number) => {
        if (graphAPIRef.current === undefined || selectedPointRef.current === undefined) return;

        let validatedValue = value;
        if (validatedValue > maxValue) {
            validatedValue = maxValue;
        }

        if (validatedValue < minValue) {
            validatedValue = minValue;
        }

        graphAPIRef.current.UpdatePoint(selectedPointRef.current.id, selectedPointRef.current.time, validatedValue);
        return validatedValue;
    };

    const maxValueChanged = (number: number) => {
        let newValue = number;

        if (newValue <= 0) {
            newValue = 0.1;
        }

        newValue = ReduceDecimals(newValue, 2);

        const graph = graphAPIRef.current as LineGraphField;
        for (const point of graph.GetAllPoints()) {
            if (point.value < 0) continue;

            const pointValue = ReduceDecimals(RemapValue(point.value, 0, maxValue, 0, newValue), 1);
            graph.UpdatePoint(point.id, point.time, pointValue, false);
        }

        maxValue = newValue;
        graphAPIChanged.Fire();
        return newValue;
    };

    const minValueChanged = (number: number) => {
        let newValue = number;

        if (newValue >= 0) {
            newValue = -0.1;
        }

        newValue = ReduceDecimals(newValue, 2);

        const graph = graphAPIRef.current as LineGraphField;
        for (const point of graph.GetAllPoints()) {
            if (point.value > 0) continue;

            const pointValue = ReduceDecimals(RemapValue(point.value, minValue, 0, newValue, 0), 1);
            graph.UpdatePoint(point.id, point.time, pointValue, false);
        }

        minValue = newValue;
        graphAPIChanged.Fire();
        return newValue;
    };

    useEffect(() => {
        const loadedConnection = graphAPILoaded.Connect(() => {
            if (loadedGraphAPI === undefined) return;

            graphAPIRef.current = loadedGraphAPI;
            selectedPointRef.current = undefined;

            for (const point of loadedGraphAPI.GetAllPoints()) {
                if (point.value > maxValue) {
                    maxValue = point.value;
                }

                if (point.value < minValue) {
                    minValue = point.value;
                }
            }

            setForceRender((prev) => prev + 1);
        });

        const connection = graphAPIChanged.Connect(() => {
            setForceRender((prev) => prev + 1);
        });

        const window = GetWindow(Windows.ValueGraph);
        let resizeConnection: RBXScriptConnection;

        if (window !== undefined) {
            setWindowSize(window.AbsoluteSize);
            resizeConnection = window.GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
                setWindowSize(window.AbsoluteSize);
            });
        }

        return () => {
            loadedConnection.Disconnect();
            connection.Disconnect();

            if (resizeConnection !== undefined) {
                resizeConnection.Disconnect();
            }
        };
    }, []);

    useEffect(() => {
        if (graphAPIRef.current === undefined) return;

        const valuesChangedConnection = graphAPIRef.current.FieldChanged.Connect(() => {
            setForceRender((prev) => prev + 1);
        });

        return () => valuesChangedConnection.Disconnect();
    }, [graphAPIRef.current, forceRender]);

    return (
        <>
            {/* Background */}
            <Div BackgroundColor={StyleColors.Background} onMouseButton1Down={onBackgroundClick}>
                {/* Horizontal */}
                <Div>
                    <frame
                        AnchorPoint={new Vector2(0, 0.5)}
                        Position={UDim2.fromScale(0, 0.1)}
                        Size={UDim2.fromOffset(windowSize.X, 1)}
                        BackgroundColor3={StyleColors.FullWhite}
                        BackgroundTransparency={0.75}
                        BorderSizePixel={0}
                    />
                    {minValue !== 0 && (
                        <frame
                            AnchorPoint={new Vector2(0, 0.5)}
                            Position={
                                new UDim2(
                                    0,
                                    0,
                                    LerpNumber(0.1, 0.9, maxValue / (maxValue - minValue)),
                                    LerpNumber(0, -BOTTOM_SIZE, maxValue / (maxValue - minValue)),
                                )
                            }
                            Size={UDim2.fromOffset(windowSize.X, 1)}
                            BackgroundColor3={StyleColors.FullWhite}
                            BackgroundTransparency={0.75}
                            BorderSizePixel={0}
                        />
                    )}
                    <frame
                        AnchorPoint={new Vector2(0, 0.5)}
                        Position={new UDim2(0, 0, 0.9, -BOTTOM_SIZE)}
                        Size={UDim2.fromOffset(windowSize.X, 1)}
                        BackgroundColor3={StyleColors.FullWhite}
                        BackgroundTransparency={0.75}
                        BorderSizePixel={0}
                    />
                </Div>
                {/* Vertical */}
                <Div>
                    <frame
                        AnchorPoint={new Vector2(0.5, 0)}
                        Position={UDim2.fromOffset(0.1 * windowSize.X, 0)}
                        Size={new UDim2(0, 1, 1, -BOTTOM_SIZE)}
                        BackgroundColor3={StyleColors.FullWhite}
                        BackgroundTransparency={0.75}
                        BorderSizePixel={0}
                    />
                    <frame
                        AnchorPoint={new Vector2(0.5, 0)}
                        Position={UDim2.fromOffset(0.9 * windowSize.X, 0)}
                        Size={new UDim2(0, 1, 1, -BOTTOM_SIZE)}
                        BackgroundColor3={StyleColors.FullWhite}
                        BackgroundTransparency={0.75}
                        BorderSizePixel={0}
                    />
                </Div>
                {/* Max Value */}
                <NumberInput
                    AnchorPoint={new Vector2(1, 0)}
                    Position={new UDim2(0.1, -4, 0.1, 0)}
                    Size={new UDim2(0.1, 0, 0, 20)}
                    HideBackground={true}
                    Text={() => tostring(maxValue)}
                    TextColor={StyleColors.TextLight}
                    TextXAlignment={"Right"}
                    TextWrapped={false}
                    TextTruncate="None"
                    IsAffectedByZoom={false}
                    NumberChanged={maxValueChanged}
                />
                {/* Time Start */}
                <BasicTextLabel
                    AnchorPoint={new Vector2(0, 0)}
                    Position={new UDim2(0.1, 4, 0.9, -BOTTOM_SIZE)}
                    Size={new UDim2(0.1, 0, 0, 20)}
                    Text={"0"}
                    TextXAlignment={"Left"}
                    IsAffectedByZoom={false}
                />
                {/* Time End */}
                <BasicTextLabel
                    AnchorPoint={new Vector2(1, 0)}
                    Position={new UDim2(0.9, -4, 0.9, -BOTTOM_SIZE)}
                    Size={new UDim2(0.1, 0, 0, 20)}
                    Text={"1"}
                    TextXAlignment={"Right"}
                    IsAffectedByZoom={false}
                />
                {/* Min Value */}
                {minValue !== 0 ? (
                    <NumberInput
                        AnchorPoint={new Vector2(1, 0)}
                        Position={new UDim2(0.1, -4, 0.9, -BOTTOM_SIZE - 20)}
                        Size={new UDim2(0.1, 0, 0, 20)}
                        HideBackground={true}
                        Text={() => tostring(minValue)}
                        TextColor={StyleColors.TextLight}
                        TextXAlignment={"Right"}
                        TextWrapped={false}
                        TextTruncate="None"
                        IsAffectedByZoom={false}
                        NumberChanged={minValueChanged}
                        AllowNegative={true}
                    />
                ) : (
                    <BasicTextLabel
                        AnchorPoint={new Vector2(1, 0)}
                        Position={new UDim2(0.1, -4, 0.9, -BOTTOM_SIZE - 20)}
                        Size={new UDim2(0.1, 0, 0, 20)}
                        Text={"0"}
                        TextXAlignment={"Right"}
                        IsAffectedByZoom={false}
                    />
                )}
            </Div>
            {/* Points */}
            <Div>
                {graphAPIRef.current?.GetAllPoints().map((point, index) => {
                    const positionPercent = new Vector2(
                        RemapValue(point.time, 0, 1, 0.1, 0.9),
                        1 - RemapValue(point.value, minValue, maxValue, 0.1, 0.9),
                    );

                    const position = UDim2.fromOffset(
                        positionPercent.X * windowSize.X,
                        positionPercent.Y * windowSize.Y - (1 - RemapValue(point.value, minValue, maxValue, 0, 1)) * BOTTOM_SIZE,
                    );

                    if (index === 0 || index === (graphAPIRef.current as LineGraphField).GetAllPoints().size() - 1) {
                        return (
                            <LineGraphPoint
                                key={`endpoint_${point.id}`}
                                Id={point.id}
                                Position={position}
                                OnSelect={selectPoint}
                                UpdatePoint={updatePoint}
                            />
                        );
                    }

                    return (
                        <LineGraphPoint
                            key={`point_${point.id}`}
                            Id={point.id}
                            Position={position}
                            OnSelect={selectPoint}
                            UpdatePoint={updatePoint}
                            RemovePoint={removePoint}
                        />
                    );
                })}
            </Div>
            {/* Lines */}
            <Div>
                {graphAPIRef.current?.GetAllPoints().map((point, index) => {
                    const allPoints = (graphAPIRef.current as LineGraphField).GetAllPoints();

                    if (index === allPoints.size() - 1) return;

                    const p1 = allPoints[index];
                    const p2 = allPoints[index + 1];

                    const startTimePercent = RemapValue(p1.time, 0, 1, 0.1, 0.9);
                    const startValuePercent = 1 - RemapValue(p1.value, minValue, maxValue, 0.1, 0.9);
                    const startPos = new Vector2(
                        startTimePercent * windowSize.X,
                        startValuePercent * windowSize.Y - (1 - RemapValue(p1.value, minValue, maxValue, 0, 1)) * BOTTOM_SIZE,
                    );

                    const endTimePercent = RemapValue(p2.time, 0, 1, 0.1, 0.9);
                    const endValuePercent = 1 - RemapValue(p2.value, minValue, maxValue, 0.1, 0.9);
                    const endPos = new Vector2(
                        endTimePercent * windowSize.X,
                        endValuePercent * windowSize.Y - (1 - RemapValue(p2.value, minValue, maxValue, 0, 1)) * BOTTOM_SIZE,
                    );

                    const position = startPos.add(endPos.sub(startPos).mul(0.5));

                    const vectorDiff = endPos.sub(startPos);
                    const rotationRad = math.atan2(vectorDiff.Y, vectorDiff.X);
                    const rotation = RoundDecimal(math.deg(rotationRad), 0.01);

                    const length = endPos.sub(startPos).Magnitude;

                    return (
                        <Div
                            key={`Line_${point.id}`}
                            AnchorPoint={new Vector2(0.5, 0.5)}
                            Position={UDim2.fromOffset(position.X, position.Y)}
                            Size={UDim2.fromOffset(length, 2)}
                            BackgroundColor={StyleColors.Highlight}
                            Rotation={rotation}
                        />
                    );
                })}
            </Div>
            {/* Controls */}
            <Div
                AnchorPoint={new Vector2(0, 1)}
                Position={UDim2.fromScale(0, 1)}
                Size={new UDim2(1, 0, 0, BOTTOM_SIZE)}
                BackgroundColor={StyleColors.Primary}
            >
                <uilistlayout FillDirection={"Horizontal"} Padding={new UDim(0, 20)} />

                <Div Size={UDim2.fromScale(0.5, 1)}>
                    <uipadding PaddingLeft={new UDim(0.25, 0)} PaddingRight={new UDim(0.25, 0)} />
                    <uilistlayout
                        FillDirection={"Horizontal"}
                        VerticalAlignment={"Center"}
                        HorizontalAlignment={"Center"}
                        Padding={new UDim(0, 10)}
                    />

                    <BasicTextLabel Size={new UDim2(0.25, 0, 0, 20)} TextXAlignment={"Right"} Text="Time" IsAffectedByZoom={false} />
                    <NumberInput
                        Size={new UDim2(0.75, 0, 0, 20)}
                        Text={selectedPointRef.current === undefined ? "" : () => tostring((selectedPointRef.current as GraphPoint).time)}
                        NumberChanged={controlsTimeChanged}
                        Disabled={selectedPointRef.current === undefined || !selectedPointRef.current.canEditTime}
                        IsAffectedByZoom={false}
                    />
                </Div>
                <Div Size={UDim2.fromScale(0.5, 1)}>
                    <uipadding PaddingLeft={new UDim(0.25, 0)} PaddingRight={new UDim(0.25, 0)} />
                    <uilistlayout
                        FillDirection={"Horizontal"}
                        VerticalAlignment={"Center"}
                        HorizontalAlignment={"Center"}
                        Padding={new UDim(0, 10)}
                    />

                    <BasicTextLabel Size={new UDim2(0.25, 0, 0, 20)} TextXAlignment={"Right"} Text="Value" IsAffectedByZoom={false} />
                    <NumberInput
                        Size={new UDim2(0.75, 0, 0, 20)}
                        Text={selectedPointRef.current === undefined ? "" : () => tostring((selectedPointRef.current as GraphPoint).value)}
                        NumberChanged={controlsValueChanged}
                        Disabled={selectedPointRef.current === undefined}
                        IsAffectedByZoom={false}
                        AllowNegative={minValue !== 0}
                    />
                </Div>
            </Div>
        </>
    );
}
