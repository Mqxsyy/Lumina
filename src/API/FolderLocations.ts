import { ServerStorage, Workspace } from "@rbxts/services";

let liveParticlesFolder = Workspace.FindFirstChild("CrescentVFX Graph Particles");
if (liveParticlesFolder === undefined) {
	liveParticlesFolder = new Instance("Folder");
	liveParticlesFolder.Name = "CrescentVFX Graph Particles";
	liveParticlesFolder.Parent = Workspace;
}

export function GetLiveParticlesFolder(): Folder {
	return liveParticlesFolder as Folder;
}

let planeParticlesFolder = liveParticlesFolder.FindFirstChild("PlaneParticles");
if (planeParticlesFolder === undefined) {
	planeParticlesFolder = new Instance("Folder");
	planeParticlesFolder.Name = "PlaneParticles";
	planeParticlesFolder.Parent = liveParticlesFolder;
}

export function GetPlaneParticlesFolder(): Folder {
	return planeParticlesFolder as Folder;
}

let exportsFolder = ServerStorage.FindFirstChild("CrescentVFX Exports");
if (exportsFolder === undefined) {
	exportsFolder = new Instance("Folder");
	exportsFolder.Name = "CrescentVFX Exports";
	exportsFolder.Parent = ServerStorage;
}

export function GetExportsFolder(): Folder {
	return exportsFolder as Folder;
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
