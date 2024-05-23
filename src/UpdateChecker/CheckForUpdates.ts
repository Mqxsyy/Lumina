import { DataStoreService, HttpService, RunService } from "@rbxts/services";
import RequestUpdate from "./RequestUpdate";
import ShowUpdateLog from "./ShowUpdateLog";

interface Data {
    version: number;
}

const localPluginVersion = 4;
const StudioService = game.GetService("StudioService");

export default function CheckForUpdates() {
    if (RunService.IsRunning()) return;

    const res = HttpService.GetAsync("https://mqxsyy.github.io/Lumina/pluginVersion.json");
    const data = HttpService.JSONDecode(res) as Data;

    if (data !== undefined) {
        if (data.version !== localPluginVersion) {
            RequestUpdate();
        }
    }

    const [success1, pluginStore] = pcall(() => {
        return DataStoreService.GetDataStore("LuminaPlugin");
    });

    if (success1) {
        const [success2, loadedData] = pcall(() => {
            return (pluginStore as DataStore).GetAsync(`User_${StudioService.GetUserId()}`);
        });

        if (success2) {
            if (loadedData !== undefined) {
                if ((loadedData as Data).version !== localPluginVersion) {
                    ShowUpdateLog();
                }
            }
        } else {
            ShowUpdateLog();
        }

        pcall(() => {
            (pluginStore as DataStore).SetAsync(`User_${StudioService.GetUserId()}`, { version: localPluginVersion });
        });

        return;
    }

    warn("To view the update log, please enable the DataStore service.");
}
