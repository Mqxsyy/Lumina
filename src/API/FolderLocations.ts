import { ServerStorage, Workspace } from "@rbxts/services";

let displayVfxFolder = Workspace.FindFirstChild("CrescentVFX Graph Particles");
if (displayVfxFolder === undefined) {
	displayVfxFolder = new Instance("Folder");
	displayVfxFolder.Name = "CrescentVFX Graph Particles";
	displayVfxFolder.Parent = Workspace;
}

export function GetLiveParticlesFolder(): Folder {
	return displayVfxFolder as Folder;
}

let savesFolder = ServerStorage.FindFirstChild("CrescentVFX Saves");
if (savesFolder === undefined) {
	savesFolder = new Instance("Folder");
	savesFolder.Name = "CrescentVFX Saves";
	savesFolder.Parent = ServerStorage;
}

export function GetSavesFolder(): Folder {
	return savesFolder as Folder;
}
