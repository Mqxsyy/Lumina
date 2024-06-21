import React, { StrictMode, useEffect, useRef, useState } from "@rbxts/react";
import { createRoot } from "@rbxts/react-roblox";
import { GetMeshesFolder } from "API/FolderLocations";
import type { JSObject } from "API/Lib";
import Div from "Components/Div";
import StudioLabelledTextInput from "Components/Studio/LabelledTextInput";
import StudioPrimaryButton from "Components/Studio/StudioPrimaryButton";
import StyleConfig from "Components/StyleConfig";
import { GetWindow, Windows } from "Services/WindowSevice";
import { ReloadMeshBrowser, ToggleMeshUploader } from "./Event";

export function InitializeMeshEditor() {
    const window = GetWindow(Windows.MeshEditor);
    window.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;

    const root = createRoot(window);
    window.Enabled = false;

    ToggleMeshUploader.Connect(() => {
        window.Enabled = !window.Enabled;
    });

    root.render(
        <StrictMode>
            <MeshEditor />
        </StrictMode>,
    );
}

export interface MeshData extends JSObject {
    meshId: number;
    name: string;

    previewDistance: number;
    previewHeight: number;
    previewAngle: number;
    previewRotation: number;
}

function ValidateProperties(name: string, meshId: string) {
    const validatedMeshId = tonumber(meshId);
    if (name === "" || validatedMeshId === undefined) return undefined;
    return { name, meshId: validatedMeshId };
}

function ValidateAttributes(distance: string, height: string, angle: string, rotation: string) {
    const validatedDistance = tonumber(distance);
    const validatedHeight = tonumber(height);
    if (validatedDistance === undefined || validatedHeight === undefined) return undefined;

    const validatedAngle = tonumber(angle);
    const validatedRotation = tonumber(rotation);
    if (validatedAngle === undefined || validatedRotation === undefined) return undefined;
    return { distance: validatedDistance, height: validatedHeight, angle: validatedAngle, rotation: validatedRotation };
}

