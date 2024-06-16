import React, { type PropsWithChildren, useEffect, useRef } from "@rbxts/react";

interface Props {
    ElementName?: string;
    AnchorPoint?: Vector2;
    Position?: UDim2;
    Size?: UDim2;
    AutomaticSize?: "X" | "Y" | "XY" | "None";
    SizeConstaint?: "RelativeXY" | "RelativeXX" | "RelativeYY";
    Rotation?: number;
    BackgroundColor?: Color3;
    BorderColor?: Color3;
    BorderSize?: number;
    ZIndex?: number;
    ClipsDescendants?: boolean;
    // Active?: boolean;
    getFrame?: (frame: Frame) => void;
    onHover?: () => void;
    onUnhover?: () => void;
    onMouseButton1Down?: (element: GuiObject) => void;
    onMouseButton2Down?: (element: GuiObject) => void;
    onMouseButton3Down?: (element: GuiObject) => void;
    onMouseButton1Up?: (element: GuiObject) => void;
    onMouseButton2Up?: (element: GuiObject) => void;
    onMouseButton3Up?: (element: GuiObject) => void;
}

export default function Div({
    ElementName = undefined,
    AnchorPoint = new Vector2(0, 0),
    Position = new UDim2(0, 0, 0, 0),
    Size = UDim2.fromScale(1, 1),
    AutomaticSize = "None",
    BackgroundColor = undefined,
    BorderColor = Color3.fromHex("000000"),
    BorderSize = 0,
    Rotation = 0,
    SizeConstaint = "RelativeXY",
    ZIndex = 1,
    ClipsDescendants = false,
    // Active = false,
    onHover = undefined,
    onUnhover = undefined,
    onMouseButton1Down = undefined,
    onMouseButton2Down = undefined,
    onMouseButton3Down = undefined,
    onMouseButton1Up = undefined,
    onMouseButton2Up = undefined,
    onMouseButton3Up = undefined,
    getFrame = undefined,
    children,
}: PropsWithChildren<Props>) {
    const frameRef = useRef<Frame>();

    useEffect(() => {
        if (frameRef.current === undefined) return;

        if (getFrame !== undefined) {
            getFrame(frameRef.current);
        }
    }, [frameRef.current]);

    return (
        <frame
            AnchorPoint={AnchorPoint}
            Position={Position}
            Size={Size}
            SizeConstraint={SizeConstaint}
            AutomaticSize={AutomaticSize}
            Rotation={Rotation}
            BackgroundColor3={BackgroundColor === undefined ? Color3.fromHex("#FFFFFF") : BackgroundColor}
            BackgroundTransparency={BackgroundColor === undefined ? 1 : 0}
            BorderSizePixel={BorderSize}
            BorderColor3={BorderColor}
            ZIndex={ZIndex}
            ClipsDescendants={ClipsDescendants}
            key={ElementName}
            ref={frameRef}
            Event={{
                MouseEnter: () => {
                    if (onHover !== undefined) {
                        onHover();
                    }
                },
                MouseLeave: () => {
                    if (onUnhover !== undefined) {
                        onUnhover();
                    }
                },
                InputBegan: (element, inputObject) => {
                    switch (inputObject.UserInputType) {
                        case Enum.UserInputType.MouseButton1: {
                            if (onMouseButton1Down !== undefined) onMouseButton1Down(element);
                            break;
                        }
                        case Enum.UserInputType.MouseButton2: {
                            if (onMouseButton2Down !== undefined) onMouseButton2Down(element);
                            break;
                        }
                        case Enum.UserInputType.MouseButton3: {
                            if (onMouseButton3Down !== undefined) onMouseButton3Down(element);
                            break;
                        }
                    }
                },
                InputEnded: (element, inputObject) => {
                    switch (inputObject.UserInputType) {
                        case Enum.UserInputType.MouseButton1: {
                            if (onMouseButton1Up !== undefined) onMouseButton1Up(element);
                            break;
                        }
                        case Enum.UserInputType.MouseButton2: {
                            if (onMouseButton2Up !== undefined) onMouseButton2Up(element);
                            break;
                        }
                        case Enum.UserInputType.MouseButton3: {
                            if (onMouseButton3Up !== undefined) onMouseButton3Up(element);
                            break;
                        }
                    }
                },
            }}
        >
            {children}
        </frame>
    );
}
