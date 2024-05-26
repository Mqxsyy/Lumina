import { HttpService, RunService } from "@rbxts/services";
import RequestUpdate from "./RequestUpdate";
import ShowUpdateLog from "./ShowUpdateLog";

interface Data {
    version: number;
}

const localVersion = 5;

export default function CheckForUpdates(plugin: Plugin) {
    if (RunService.IsRunning()) return;

    const res = HttpService.GetAsync("https://mqxsyy.github.io/Lumina/pluginVersion.json");
    const data = HttpService.JSONDecode(res) as Data;

    if (data !== undefined) {
        if (data.version !== localVersion) {
            RequestUpdate();
            return;
        }
    }

    const savedVersion = plugin.GetSetting("Version");
    // at a later date make a nil check, don't want to show log to new users
    if (savedVersion !== localVersion) {
        plugin.SetSetting("Version", localVersion);
        ShowUpdateLog();
    }
}

// this file
// Readme.ts
// Main.server.ts
// pluginVersion.json
// updateLog
