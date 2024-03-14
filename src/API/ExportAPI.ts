import { StarterPlayer } from "@rbxts/services";

const VERSION = 4;

const StartPlayerScripts = StarterPlayer.WaitForChild("StarterPlayerScripts");
let APIFolder = StartPlayerScripts.FindFirstChild("CrescentVFX-API");

if (APIFolder === undefined) {
	APIFolder = new Instance("Folder");
	APIFolder.Name = "CrescentVFX-API";
	APIFolder.Parent = StartPlayerScripts;
}

function CreateAPI() {
	print("Creating API");

	for (const child of APIFolder!.GetChildren()) {
		if (child.Name === "Version") continue;
		child.Destroy();
	}

	const API = script.Parent!.Clone();
	API.Parent = APIFolder;
}

export default function ExportAPI() {
	const previousVersion = APIFolder!.FindFirstChild("Version") as NumberValue | undefined;
	if (previousVersion !== undefined) {
		if (previousVersion.Value === VERSION) {
			print("API is up to date");
			return;
		}

		previousVersion.Value = VERSION;
		CreateAPI();
		return;
	}

	const version = new Instance("NumberValue");
	version.Name = "Version";
	version.Value = VERSION;
	version.Parent = APIFolder;

	CreateAPI();
}
