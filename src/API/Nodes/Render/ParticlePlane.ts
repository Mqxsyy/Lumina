import { Node } from "../Node";
import { NodeGroups } from "../../NodeGroup";
import { NodeTypes } from "../NodeTypes";
import { ReplicatedStorage, RunService, Workspace } from "@rbxts/services";
import { ObjectPool } from "API/ObjectPool";

export interface ParticleInitParams {
	lifetime: number;
	position: Vector3;
}

export type PositionUpdateFn = (position: Vector3) => Vector3;

export interface ParticleUpdateParams {
	position: PositionUpdateFn[];
}

export class ParticlePlane extends Node<[ParticleInitParams, ParticleUpdateParams]> {
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

		let pooledVfxFolder = ReplicatedStorage.FindFirstChild("CrescentVFX Graph Particles");
		if (pooledVfxFolder === undefined) {
			pooledVfxFolder = new Instance("Folder");
			pooledVfxFolder.Name = "CrescentVFX Graph Particles";
			pooledVfxFolder.Parent = ReplicatedStorage;
		}

		let pooledPlaneParticlesFolder = pooledVfxFolder.FindFirstChild("PlaneParticles");
		if (pooledPlaneParticlesFolder === undefined) {
			pooledPlaneParticlesFolder = new Instance("Folder");
			pooledPlaneParticlesFolder.Name = "PlaneParticles";
			pooledPlaneParticlesFolder.Parent = ReplicatedStorage;
		}

		this.objectPool = new ObjectPool(particlePlane, pooledPlaneParticlesFolder as Folder);

		let displayVfxFolder = Workspace.FindFirstChild("CrescentVFX Graph Particles");
		if (displayVfxFolder === undefined) {
			displayVfxFolder = new Instance("Folder");
			displayVfxFolder.Name = "CrescentVFX Graph Particles";
			displayVfxFolder.Parent = Workspace;
		}

		let displayPlaneParticlesFolder = displayVfxFolder.FindFirstChild("PlaneParticles");
		if (displayPlaneParticlesFolder === undefined) {
			displayPlaneParticlesFolder = new Instance("Folder");
			displayPlaneParticlesFolder.Name = "PlaneParticles";
			displayPlaneParticlesFolder.Parent = Workspace;
		}

		this.displayFolder = displayPlaneParticlesFolder as Folder;
	}

	fn = (init: ParticleInitParams, update: ParticleUpdateParams) => {
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
}
