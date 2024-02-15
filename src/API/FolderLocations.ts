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

export function ClearParticles() {
	if (displayVfxFolder !== undefined) {
		for (const child of displayVfxFolder.GetChildren()) {
			if (child.IsA("Folder")) {
				for (const particle of child.GetChildren()) {
					particle.Destroy();
				}
			}

			child.Destroy();
		}
	}
}
