import { DataStoreService, HttpService, RunService } from "@rbxts/services";
import RequestUpdate from "./RequestUpdate";
import ShowUpdateLog from "./ShowUpdateLog";

interface Data {
    version: number;
}

const localPluginVersion = 3;
const StudioService = game.GetService("StudioService");

export default function CheckForUpdates() {
    if (RunService.IsRunning()) return;

    const res = HttpService.GetAsync("https://mqxsyy.github.io/Lumina/pluginVersion.json");
    const data = HttpService.JSONDecode(res) as Data;

    if (data.version !== localPluginVersion) {
        RequestUpdate();
    }

    const pluginStore = DataStoreService.GetDataStore("LuminaPlugin");

    const [success, loadedData] = pcall(() => {
        return pluginStore.GetAsync(`User_${StudioService.GetUserId()}`);
    });

    if (success) {
        if ((loadedData as Data).version !== localPluginVersion) {
            ShowUpdateLog();
        }
    }

    pcall(() => {
        pluginStore.SetAsync(`User_${StudioService.GetUserId()}`, { version: localPluginVersion });
    });
}