function MeshEditor() {
    const [_, setForceRender] = useState(0);

    const viewportElementRef = useRef<ViewportFrame>();
    const cameraRef = useRef<Camera>();
    const partRef = useRef<Part>();
    const meshRef = useRef<SpecialMesh>();

    const meshIdRef = useRef("");
    const meshNameRef = useRef("");

    const distanceRef = useRef("4");
    const heightRef = useRef("1");
    const angleRef = useRef("15");
    const rotationRef = useRef("30");

    const CreateMesh = () => {
        const properties = ValidateProperties(meshNameRef.current, meshIdRef.current);
        const attributes = ValidateAttributes(distanceRef.current, heightRef.current, angleRef.current, rotationRef.current);
        if (properties === undefined || attributes === undefined) return;

        const meshesFolder = GetMeshesFolder();

        const uploadedMesh = new Instance("IntValue");
        uploadedMesh.Name = properties.name;
        uploadedMesh.Value = properties.meshId;

        uploadedMesh.SetAttribute("PreviewDistance", attributes.distance);
        uploadedMesh.SetAttribute("PreviewHeight", attributes.height);
        uploadedMesh.SetAttribute("PreviewAngle", attributes.angle);
        uploadedMesh.SetAttribute("PreviewRotation", attributes.rotation);

        uploadedMesh.Parent = meshesFolder;

        ReloadMeshBrowser.Fire();
        ToggleMeshUploader.Fire();
    };

    useEffect(() => {
        const viewportFrame = viewportElementRef.current as ViewportFrame;

        const rotation = tonumber(rotationRef.current) as number;

        const part = new Instance("Part");
        part.CFrame = new CFrame().mul(CFrame.Angles(0, math.rad(rotation), 0));
        part.Anchored = true;
        part.Parent = viewportFrame;
        partRef.current = part;

        const mesh = new Instance("SpecialMesh");
        mesh.MeshId = `rbxassetid://${meshIdRef.current}`;
        mesh.MeshType = Enum.MeshType.FileMesh;
        mesh.Parent = part;
        meshRef.current = mesh;

        const distance = tonumber(distanceRef.current) as number;
        const height = tonumber(heightRef.current) as number;
        const angle = tonumber(angleRef.current) as number;

        const camera = new Instance("Camera");
        camera.CFrame = new CFrame(0, height, distance).mul(CFrame.Angles(math.rad(-angle), 0, 0));
        camera.CameraSubject = part;
        camera.Parent = viewportFrame;
        cameraRef.current = camera;

        viewportFrame.CurrentCamera = camera;
    }, []);

    useEffect(() => {
        const mesh = meshRef.current;
        const meshId = meshIdRef.current;

        if (mesh === undefined || tonumber(meshId) === undefined) return;

        mesh.MeshId = `rbxassetid://${meshId}`;
    }, [meshRef.current, meshIdRef.current]);

    useEffect(() => {
        const part = partRef.current;
        const camera = cameraRef.current;

        if (part === undefined || camera === undefined) return;

        const attributes = ValidateAttributes(distanceRef.current, heightRef.current, angleRef.current, rotationRef.current);
        if (attributes === undefined) return;

        part.CFrame = new CFrame().mul(CFrame.Angles(0, math.rad(attributes.rotation), 0));
        camera.CFrame = new CFrame(0, attributes.height, attributes.distance).mul(CFrame.Angles(math.rad(-attributes.angle), 0, 0));
    }, [partRef.current, cameraRef.current, distanceRef.current, heightRef.current, angleRef.current, rotationRef.current]);

    return (
        <Div BackgroundColor={StyleConfig.Studio.Colors.Darker}>
            <uipadding PaddingLeft={new UDim(0, 10)} PaddingRight={new UDim(0, 10)} />
            <uilistlayout FillDirection={"Horizontal"} Padding={new UDim(0, 20)} />

            <Div Size={UDim2.fromScale(0, 1)} AutomaticSize="X">
                <imagelabel
                    AnchorPoint={new Vector2(0, 0.5)}
                    Position={UDim2.fromScale(0, 0.5)}
                    Size={UDim2.fromOffset(200, 200)}
                    BackgroundTransparency={1}
                    Image={"rbxassetid://18120836907"}
                    ImageTransparency={meshIdRef.current === "" ? 0 : 1}
                />
                <viewportframe
                    AnchorPoint={new Vector2(0, 0.5)}
                    Position={UDim2.fromScale(0, 0.5)}
                    Size={UDim2.fromOffset(200, 200)}
                    BackgroundTransparency={1}
                    Visible={meshIdRef.current !== ""}
                    ref={viewportElementRef}
                />
            </Div>
            <Div Size={UDim2.fromScale(0, 1)}>
                <uilistlayout FillDirection={"Vertical"} VerticalAlignment={"Center"} Padding={new UDim(0, 5)} />
                <uiflexitem FlexMode={"Fill"} />

                <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                    <uilistlayout FillDirection={"Vertical"} VerticalAlignment={"Center"} Padding={new UDim(0, 5)} />

                    <textlabel
                        Size={new UDim2(1, 0, 0, 20)}
                        BackgroundTransparency={1}
                        TextColor3={StyleConfig.Studio.FontColor}
                        TextSize={StyleConfig.Studio.FontSize}
                        FontFace={StyleConfig.Studio.FontSemiBold}
                        Text="Main Settings"
                        TextXAlignment={"Left"}
                    />

                    <StudioLabelledTextInput
                        Title="Mesh Id"
                        TextChanged={(text) => {
                            if (text === "") {
                                meshIdRef.current = "";
                            } else {
                                meshIdRef.current = text;
                            }

                            setForceRender((prev) => prev + 1);
                        }}
                    />
                    <StudioLabelledTextInput
                        Title="Name"
                        TextChanged={(text) => {
                            meshNameRef.current = text;
                        }}
                    />
                </Div>

                <Div Size={new UDim2(1, 0, 0, 5)} />

                <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                    <uilistlayout FillDirection={"Vertical"} VerticalAlignment={"Center"} Padding={new UDim(0, 5)} />

                    <textlabel
                        Size={new UDim2(1, 0, 0, 20)}
                        BackgroundTransparency={1}
                        TextColor3={StyleConfig.Studio.FontColor}
                        TextSize={StyleConfig.Studio.FontSize}
                        FontFace={StyleConfig.Studio.FontSemiBold}
                        Text="Preview Settings"
                        TextXAlignment={"Left"}
                    />

                    <StudioLabelledTextInput
                        Title="Distance"
                        Placeholder="4"
                        TextChanged={(text) => {
                            if (text === "") {
                                distanceRef.current = "4";
                            } else {
                                distanceRef.current = text;
                            }

                            setForceRender((prev) => prev + 1);
                        }}
                    />
                    <StudioLabelledTextInput
                        Title="Height"
                        Placeholder="1"
                        TextChanged={(text) => {
                            if (text === "") {
                                heightRef.current = "1";
                            } else {
                                heightRef.current = text;
                            }

                            setForceRender((prev) => prev + 1);
                        }}
                    />
                    <StudioLabelledTextInput
                        Title="Angle"
                        Placeholder="15"
                        TextChanged={(text) => {
                            if (text === "") {
                                angleRef.current = "15";
                            } else {
                                angleRef.current = text;
                            }

                            setForceRender((prev) => prev + 1);
                        }}
                    />
                    <StudioLabelledTextInput
                        Title="Rotation"
                        Placeholder="30"
                        TextChanged={(text) => {
                            if (text === "") {
                                rotationRef.current = "30";
                            } else {
                                rotationRef.current = text;
                            }

                            setForceRender((prev) => prev + 1);
                        }}
                    />
                </Div>

                <Div Size={new UDim2(1, 0, 0, 5)} />

                <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                    <uilistlayout FillDirection={"Horizontal"} HorizontalAlignment={"Right"} />
                    <StudioPrimaryButton MouseButton1Down={CreateMesh} />
                </Div>
            </Div>
        </Div>
    );
}
