import { RunService } from "@rbxts/services";
import { Orientation, OrientationField } from "API/Fields/OrientationField";
import { GetLiveParticlesFolder } from "API/FolderLocations";
import { ObjectPool } from "API/ObjectPool";
import { CreateParticleData, GetNextParticleId, GetParticleData } from "API/ParticleService";
import { NodeGroups } from "../../NodeGroup";
import { AutogenParticlePlane } from "../AutoGeneration/RenderNodes/AutoGenParticlePlane";
import { InitializeNode } from "../Initialize/InitializeNode";
import { UpdateNode } from "../Update/UpdateNode";
import { RenderNode } from "./RenderNode";

// TODO: make double sided, required reversed image if not symmetrical

const DEFAULT_SIZE = new Vector3(1, 1, 0.001);
const DEFAULT_TEXTURE = "rbxassetid://7848741169";
const DEFAULT_COLOR = new Color3(1, 1, 1);
const DEFAULT_EMISSION = 1;

export interface PlaneParticle extends Part {
	SurfaceGui: SurfaceGui & {
		ImageLabel: ImageLabel;
	};
}

function CreateParticlePlane(): PlaneParticle {
	const particlePlane = new Instance("Part");
	particlePlane.Name = "ParticlePlane";

	particlePlane.Size = DEFAULT_SIZE;
	particlePlane.Transparency = 1;

	particlePlane.CastShadow = false;

	particlePlane.Anchored = true;
	particlePlane.CanCollide = false;
	particlePlane.CanQuery = false;
	particlePlane.CanTouch = false;
	particlePlane.Massless = true;

	const surfaceGui = new Instance("SurfaceGui");
	surfaceGui.Parent = particlePlane;
	surfaceGui.LightInfluence = 0;
	surfaceGui.Brightness = DEFAULT_EMISSION;

	const imageLabel = new Instance("ImageLabel");
	imageLabel.Size = new UDim2(1, 0, 1, 0);
	imageLabel.BackgroundTransparency = 1;
	imageLabel.Image = DEFAULT_TEXTURE;
	imageLabel.ImageColor3 = DEFAULT_COLOR;
	imageLabel.Parent = surfaceGui;

	return particlePlane as PlaneParticle;
}

export class ParticlePlane extends RenderNode {
	nodeGroup: NodeGroups = NodeGroups.Render;
	nodeFields = {
		orientation: new OrientationField(Orientation.FacingCamera),
	};

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

	Render = (initializeNodes: InitializeNode[], updateNodes: UpdateNode[]) => {
		const particle = this.objectPool.GetItem() as PlaneParticle;
		particle.SurfaceGui.ImageLabel.ImageTransparency = 0;
		particle.Position = Vector3.zero;

		const orientation = this.nodeFields.orientation.GetValue();
		if (orientation === Orientation.FacingCamera) {
			particle.CFrame = CFrame.lookAt(particle.Position, game.Workspace.CurrentCamera!.CFrame.Position);
		}

		const id = GetNextParticleId();
		CreateParticleData(id, particle);

		initializeNodes.forEach((node) => {
			node.Initialize(id);
		});

		let aliveTime = 0;
		const lifetime = GetParticleData(id).lifetime;
		const connection = RunService.RenderStepped.Connect((dt) => {
			if (aliveTime >= lifetime) {
				connection.Disconnect();
				this.objectPool.RemoveItem(particle);
				return;
			}

			updateNodes.forEach((node) => {
				node.Update(id);
			});

			const particleData = GetParticleData(id);
			if (particleData.velocity !== Vector3.zero) {
				particle.Position = particle.Position.add(particleData.velocity.mul(dt));
			}

			if (orientation === Orientation.FacingCamera) {
				particle.CFrame = CFrame.lookAt(particle.Position, game.Workspace.CurrentCamera!.CFrame.Position);
			}

			aliveTime += dt;
		});

		particle.Parent = this.displayFolder;
		return;
	};

	GetAutoGenerationCode() {
		return AutogenParticlePlane(this);
	}

	Destroy() {
		this.objectPool.ClearStandby();
	}
}
