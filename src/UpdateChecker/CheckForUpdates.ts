import { HttpService, RunService } from "@rbxts/services";
import RequestUpdate from "./RequestUpdate";
import ShowUpdateLog from "./ShowUpdateLog";

interface Data {
    version: number;
}

const localVersion = 8;

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
    if (savedVersion !== localVersion && savedVersion !== undefined) {
        ShowUpdateLog();
        plugin.SetSetting("Version", localVersion);
    }
}

// this file
// Readme.ts
// Main.server.ts
// pluginVersion.json
// updateLog

// check works
// new release in git
// post in devforum
// post in disc
