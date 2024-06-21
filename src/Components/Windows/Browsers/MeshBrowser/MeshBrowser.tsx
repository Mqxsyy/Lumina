import React, { StrictMode, useEffect, useRef, useState } from "@rbxts/react";
import { createRoot } from "@rbxts/react-roblox";
import { GetMeshesFolder } from "API/FolderLocations";
import { ShallowObjectCompare } from "API/Lib";
import Div from "Components/Div";
import StyleConfig from "Components/StyleConfig";
import Toolbar from "Components/Toolbar/Toolbar";
import { ToolbarButton } from "Components/Toolbar/ToolbarButton";
import { GetWindow, Windows } from "Services/WindowSevice";
import { ReloadMeshBrowser, ToggleMeshBrowser, ToggleMeshUploader } from "./Event";
import { InitializeMeshEditor, type MeshData } from "./MeshUploader";
import UploadedMesh from "./UploadedMesh";

export function InitializeMeshBrowser() {
    const window = GetWindow(Windows.MeshBrowser);
    window.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;

    const root = createRoot(window);
    window.Enabled = false;

    ToggleMeshBrowser.Connect(() => {
        window.Enabled = !window.Enabled;
    });

    root.render(
        <StrictMode>
            <MeshBrowser />
        </StrictMode>,
    );

    InitializeMeshEditor();
}

function VerifyMeshProperties(mesh: IntValue): MeshData | undefined {
    const previewDistance = mesh.GetAttribute("PreviewDistance");
    const previewHeight = mesh.GetAttribute("PreviewHeight");
    const previewAngle = mesh.GetAttribute("PreviewAngle");
    const previewRotation = mesh.GetAttribute("PreviewRotation");

    if (previewDistance === undefined || previewHeight === undefined) return undefined;
    if (previewAngle === undefined || previewRotation === undefined) return undefined;

    if (!typeIs(previewDistance, "number") || !typeIs(previewHeight, "number")) return undefined;
    if (!typeIs(previewAngle, "number") || !typeIs(previewRotation, "number")) return undefined;

    return { name: mesh.Name, meshId: mesh.Value, previewDistance, previewHeight, previewAngle, previewRotation };
}

