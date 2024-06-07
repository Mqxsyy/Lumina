import { RunService, Workspace } from "@rbxts/services";
import { StateField } from "API/Fields/StateField";
import { GetVolumetricParticlesFolder } from "API/FolderLocations";
import { CFrameZero } from "API/Lib";
import { ObjectPool } from "API/ObjectPool";
import { CreateParticleData, GetNextParticleId, type ParticleData, ParticleTypes } from "API/ParticleService";
import { VolumetricParticleShapeType } from "../FieldStates";
import type { InitializeNode } from "../Initialize/InitializeNode";
import type { UpdateNode } from "../Update/UpdateNode";
import { RenderNode } from "./RenderNode";

const DEFAULT_SIZE = new Vector3(1, 1, 1);
const DEFAULT_MATERIAL = Enum.Material.SmoothPlastic;
const DEAD_PARTICLES_CFRAME = new CFrame(0, 10000, 0);
const DEFAULT_COLOR = new Color3(1, 1, 1);

function CreateVolumetricParticle() {
    const particle = new Instance("Part");
    particle.Name = "VolumetricParticle";
    particle.Locked = true;

    particle.Size = DEFAULT_SIZE;
    particle.Material = DEFAULT_MATERIAL;
    particle.Color = DEFAULT_COLOR;

    particle.CastShadow = false;

    particle.Anchored = true;
    particle.CanCollide = false;
    particle.CanQuery = false;
    particle.CanTouch = false;
    particle.Massless = true;

    particle.Parent = GetVolumetricParticlesFolder();
    return particle;
}

function UpdateParticleProperties(data: ParticleData) {
    const particle = data.particle;

    const newSize = data.sizeNormal.add(data.sizeNormal.mul(data.sizeMultiplier));
    if (particle.Size !== newSize) {
        particle.Size = newSize;
    }

    if (particle.Transparency !== data.transparency) {
        particle.Transparency = data.transparency;
    }

    if (particle.Color !== data.color) {
        particle.Color = data.color;
    }
}

export class VolumetricParticle extends RenderNode {
    static className = "VolumetricParticle";

    nodeFields = {
        shape: new StateField(VolumetricParticleShapeType, VolumetricParticleShapeType.Cube),
    };

    objectPool: ObjectPool;
    updateLoop: undefined | RBXScriptConnection;
    aliveParticles: ParticleData[];

    constructor() {
        super();

        this.objectPool = new ObjectPool(CreateVolumetricParticle);
        this.aliveParticles = [];
    }

    Render = (initializeNodes: InitializeNode[], updateNodes: UpdateNode[]) => {
        const id = GetNextParticleId();
        const particle = this.objectPool.GetItem() as Part;
        particle.CFrame = CFrameZero;

        const shape = this.nodeFields.shape.GetState();
        if (shape === VolumetricParticleShapeType.Cube) {
            if (particle.Shape !== Enum.PartType.Block) {
                particle.Shape = Enum.PartType.Block;
            }
        } else if (shape === VolumetricParticleShapeType.Sphere) {
            if (particle.Shape !== Enum.PartType.Ball) {
                particle.Shape = Enum.PartType.Ball;
            }
        }

        const data = CreateParticleData(id, ParticleTypes.Cube, particle, updateNodes);

        for (const node of initializeNodes) {
            node.Run(data);
        }

        for (const node of updateNodes) {
            node.Run(data, 0.0167);
        }

        if (data.rotation !== CFrameZero) {
            particle.CFrame = particle.CFrame.mul(data.rotation);
        }

        UpdateParticleProperties(data);
        this.aliveParticles.push(data);

        if (this.updateLoop !== undefined) return;

        this.updateLoop = RunService.RenderStepped.Connect((dt) => {
            const movedParticles: BasePart[] = [];
            const movedParticlesCFrames: CFrame[] = [];

            for (let i = this.aliveParticles.size() - 1; i >= 0; i--) {
                const aliveParticleData = this.aliveParticles[i];

                if (aliveParticleData.alivetime + dt >= aliveParticleData.lifetime) {
                    this.aliveParticles.remove(i);
                    this.objectPool.RemoveItem(aliveParticleData.particle);

                    movedParticles.push(aliveParticleData.particle);
                    movedParticlesCFrames.push(DEAD_PARTICLES_CFRAME);

                    if (this.aliveParticles.size() === 0) {
                        if (this.updateLoop === undefined) continue;

                        this.updateLoop.Disconnect();
                        this.updateLoop = undefined;
                    }

                    continue;
                }

                for (const updateNode of aliveParticleData.updateNodes) {
                    updateNode.Run(aliveParticleData, dt);
                }

                if (aliveParticleData.velocityNormal !== Vector3.zero) {
                    const velocity = aliveParticleData.velocityNormal.mul(aliveParticleData.velocityMultiplier);
                    const pos = aliveParticleData.particle.Position.add(velocity.mul(dt));

                    let cf = new CFrame(pos);

                    if (aliveParticleData.rotation !== CFrameZero) {
                        cf = cf.mul(aliveParticleData.rotation);
                    }

                    movedParticles.push(aliveParticleData.particle);
                    movedParticlesCFrames.push(cf);
                }

                UpdateParticleProperties(aliveParticleData);

                aliveParticleData.alivetime += dt;
            }

            Workspace.BulkMoveTo(movedParticles, movedParticlesCFrames, Enum.BulkMoveMode.FireCFrameChanged);
        });
    };

    Destroy() {
        if (this.updateLoop !== undefined) {
            this.updateLoop.Disconnect();
        }

        for (const data of this.aliveParticles) {
            this.objectPool.RemoveItem(data.particle);
        }

        this.objectPool.ClearStandby();
    }

    GetClassName() {
        return VolumetricParticle.className;
    }
}
