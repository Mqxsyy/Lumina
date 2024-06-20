import React, { useEffect, useRef, useState, type PropsWithChildren } from "@rbxts/react";
import InputSinker from "Components/Basic/InputSinker";
import StyleConfig from "Components/StyleConfig";
import { GetWindow, type Windows } from "Services/WindowSevice";
import Div from "../Div";

interface Props {
    Window: Windows;
}

function Toolbar({ Window, children }: PropsWithChildren<Props>) {
    const windowRef = useRef(GetWindow(Window));
    const [windowSize, setWindowSize] = useState(windowRef.current.AbsoluteSize);

    useEffect(() => {
        const window = windowRef.current;

        const connection = window.GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
            setWindowSize(window.AbsoluteSize);
        });

        task.spawn(() => {
            task.wait(0.1);
            setWindowSize(window.AbsoluteSize);
        });

        return () => {
            connection.Disconnect();
        };
    }, []);

    return (
        <Div
            AnchorPoint={new Vector2(0, 0)}
            Position={UDim2.fromOffset(1, 0)}
            Size={UDim2.fromOffset(windowSize.X - 1, 21)}
            BackgroundColor={StyleConfig.Studio.Colors.Dark}
            BorderSize={1}
            BorderColor={StyleConfig.Studio.Colors.Border}
            ZIndex={100}
        >
            <InputSinker />
            <Div>{children}</Div>
        </Div>
    );
}

export default React.memo(Toolbar);