function MeshBrowser() {
    const [_, setForceRender] = useState(-1);

    const selectedMeshRef = useRef<MeshData | undefined>();
    const meshesFolderRef = useRef(GetMeshesFolder());

    const searchElementRef = useRef<TextBox>();
    const searchRef = useRef("");

    const meshes: MeshData[] = [];
    for (const [_, mesh] of pairs(meshesFolderRef.current.GetChildren())) {
        if (!mesh.IsA("IntValue")) continue;

        const meshProperties = VerifyMeshProperties(mesh);
        if (meshProperties === undefined) continue;

        if (searchRef.current !== "") {
            if (meshProperties.name.lower().find(searchRef.current.lower())[0] === undefined) continue;
        }

        meshes.push(meshProperties);
    }

    const setSelectedMesh = (mesh: MeshData | undefined) => {
        selectedMeshRef.current = mesh;
        setForceRender((prev) => prev + 1);
    };

    const deleteMesh = () => {
        const selectedMesh = selectedMeshRef.current;
        if (selectedMesh === undefined) return;

        for (const [_, mesh] of pairs(meshesFolderRef.current.GetChildren())) {
            if (!mesh.IsA("IntValue")) continue;
            if (mesh.GetAttribute("Undeletable")) continue;

            const meshProperties = VerifyMeshProperties(mesh);
            if (meshProperties === undefined) continue;
            if (!ShallowObjectCompare(selectedMesh, meshProperties)) continue;

            mesh.Destroy();
            ReloadMeshBrowser.Fire();
            break;
        }
    };

    useEffect(() => {
        const window = GetWindow(Windows.MeshBrowser);
        const connection1 = window.GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
            setForceRender((prev) => prev + 1);
        });

        const connection2 = ReloadMeshBrowser.Connect(() => {
            setForceRender((prev) => prev + 1);
        });

        const textBox = searchElementRef.current as TextBox;
        const connection3 = textBox.GetPropertyChangedSignal("Text").Connect(() => {
            searchRef.current = textBox.Text;
            setForceRender((prev) => prev + 1);
        });

        return () => {
            connection1.Disconnect();
            connection2.Disconnect();
            connection3.Disconnect();
        };
    }, []);

    return (
        <Div BackgroundColor={StyleConfig.Studio.Colors.Darker}>
            <uilistlayout FillDirection={"Vertical"} />

            <Toolbar Window={Windows.MeshBrowser}>
                <uilistlayout FillDirection="Horizontal" HorizontalFlex={"Fill"} />

                <Div>
                    <uilistlayout FillDirection="Horizontal" HorizontalAlignment={"Left"} />

                    <ToolbarButton Text={"New"} OnClick={() => ToggleMeshUploader.Fire()} />
                    <ToolbarButton Text={"Delete"} OnClick={() => deleteMesh()} />
                    <ToolbarButton Text={"Refresh"} OnClick={() => ReloadMeshBrowser.Fire()} />
                </Div>
                <Div>
                    <uilistlayout FillDirection="Horizontal" HorizontalAlignment={"Right"} />

                    <Div Size={UDim2.fromScale(0.75, 1)} BackgroundColor={StyleConfig.Studio.Colors.Darkest}>
                        <uipadding PaddingLeft={new UDim(0, 5)} PaddingRight={new UDim(0, 5)} />

                        <textbox
                            Size={UDim2.fromScale(1, 1)}
                            BackgroundTransparency={1}
                            TextColor3={StyleConfig.Studio.FontColor}
                            TextSize={StyleConfig.Studio.FontSize}
                            FontFace={StyleConfig.Studio.Font}
                            TextXAlignment={"Left"}
                            Text={""}
                            PlaceholderText={"Search"}
                            PlaceholderColor3={StyleConfig.Studio.FontColorPlaceholder}
                            TextTruncate={"AtEnd"}
                            ClearTextOnFocus={false}
                            ref={searchElementRef}
                        />
                    </Div>
                </Div>
            </Toolbar>

            <Div Size={UDim2.fromScale(1, 0)}>
                <uiflexitem FlexMode={"Fill"} />
                <uipadding
                    PaddingBottom={new UDim(0, 5)}
                    PaddingLeft={new UDim(0, 5)}
                    PaddingRight={new UDim(0, 5)}
                    PaddingTop={new UDim(0, 5)}
                />

                <Div
                    onMouseButton1Down={() => {
                        setSelectedMesh(undefined);
                    }}
                />

                <scrollingframe
                    Size={UDim2.fromScale(1, 1)}
                    BackgroundTransparency={1}
                    BorderSizePixel={0}
                    ScrollBarImageColor3={StyleConfig.Studio.FontColor}
                    ScrollBarThickness={4}
                    ScrollingDirection={"Y"}
                    CanvasSize={UDim2.fromScale(0, 0)}
                    AutomaticCanvasSize={"Y"}
                >
                    <uilistlayout FillDirection={"Horizontal"} Padding={new UDim(0, 5)} Wraps={true} />

                    {meshes.size() === 0 ? (
                        <textlabel
                            Size={UDim2.fromScale(1, 1)}
                            BackgroundTransparency={1}
                            TextColor3={StyleConfig.Studio.FontColorPlaceholder}
                            TextSize={StyleConfig.Studio.FontSize}
                            FontFace={StyleConfig.Studio.Font}
                            Text="No Meshes Found"
                        />
                    ) : (
                        meshes.map((mesh) => (
                            <UploadedMesh
                                key={mesh.name}
                                MeshData={mesh}
                                SelectedMesh={selectedMeshRef.current}
                                MouseButton1Down={setSelectedMesh}
                            />
                        ))
                    )}
                </scrollingframe>
            </Div>
        </Div>
    );
}
