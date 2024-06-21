import React, { useEffect, useRef, useState } from "@rbxts/react";
import { RunService } from "@rbxts/services";
import { ShallowObjectCompare } from "API/Lib";
import InputSinker from "Components/Basic/InputSinker";
import Div from "Components/Div";
import StyleConfig from "Components/StyleConfig";
import type { MeshData } from "./MeshUploader";

interface Props {
    MeshData: MeshData;
    SelectedMesh?: MeshData;
    MouseButton1Down: (meshData: MeshData) => void;
}

export default function UploadedMesh({ MeshData, SelectedMesh, MouseButton1Down }: Props) {
    const [isHovering, setIsHovering] = useState(false);
    const animationConnectionRef = useRef<RBXScriptConnection | undefined>();
    const viewportElementRef = useRef<ViewportFrame>();
    const partRef = useRef<Part>();

    const checkMatching = (mesh1: MeshData, mesh2?: MeshData) => {
        if (mesh2 === undefined) return false;
        return ShallowObjectCompare(mesh1, mesh2);
    };

    const startAnimation = () => {
        animationConnectionRef.current = RunService.RenderStepped.Connect(() => {
            const part = partRef.current;
            if (part === undefined) return;

            part.CFrame = part.CFrame.mul(CFrame.Angles(0, math.rad(1), 0));
        });
    };

    const stopAnimation = () => {
        if (animationConnectionRef.current === undefined) return;
        animationConnectionRef.current.Disconnect();
        animationConnectionRef.current = undefined;

        const part = partRef.current;
        if (part === undefined) return;

        part.CFrame = new CFrame().mul(CFrame.Angles(0, math.rad(MeshData.previewRotation), 0));
    };

    useEffect(() => {
        const viewportFrame = viewportElementRef.current as ViewportFrame;

        const part = new Instance("Part");
        part.CFrame = new CFrame().mul(CFrame.Angles(0, math.rad(MeshData.previewRotation), 0));
        part.Anchored = true;
        part.Parent = viewportFrame;
        partRef.current = part;

        const mesh = new Instance("SpecialMesh");
        mesh.MeshId = `rbxassetid://${MeshData.meshId}`;
        mesh.MeshType = Enum.MeshType.FileMesh;
        mesh.Parent = part;

        const camera = new Instance("Camera");
        camera.CFrame = new CFrame(0, MeshData.previewHeight, MeshData.previewDistance).mul(
            CFrame.Angles(math.rad(-MeshData.previewAngle), 0, 0),
        );
        camera.CameraSubject = part;
        camera.Parent = viewportFrame;

        viewportFrame.CurrentCamera = camera;

        return () => {
            if (animationConnectionRef.current === undefined) return;
            animationConnectionRef.current.Disconnect();
            animationConnectionRef.current = undefined;
        };
    }, []);

    return (
        <Div
            Size={UDim2.fromOffset(100, 120)}
            BackgroundColor={isHovering || checkMatching(MeshData, SelectedMesh) ? StyleConfig.Studio.Colors.DarkHighlight : undefined}
        >
            <InputSinker />

            <Div
                onHover={() => {
                    setIsHovering(true);
                    startAnimation();
                }}
                onUnhover={() => {
                    setIsHovering(false);
                    stopAnimation();
                }}
                onMouseButton1Down={() => {
                    MouseButton1Down(MeshData);
                }}
            >
                <uilistlayout FillDirection={"Vertical"} />

                <viewportframe
                    Size={UDim2.fromOffset(100, 100)}
                    BackgroundTransparency={1}
                    Ambient={Color3.fromRGB(200, 200, 200)}
                    LightColor={Color3.fromRGB(255, 255, 255)}
                    LightDirection={new Vector3(1000, -1000, -1000)}
                    ref={viewportElementRef}
                />
                <textlabel
                    Size={UDim2.fromOffset(100, 20)}
                    BackgroundTransparency={1}
                    FontFace={StyleConfig.Studio.Font}
                    TextSize={StyleConfig.Studio.FontSize}
                    TextColor3={StyleConfig.Studio.FontColor}
                    Text={MeshData.name}
                />
            </Div>
        </Div>
    );
}
