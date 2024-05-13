import { HttpService, RunService } from "@rbxts/services";
import RequestUpdate from "./RequestUpdate";

interface Data {
    version: number;
}

const localPluginVersion = 3;

export default function CheckForUpdates() {
    if (RunService.IsRunning()) return;

    const res = HttpService.GetAsync("https://mqxsyy.github.io/Lumina/pluginVersion.json");
    const data = HttpService.JSONDecode(res) as Data;

    if (data.version !== localPluginVersion) {
        RequestUpdate();
    }
}
