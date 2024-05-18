import React, { useEffect, useRef } from "@rbxts/react";
import Div from "Components/Div";
import { StyleColors } from "Style";
import { GetZoomScale } from "ZoomScale";

interface Props {
    AnchorPoint?: Vector2;
    Position?: UDim2;
    Size?: UDim2;
    ConnectionId?: number;
    ConnectionIds?: number[];
    GetElementRef?: (element: ImageButton) => void;
    MouseButton1Down?: () => void;
    MouseButton1Up?: () => void;
    UpdateConnecton?: (element: ImageButton) => void;
}

export default function ConnectionPoint({
    AnchorPoint = new Vector2(0, 0),
    Position = UDim2.fromScale(0, 0),
    Size = UDim2.fromScale(1, 1),
    ConnectionId = undefined,
    ConnectionIds = undefined,
    GetElementRef = undefined,
    MouseButton1Down = undefined,
    MouseButton1Up = undefined,
    UpdateConnecton = undefined,
}: Props) {
    const connectionPointRef = useRef<ImageButton>();

    const zoomScale = GetZoomScale();

    useEffect(() => {
        if (GetElementRef === undefined) return;
        if (connectionPointRef.current === undefined) return;

        GetElementRef(connectionPointRef.current);
    }, [connectionPointRef.current]);

    useEffect(() => {
        if (ConnectionId === undefined) return;
        if (ConnectionIds === undefined) return;
        if (UpdateConnecton === undefined) return;

        UpdateConnecton(connectionPointRef.current!);
    }, [connectionPointRef.current?.AbsolutePosition, ConnectionId, ConnectionIds]);

    return (
        <imagebutton
            AnchorPoint={AnchorPoint}
            Position={Position}
            Size={Size}
            SizeConstraint="RelativeYY"
            BackgroundTransparency={1}
            AutoButtonColor={false}
            ImageTransparency={1}
            ref={connectionPointRef}
            Event={{
                InputBegan: (_, input) => {
                    if (input.UserInputType !== Enum.UserInputType.MouseButton1) return;
                    if (MouseButton1Down === undefined) return;

                    MouseButton1Down();
                },

                InputEnded: (_, input) => {
                    if (input.UserInputType !== Enum.UserInputType.MouseButton1) return;
                    if (MouseButton1Up === undefined) return;

                    MouseButton1Up();
                },
            }}
        >
            <uipadding
                PaddingLeft={new UDim(0, Size.Width.Offset * 0.25)}
                PaddingRight={new UDim(0, Size.Width.Offset * 0.25)}
                PaddingBottom={new UDim(0, Size.Width.Offset * 0.25)}
                PaddingTop={new UDim(0, Size.Width.Offset * 0.25)}
            />

            <Div>
                <uicorner CornerRadius={new UDim(2, 0)} />
                <uistroke Color={StyleColors.Highlight} Thickness={math.clamp(2 * zoomScale, 1, math.huge)} />
            </Div>

            {(ConnectionId !== undefined || ConnectionIds !== undefined) && (
                <Div
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    Position={UDim2.fromScale(0.5, 0.5)}
                    Size={new UDim2(1, -4 * zoomScale, 1, -4 * zoomScale)}
                    BackgroundColor={StyleColors.Highlight}
                >
                    <uicorner CornerRadius={new UDim(2, 0)} />
                </Div>
            )}
        </imagebutton>
    );
}
