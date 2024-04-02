import { Workspace } from "@rbxts/services";

let displayVfxFolder = Workspace.FindFirstChild("CrescentVFX Graph Particles");
if (displayVfxFolder === undefined) {
	displayVfxFolder = new Instance("Folder");
	displayVfxFolder.Name = "CrescentVFX Graph Particles";
	displayVfxFolder.Parent = Workspace;
}

export function GetLiveParticlesFolder(): Folder {
	return displayVfxFolder as Folder;
}
