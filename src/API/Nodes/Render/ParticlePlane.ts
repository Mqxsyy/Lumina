import { NodeGroups } from "../../NodeGroup";
import { NodeTypes } from "../NodeTypes";
import { RunService } from "@rbxts/services";
import { ObjectPool } from "API/ObjectPool";
import { GetLiveParticlesFolder } from "API/FolderLocations";
import { RenderNode, ParticleInitParams, ParticleUpdateParams } from "./RenderNode";

// TODO: make a plane mesh that displays the image; need this for emission and flipping backside image

const DEFAULT_SIZE = new Vector3(1, 1, 0.01);
const DEFAULT_IMAGE = "rbxassetid://7848741169";

function CreateImage(): SurfaceGui {
	const surfaceGui = new Instance("SurfaceGui");

	const imageLabel = new Instance("ImageLabel");
	imageLabel.Size = UDim2.fromScale(1, 1);
	imageLabel.BorderSizePixel = 0;
	imageLabel.BackgroundTransparency = 1;
	imageLabel.ImageColor3 = new Color3(2, 2, 2);
	imageLabel.Parent = surfaceGui;
	imageLabel.Image = DEFAULT_IMAGE;

	return surfaceGui;
}

function CreateParticlePlane(): BasePart {
	const particlePlane = new Instance("Part");

	particlePlane.Size = DEFAULT_SIZE;
	particlePlane.Transparency = 1;

	particlePlane.CastShadow = false;

	particlePlane.Anchored = true;
	particlePlane.CanCollide = false;
	particlePlane.CanQuery = false;
	particlePlane.CanTouch = false;
	particlePlane.Massless = true;

	const frontSurfaceGui = CreateImage();
	frontSurfaceGui.Face = Enum.NormalId.Front;
	frontSurfaceGui.Parent = particlePlane;

	const backSurfaceGui = CreateImage();
	backSurfaceGui.Face = Enum.NormalId.Back;
	backSurfaceGui.Parent = particlePlane;

	return particlePlane;
}

export class ParticlePlane extends RenderNode {
	nodeGroup: NodeGroups = NodeGroups.Render;
	nodeType: NodeTypes = NodeTypes.ParticlePlane;
	nodeFields = {};

	objectPool: ObjectPool;
	displayFolder: Folder;

	constructor() {
		super();

		const liveParticlesFolder = GetLiveParticlesFolder();
		let displayPlaneParticlesFolder = liveParticlesFolder.FindFirstChild("PlaneParticles");
		if (displayPlaneParticlesFolder === undefined) {
			displayPlaneParticlesFolder = new Instance("Folder");
			displayPlaneParticlesFolder.Name = "PlaneParticles";
			displayPlaneParticlesFolder.Parent = liveParticlesFolder;
		}

		this.objectPool = new ObjectPool(CreateParticlePlane(), liveParticlesFolder as Folder);
		this.displayFolder = displayPlaneParticlesFolder as Folder;
	}

	Render = (init: ParticleInitParams, update: ParticleUpdateParams) => {
		const particle = this.objectPool.GetItem();
		particle.Position = init.position;

		let aliveTime = 0;
		const connection = RunService.RenderStepped.Connect((dt) => {
			if (aliveTime >= init.lifetime) {
				connection.Disconnect();
				this.objectPool.RemoveItem(particle);
				return;
			}

			if (update.position !== undefined) {
				for (const fn of update.position) {
					particle.Position = fn(init.id, particle.Position);
				}
			}

			aliveTime += dt;
		});

		particle.Parent = this.displayFolder;

		return;
	};

	Destroy() {
		this.objectPool.ClearStandby();
	}
}
