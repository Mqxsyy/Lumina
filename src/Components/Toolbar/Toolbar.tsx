import React, { useEffect, useState } from "@rbxts/react";
import { FastEvent } from "API/Bindables/FastEvent";
import ExportAPI from "API/ExportAPI";
import { GetExportsFolder } from "API/FolderLocations";
import ExportAsScript from "API/VFXScriptCreator";
import InputSinker from "Components/Basic/InputSinker";
import { Copy, Cut, Duplicate, Paste } from "Services/CopyPasteService";
import { GetAllSystems } from "Services/NodeSystemService";
import { LoadFromFile } from "Services/Saving/LoadService";
import { SaveToFile } from "Services/Saving/SaveService";
import ShowUpdateLog from "UpdateChecker/ShowUpdateLog";
import { GetWindow, Windows } from "Windows/WindowSevice";
import Div from "../Div";
import { ToolbarButton } from "./ToolbarButton";
import { ToolbarDropdownButton } from "./ToolbarDropdown";

const PADDING = 8;
export const CloseToolbar = new FastEvent();

function Toolbar() {
    const window = GetWindow(Windows.Lumina);
    const [windowSize, setWindowSize] = useState(window.AbsoluteSize);
    const [selectedDropdown, setSelectedDropdown] = useState(-1);

    const Start = () => {
        const nodeSystems = GetAllSystems();

        for (const nodeSystem of nodeSystems) {
            nodeSystem.data.system.Run();
        }
    };

    const Stop = () => {
        const nodeSystems = GetAllSystems();
        for (const nodeSystem of nodeSystems) {
            nodeSystem.data.system.Stop();
        }
    };

    const Export = () => {
        ExportAPI();

        const exportsFolder = GetExportsFolder();
        const exportedFiles = ExportAsScript();

        if (exportedFiles.size() === 0) {
            return;
        }

        const saveData = SaveToFile();

        if (exportedFiles.size() === 1) {
            saveData.Parent = exportedFiles[0];
            exportedFiles[0].Parent = exportsFolder;
        } else {
            const folder = new Instance("Folder");
            folder.Name = "VFX Container";
            folder.Parent = exportsFolder;

            for (const file of exportedFiles) {
                file.Parent = folder;
            }

            saveData.Parent = folder;
        }
    };

    const Save = () => {
        SaveToFile();
    };

    const Load = () => {
        LoadFromFile();
    };

    const selectDropdown = (id: number) => {
        setSelectedDropdown(id);
    };

    useEffect(() => {
        const connection1 = CloseToolbar.Connect(() => {
            setSelectedDropdown(-1);
        });

        const connection2 = window.GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
            setWindowSize(window.AbsoluteSize);
        });

        return () => {
            connection1.Disconnect();
            connection2.Disconnect();
        };
    });

    return (
        <Div
            AnchorPoint={new Vector2(0, 0)}
            Position={UDim2.fromOffset(1, 0)}
            Size={UDim2.fromOffset(windowSize.X - 2, 21)}
            BackgroundColor={Color3.fromHex("353535")}
            BorderSize={1}
            BorderColor={Color3.fromHex("222222")}
            ZIndex={100}
        >
            <InputSinker />
            <Div>
                <uilistlayout FillDirection={"Horizontal"} HorizontalFlex={"Fill"} />

                <Div>
                    <uilistlayout FillDirection={"Horizontal"} HorizontalAlignment={"Left"} />

                    <ToolbarDropdownButton
                        Id={1}
                        SelectedId={selectedDropdown}
                        SetSelectedId={selectDropdown}
                        Text={"File"}
                        Padding={PADDING}
                        Buttons={[
                            {
                                Text: "Load",
                                Order: 1,
                                OnClick: () => {
                                    Load();
                                },
                            },
                            {
                                Text: "Save",
                                Order: 2,
                                OnClick: () => {
                                    Save();
                                },
                            },
                            {
                                Text: "Export",
                                Order: 3,
                                OnClick: () => {
                                    Export();
                                },
                            },
                        ]}
                    />
                    <ToolbarDropdownButton
                        Id={2}
                        SelectedId={selectedDropdown}
                        SetSelectedId={selectDropdown}
                        Text={"Actions"}
                        Padding={PADDING}
                        Buttons={[
                            {
                                Text: "Copy",
                                Order: 1,
                                OnClick: () => {
                                    Copy(true);
                                },
                            },
                            {
                                Text: "Paste",
                                Order: 2,
                                OnClick: () => {
                                    Paste(true);
                                },
                            },
                            {
                                Text: "Duplicate",
                                Order: 3,
                                OnClick: () => {
                                    Duplicate(true);
                                },
                            },
                            {
                                Text: "Cut",
                                Order: 4,
                                OnClick: () => {
                                    Cut(true);
                                },
                            },
                        ]}
                    />
                    <ToolbarDropdownButton
                        Id={3}
                        SelectedId={selectedDropdown}
                        SetSelectedId={selectDropdown}
                        Text={"Extras"}
                        Padding={PADDING}
                        Buttons={[
                            {
                                Text: "Show Update Log",
                                Order: 1,
                                OnClick: () => {
                                    ShowUpdateLog();
                                },
                            },
                        ]}
                    />
                </Div>

                <Div>
                    <uilistlayout FillDirection={"Horizontal"} HorizontalAlignment={"Right"} />

                    <ToolbarButton Text={"Run"} Padding={PADDING} OnClick={Start} />
                    <ToolbarButton Text={"Stop"} Padding={PADDING} OnClick={Stop} />
                </Div>
            </Div>
        </Div>
    );
}

export default React.memo(Toolbar);
