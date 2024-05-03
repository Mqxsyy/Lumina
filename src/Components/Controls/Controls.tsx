import React from "@rbxts/react";
import ExportAPI from "API/ExportAPI";
import { GetExportsFolder } from "API/FolderLocations";
import ExportAsScript from "API/VFXScriptCreator";
import { GetAllSystems } from "Services/NodeSystemService";
import { LoadFromFile } from "Services/Saving/LoadService";
import { SaveToFile } from "Services/Saving/SaveService";
import Div from "../Div";
import { ControlButton } from "./ControlButton";

const CANVAS_PADDING = 5;
const BUTTONS_PADDING = 5;
const BUTTON_WIDTH = 125;
const BUTTON_HEIGHT = 25;

function Controls() {
    const Start = () => {
        const nodeSystems = GetAllSystems();
        nodeSystems.forEach((nodeSystem) => {
            nodeSystem.data.system.Run();
        });
    };

    const Stop = () => {
        const nodeSystems = GetAllSystems();
        nodeSystems.forEach((nodeSystem) => {
            nodeSystem.data.system.Stop();
        });
    };

    const Export = () => {
        ExportAPI();

        const exportsFolder = GetExportsFolder();
        const exportedFiles = ExportAsScript();
        const saveData = SaveToFile();

        if (exportedFiles.size() === 1) {
            saveData.Parent = exportedFiles[0];
            exportedFiles[0].Parent = exportsFolder;
        } else {
            const folder = new Instance("Folder");
            folder.Name = "VFX Container";
            folder.Parent = exportsFolder;

            exportedFiles.forEach((file) => {
                file.Parent = folder;
            });

            saveData.Parent = folder;
        }
    };

    const Save = () => {
        SaveToFile();
    };

    const Load = () => {
        LoadFromFile();
    };

    return (
        <Div
            AnchorPoint={new Vector2(1, 0)}
            Position={new UDim2(1, -CANVAS_PADDING, 0, CANVAS_PADDING)}
            Size={UDim2.fromOffset(BUTTON_WIDTH, BUTTON_HEIGHT * 2 + BUTTONS_PADDING)}
        >
            <ControlButton
                Position={UDim2.fromOffset(0, 0)}
                Size={UDim2.fromOffset(BUTTON_WIDTH, BUTTON_HEIGHT)}
                Text="Start"
                MouseButton1Down={Start}
            />
            <ControlButton
                Position={UDim2.fromOffset(0, BUTTON_HEIGHT + BUTTONS_PADDING)}
                Size={UDim2.fromOffset(BUTTON_WIDTH, BUTTON_HEIGHT)}
                Text="Stop"
                MouseButton1Down={Stop}
            />
            <ControlButton
                Position={UDim2.fromOffset(0, (BUTTON_HEIGHT + BUTTONS_PADDING) * 2)}
                Size={UDim2.fromOffset(BUTTON_WIDTH, BUTTON_HEIGHT)}
                Text="Export"
                MouseButton1Down={Export}
            />
            <ControlButton
                Position={UDim2.fromOffset(0, (BUTTON_HEIGHT + BUTTONS_PADDING) * 3)}
                Size={UDim2.fromOffset(BUTTON_WIDTH, BUTTON_HEIGHT)}
                Text="Save"
                MouseButton1Down={Save}
            />
            <ControlButton
                Position={UDim2.fromOffset(0, (BUTTON_HEIGHT + BUTTONS_PADDING) * 4)}
                Size={UDim2.fromOffset(BUTTON_WIDTH, BUTTON_HEIGHT)}
                Text="Load"
                MouseButton1Down={Load}
            />
        </Div>
    );
}

export default React.memo(Controls);
