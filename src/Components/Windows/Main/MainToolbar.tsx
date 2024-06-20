import React, { useEffect, useState } from "@rbxts/react";
import { FastEvent } from "API/Bindables/FastEvent";
import ExportAPI from "API/ExportAPI";
import { GetExportsFolder } from "API/FolderLocations";
import ExportAsScript from "API/VFXScriptCreator";
import Div from "Components/Div";
import Toolbar from "Components/Toolbar/Toolbar";
import { ToolbarButton } from "Components/Toolbar/ToolbarButton";
import { ToolbarDropdown } from "Components/Toolbar/ToolbarDropdown";
import ShowUpdateLog from "Components/Windows/UpdateChecker/ShowUpdateLog";
import { Copy, Cut, Duplicate, Paste } from "Services/CopyPasteService";
import { GetAllSystems } from "Services/NodeSystemService";
import { LoadFromFile } from "Services/Saving/LoadService";
import { SaveToFile } from "Services/Saving/SaveService";
import { Windows } from "Services/WindowSevice";

export const CloseMainToolbar = new FastEvent();

function MainToolbar() {
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
        const connection = CloseMainToolbar.Connect(() => {
            setSelectedDropdown(-1);
        });

        return () => {
            connection.Disconnect();
        };
    });

    return (
        <Toolbar Window={Windows.Lumina}>
            <uilistlayout FillDirection={"Horizontal"} HorizontalFlex={"Fill"} />

            <Div>
                <uilistlayout FillDirection={"Horizontal"} HorizontalAlignment={"Left"} />

                <ToolbarDropdown
                    Id={1}
                    SelectedId={selectedDropdown}
                    SetSelectedId={selectDropdown}
                    Text={"File"}
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
                <ToolbarDropdown
                    Id={2}
                    SelectedId={selectedDropdown}
                    SetSelectedId={selectDropdown}
                    Text={"Actions"}
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
                <ToolbarDropdown
                    Id={3}
                    SelectedId={selectedDropdown}
                    SetSelectedId={selectDropdown}
                    Text={"Extras"}
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

                <ToolbarButton Text={"Run"} OnClick={Start} />
                <ToolbarButton Text={"Stop"} OnClick={Stop} />
            </Div>
        </Toolbar>
    );
}

export default React.memo(MainToolbar);
