import { RunService, ServerStorage, Workspace } from "@rbxts/services";

function GetFolder(parent: Instance, name: string) {
    let folder = parent.FindFirstChild(name);

    if (folder === undefined) {
        folder = new Instance("Folder");
        folder.Name = name;
        folder.Parent = parent;
    }

    return folder as Folder;
}

export function GetParticlesFolder(): Folder {
    return GetFolder(Workspace, "Lumina Particles");
}

if (!RunService.IsRunning()) {
    const liveParticlesFolder = GetParticlesFolder();
    if (liveParticlesFolder !== undefined) {
        liveParticlesFolder.ClearAllChildren();
    }
}

export function GetPlaneParticlesFolder(): Folder {
    return GetParticlesFolder();
}

export function GetVolumetricParticlesFolder(): Folder {
    return GetParticlesFolder();
}

export function GetMeshParticlesFolder(): Folder {
    return GetParticlesFolder();
}

export function GetExportsFolder(): Folder {
    return GetFolder(ServerStorage, "Lumina Exports");
}

export function GetSavesFolder(): Folder {
    return GetFolder(ServerStorage, "Lumina Saves");
}

export function GetLibraryFolder(): Folder {
    return GetFolder(ServerStorage, "Lumina Library");
}

export function CreateDefaultImage(imageName: string, imageId: number, parent: Folder) {
    const image = new Instance("IntValue");
    image.Name = imageName;
    image.Value = imageId;

    image.SetAttribute("Width", 1024);
    image.SetAttribute("Height", 1024);
    image.SetAttribute("Columns", 1);
    image.SetAttribute("Rows", 1);
    image.SetAttribute("FrameCount", 1);
    image.SetAttribute("Undeletable", true);

    image.Parent = parent;
}

export function GetImagesFolder(): Folder {
    const imagesFolder = GetFolder(GetLibraryFolder(), "Images");

    const defaultParticle = imagesFolder.FindFirstChild("Default Particle");
    if (defaultParticle === undefined) {
        CreateDefaultImage("Default Particle", 7982947463, imagesFolder);
    }

    return imagesFolder;
}

function CreateDefaultMesh(meshName: string, meshId: number, parent: Folder) {
    const mesh = new Instance("IntValue");
    mesh.Name = meshName;
    mesh.Value = meshId;

    mesh.SetAttribute("PreviewDistance", 3.5);
    mesh.SetAttribute("PreviewHeight", 0.75);
    mesh.SetAttribute("PreviewAngle", 15);
    mesh.SetAttribute("PreviewRotation", 30);
    mesh.SetAttribute("Undeletable", true);

    mesh.Parent = parent;
}

export function GetMeshesFolder(): Folder {
    const meshesFolder = GetFolder(GetLibraryFolder(), "Meshes");

    const defaultCube = meshesFolder.FindFirstChild("Default Cube");
    if (defaultCube === undefined) {
        CreateDefaultMesh("Default Cube", 18145240600, meshesFolder);
    }

    const defaultCylinder = meshesFolder.FindFirstChild("Default Cylinder");
    if (defaultCylinder === undefined) {
        CreateDefaultMesh("Default Cylinder", 18145245562, meshesFolder);
    }

    const defaultSphere = meshesFolder.FindFirstChild("Default Sphere");
    if (defaultSphere === undefined) {
        CreateDefaultMesh("Default Sphere", 18145251628, meshesFolder);
    }

    return meshesFolder;
}
