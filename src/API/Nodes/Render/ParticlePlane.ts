import { RunService } from "@rbxts/services";
import { Orientation, OrientationField } from "API/Fields/OrientationField";
import { GetPlaneParticlesFolder } from "API/FolderLocations";
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

export const ParticlePlaneName = "ParticlePlane";
export const ParticlePlaneFieldNames = {
	orientation: "orientation",
};

export interface PlaneParticle extends Part {
	SurfaceGui: SurfaceGui & {
		ImageLabel: ImageLabel;
	};
}

interface AliveParticle {
	id: number;
	aliveTime: number;
	orientation: Orientation;
	basePart: BasePart;
	updateNodes: UpdateNode[];
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
	surfaceGui.CanvasSize = new Vector2(1000, 1000);
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

	displayFolder: Folder;
	aliveParticles: AliveParticle[];
	objectPool: ObjectPool;
	updateLoop: RBXScriptConnection | undefined;

	constructor() {
		super();

		this.displayFolder = GetPlaneParticlesFolder() as Folder;
		this.aliveParticles = [];
		this.objectPool = new ObjectPool(CreateParticlePlane(), this.displayFolder);
	}

	Render = (initializeNodes: InitializeNode[], updateNodes: UpdateNode[]) => {
		const particle = this.objectPool.GetItem() as PlaneParticle;
		particle.SurfaceGui.ImageLabel.ImageTransparency = 0;
		particle.Position = Vector3.zero;
		particle.Rotation = Vector3.zero;

		const id = GetNextParticleId();
		CreateParticleData(id, particle);

		initializeNodes.forEach((node) => {
			node.Initialize(id);
		});

		updateNodes.forEach((node) => {
			node.Update(id);
		});

		const orientation = this.nodeFields.orientation.GetOrientation();
		if (orientation === Orientation.FacingCamera) {
			particle.CFrame = CFrame.lookAt(particle.Position, game.Workspace.CurrentCamera!.CFrame.Position);
		}

		const aliveParticle: AliveParticle = {
			id: id,
			aliveTime: 0,
			orientation: orientation,
			basePart: particle,
			updateNodes: updateNodes,
		};

		this.aliveParticles.push(aliveParticle);
		particle.Parent = this.displayFolder;

		if (this.updateLoop === undefined) {
			this.updateLoop = RunService.RenderStepped.Connect((dt) => {
				for (let i = this.aliveParticles.size() - 1; i >= 0; i--) {
					const particle = this.aliveParticles[i];
					const particleData = GetParticleData(particle.id);

					if (particle.aliveTime >= particleData.lifetime) {
						this.aliveParticles.remove(i);
						this.objectPool.RemoveItem(particle.basePart);

						if (this.aliveParticles.size() === 0) {
							this.updateLoop!.Disconnect();
							this.updateLoop = undefined;
						}
					} else {
						task.spawn(() => {
							for (const updateNode of particle.updateNodes) {
								updateNode.Update(particle.id);
							}

							let position;
							if (particleData.velocity !== Vector3.zero) {
								position = particle.basePart.Position.add(particleData.velocity.mul(dt));
							}

							let cframe;
							if (particle.orientation === Orientation.FacingCamera) {
								if (position !== undefined) {
									cframe = CFrame.lookAt(position, game.Workspace.CurrentCamera!.CFrame.Position);
								} else {
									cframe = CFrame.lookAt(
										particle.basePart.Position,
										game.Workspace.CurrentCamera!.CFrame.Position,
									);
								}
							}

							if (cframe !== undefined) {
								particle.basePart.CFrame = cframe;
							} else if (position !== undefined) {
								particle.basePart.Position = position;
							}
						});

						particle.aliveTime += dt;
					}
				}
			});
		}
	};

	GetNodeName(): string {
		return ParticlePlaneName;
	}

	GetAutoGenerationCode() {
		return AutogenParticlePlane(this);
	}

	Destroy() {
		if (this.updateLoop !== undefined) {
			this.updateLoop.Disconnect();
		}

		this.aliveParticles.forEach((particle) => {
			this.objectPool.RemoveItem(particle.basePart);
		});

		this.objectPool.ClearStandby();
	}
}
