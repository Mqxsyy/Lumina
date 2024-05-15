import { RunService, ServerStorage, Workspace } from "@rbxts/services";

export function GetLiveParticlesFolder(): Folder {
    let liveParticlesFolder = Workspace.FindFirstChild("Lumina Particles");
    if (liveParticlesFolder === undefined) {
        liveParticlesFolder = new Instance("Folder");
        liveParticlesFolder.Name = "Lumina Particles";
        liveParticlesFolder.Parent = Workspace;
    }

    return liveParticlesFolder as Folder;
}

if (!RunService.IsRunning()) {
    const liveParticlesFolder = GetLiveParticlesFolder();
    if (liveParticlesFolder !== undefined) {
        liveParticlesFolder.ClearAllChildren();
    }
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

export function GetVolumetricParticlesFolder(): Folder {
    const liveParticlesFolder = GetLiveParticlesFolder();

    let volumetricParticlesFolder = liveParticlesFolder.FindFirstChild("Volumetric Particles");
    if (volumetricParticlesFolder === undefined) {
        volumetricParticlesFolder = new Instance("Folder");
        volumetricParticlesFolder.Name = "Volumetric Particles";
        volumetricParticlesFolder.Parent = liveParticlesFolder;
    }

    return volumetricParticlesFolder as Folder;
}

// let livePlanarParticlesFolder = StarterGui.FindFirstChild("Lumina Planar Particles");
// if (livePlanarParticlesFolder === undefined) {
// 	livePlanarParticlesFolder = new Instance("ScreenGui");
// 	livePlanarParticlesFolder.Name = "Lumina Planar Particles";
// 	livePlanarParticlesFolder.Parent = StarterGui;
// }

// export function GetLivePlanarParticlesFolder(): ScreenGui {
// 	return livePlanarParticlesFolder as ScreenGui;
// }

export function GetExportsFolder(): Folder {
    let exportsFolder = ServerStorage.FindFirstChild("Lumina Exports");
    if (exportsFolder === undefined) {
        exportsFolder = new Instance("Folder");
        exportsFolder.Name = "Lumina Exports";
        exportsFolder.Parent = ServerStorage;
    }

    return exportsFolder as Folder;
}

export function GetSavesFolder(): Folder {
    let savesFolder = ServerStorage.FindFirstChild("Lumina Saves");
    if (savesFolder === undefined) {
        savesFolder = new Instance("Folder");
        savesFolder.Name = "Lumina Saves";
        savesFolder.Parent = ServerStorage;
    }

    return savesFolder as Folder;
}
