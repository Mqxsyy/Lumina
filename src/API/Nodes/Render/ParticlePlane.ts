import { NodeGroups } from "../../NodeGroup";
import { NodeTypes } from "../NodeTypes";
import { RunService } from "@rbxts/services";
import { ObjectPool } from "API/ObjectPool";
import { GetLiveParticlesFolder } from "API/FolderLocations";
import { RenderNode, ParticleInitParams, ParticleUpdateParams } from "./RenderNode";
import { NumberField } from "API/Fields/NumberField";
import { Vector3Field } from "API/Fields/Vector3Field";
import { Orientation, OrientationField } from "API/Fields/OrientationField";
import { RemapValue } from "API/Lib";

// TODO: make double sided, required reversed image if not symmetrical

const DEFAULT_SIZE = new Vector3(1, 1, 0.001);
const DEFAULT_TEXTURE = "rbxassetid://7848741169";
const DEFAULT_COLOR = new Color3(1, 1, 1);
const DEFAULT_EMISSION = 1;

interface PlaneParticle extends Part {
	SurfaceGui: SurfaceGui & {
		Image: ImageLabel;
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
	nodeType: NodeTypes = NodeTypes.ParticlePlane;
	nodeFields = {
		color: new Vector3Field(new Vector3(1, 1, 1)),
		emission: new NumberField(1),
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

	Render = (init: ParticleInitParams, update: ParticleUpdateParams) => {
		const particle = this.objectPool.GetItem() as PlaneParticle;
		particle.Position = init.position;

		const orientation = this.nodeFields.orientation.GetValue();
		if (orientation === Orientation.FacingCamera) {
			particle.CFrame = CFrame.lookAt(particle.Position, game.Workspace.CurrentCamera!.CFrame.Position);
		}

		let aliveTime = 0;

		const connection = RunService.RenderStepped.Connect((dt) => {
			if (aliveTime >= init.lifetime) {
				connection.Disconnect();
				this.objectPool.RemoveItem(particle);
				return;
			}

			if (orientation === Orientation.FacingCamera) {
				particle.CFrame = CFrame.lookAt(particle.Position, game.Workspace.CurrentCamera!.CFrame.Position);
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
