import { NodeGroups } from "../../NodeGroup";
import { NodeTypes } from "../NodeTypes";
import { RunService } from "@rbxts/services";
import { ObjectPool } from "API/ObjectPool";
import { GetLiveParticlesFolder } from "API/FolderLocations";
import { RenderNode, ParticleInitParams, ParticleUpdateParams } from "./RenderNode";

export class ParticlePlane extends RenderNode {
	nodeGroup: NodeGroups = NodeGroups.Render;
	nodeType: NodeTypes = NodeTypes.ParticlePlane;
	nodeFields = {};

	objectPool: ObjectPool;
	displayFolder: Folder;

	constructor() {
		super();

		const particlePlane = new Instance("Part");

		particlePlane.Size = new Vector3(1, 1, 0.1);
		particlePlane.Color = Color3.fromHex("#FFFFFF");
		particlePlane.Transparency = 0;

		particlePlane.Anchored = true;
		particlePlane.CanCollide = false;
		particlePlane.CanQuery = false;
		particlePlane.CanTouch = false;
		particlePlane.Massless = true;

		const liveParticlesFolder = GetLiveParticlesFolder();
		let displayPlaneParticlesFolder = liveParticlesFolder.FindFirstChild("PlaneParticles");
		if (displayPlaneParticlesFolder === undefined) {
			displayPlaneParticlesFolder = new Instance("Folder");
			displayPlaneParticlesFolder.Name = "PlaneParticles";
			displayPlaneParticlesFolder.Parent = liveParticlesFolder;
		}

		this.objectPool = new ObjectPool(particlePlane, liveParticlesFolder as Folder);
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

			update.position.forEach((fn) => {
				particle.Position = fn(particle.Position);
			});

			aliveTime += dt;
		});

		particle.Parent = this.displayFolder;

		return;
	};

	Destroy() {
		this.objectPool.ClearStandby();
	}
}
