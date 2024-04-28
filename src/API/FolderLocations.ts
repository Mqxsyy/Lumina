import { ServerStorage, Workspace } from "@rbxts/services";

export function GetLiveParticlesFolder(): Folder {
	let liveParticlesFolder = Workspace.FindFirstChild("LunarVFX Particles");
	if (liveParticlesFolder === undefined) {
		liveParticlesFolder = new Instance("Folder");
		liveParticlesFolder.Name = "LunarVFX Particles";
		liveParticlesFolder.Parent = Workspace;
	}

	return liveParticlesFolder as Folder;
}

export function GetPlaneParticlesFolder(): Folder {
	const liveParticlesFolder = GetLiveParticlesFolder();

	let planeParticlesFolder = liveParticlesFolder.FindFirstChild("Plane Particles");
	if (planeParticlesFolder === undefined) {
		planeParticlesFolder = new Instance("Folder");
		planeParticlesFolder.Name = "Plane Particles";
		planeParticlesFolder.Parent = liveParticlesFolder;
	}

	return planeParticlesFolder as Folder;
}

// let livePlanarParticlesFolder = StarterGui.FindFirstChild("LunarVFX Planar Particles");
// if (livePlanarParticlesFolder === undefined) {
// 	livePlanarParticlesFolder = new Instance("ScreenGui");
// 	livePlanarParticlesFolder.Name = "LunarVFX Planar Particles";
// 	livePlanarParticlesFolder.Parent = StarterGui;
// }

// export function GetLivePlanarParticlesFolder(): ScreenGui {
// 	return livePlanarParticlesFolder as ScreenGui;
// }

export function GetExportsFolder(): Folder {
	let exportsFolder = ServerStorage.FindFirstChild("LunarVFX Exports");
	if (exportsFolder === undefined) {
		exportsFolder = new Instance("Folder");
		exportsFolder.Name = "LunarVFX Exports";
		exportsFolder.Parent = ServerStorage;
	}

	return exportsFolder as Folder;
}

export function GetSavesFolder(): Folder {
	let savesFolder = ServerStorage.FindFirstChild("LunarVFX Saves");
	if (savesFolder === undefined) {
		savesFolder = new Instance("Folder");
		savesFolder.Name = "LunarVFX Saves";
		savesFolder.Parent = ServerStorage;
	}

	return savesFolder as Folder;
}
