import React, { useEffect, useRef } from "@rbxts/react";
import { GetConnectionColor } from "Components/ColorLib";
import Div from "Components/Div";
import { ReloadConnectionVisuals } from "Components/Events";
import { DestroyConnection } from "Services/ConnectionsService";
import { GetZoomScale } from "ZoomScale";

interface Props {
    AnchorPoint?: Vector2;
    Position?: UDim2;
    Size?: UDim2;
    ConnectionIds?: number[];
    ValueType: string;
    GetElementRef?: (element: ImageButton) => void;
    MouseButton1Down?: () => void;
    MouseButton1Up?: () => void;
}

export default function ConnectionPoint({
    AnchorPoint = new Vector2(0, 0),
    Position = UDim2.fromScale(0, 0),
    Size = UDim2.fromScale(1, 1),
    ConnectionIds = undefined,
    ValueType,
    GetElementRef = undefined,
    MouseButton1Down = undefined,
    MouseButton1Up = undefined,
}: Props) {
    const connectionPointRef = useRef<ImageButton>();
    const zoomScale = GetZoomScale();

    const connectionIdsRef = useRef<number[]>([]);

    useEffect(() => {
        if (GetElementRef !== undefined) {
            GetElementRef(connectionPointRef.current as ImageButton);
        }

        return () => {
            if (connectionIdsRef.current === undefined) return;

            for (const id of connectionIdsRef.current) {
                DestroyConnection(id);
            }
        };
    }, []);

    useEffect(() => {
        connectionIdsRef.current = ConnectionIds || [];

        if (ConnectionIds === undefined) return;

        const connection = (connectionPointRef.current as ImageButton).GetPropertyChangedSignal("AbsolutePosition").Connect(() => {
            ReloadConnectionVisuals.Fire();
        });

        return () => {
            connection.Disconnect();
        };
    }, [ConnectionIds]);

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
                <uistroke Color={GetConnectionColor(ValueType)} Thickness={math.clamp(2 * zoomScale, 1, math.huge)} />
            </Div>

            {ConnectionIds !== undefined && (
                <Div
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    Position={UDim2.fromScale(0.5, 0.5)}
                    Size={new UDim2(1, -4 * zoomScale, 1, -4 * zoomScale)}
                    BackgroundColor={GetConnectionColor(ValueType)}
                >
                    <uicorner CornerRadius={new UDim(2, 0)} />
                </Div>
            )}
        </imagebutton>
    );
}
