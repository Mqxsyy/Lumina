import { ReplicatedStorage } from "@rbxts/services";

export const API_VERSION = 81;

function GetAPIFolder() {
    let APIFolder = ReplicatedStorage.FindFirstChild("Lumina_API");
    if (APIFolder !== undefined) return APIFolder;

    APIFolder = new Instance("Folder");
    APIFolder.Name = "Lumina_API";
    APIFolder.Parent = ReplicatedStorage;
    return APIFolder;
}

function CreateAPI() {
    const apiFolder = GetAPIFolder();

    for (const child of apiFolder!.GetChildren()) {
        if (child.Name === "API_VERSION") continue;
        child.Destroy();
    }

    const API = script.Parent!.Clone();
    API.Parent = apiFolder;
    API.FindFirstChild("Readme")!.Parent = apiFolder;

    const include = script.Parent!.Parent!.FindFirstChild("include")!.Clone();
    include.Parent = apiFolder;
}

export default function ExportAPI() {
    const apiFolder = GetAPIFolder();
    const previousVersion = apiFolder!.FindFirstChild("API_VERSION") as NumberValue | undefined;

    if (previousVersion !== undefined) {
        if (previousVersion.Value === API_VERSION) return;

        previousVersion.Value = API_VERSION;
        CreateAPI();
        return;
    }

    CreateAPI();

    const version = new Instance("NumberValue");
    version.Name = "API_VERSION";
    version.Value = API_VERSION;
    version.Parent = apiFolder;
}
