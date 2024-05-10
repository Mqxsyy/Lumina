import { HttpService } from "@rbxts/services";
import RequestUpdate from "./RequestUpdate";

interface Data {
    version: number;
}

const localPluginVersion = 1;

export default function CheckForUpdates() {
    const res = HttpService.GetAsync("https://mqxsyy.github.io/Lumina/pluginVersion.json");
    const data = HttpService.JSONDecode(res) as Data;

    if (data.version !== localPluginVersion) {
        RequestUpdate();
    }
}
