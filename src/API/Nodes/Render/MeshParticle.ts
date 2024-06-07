import { RunService, Workspace } from "@rbxts/services";
import { NumberField } from "API/Fields/NumberField";
import { Vector2Field } from "API/Fields/Vector2Field";
import { GetMeshParticlesFolder } from "API/FolderLocations";
import { CFrameZero } from "API/Lib";
import { ObjectPool } from "API/ObjectPool";
import { CreateParticleData, GetNextParticleId, type ParticleData, ParticleTypes } from "API/ParticleService";
import type { InitializeNode } from "../Initialize/InitializeNode";
import type { UpdateNode } from "../Update/UpdateNode";
import { RenderNode } from "./RenderNode";

const BASE_SIZE = new Vector3(0.001, 0.001, 0.001);
const DEFAULT_SIZE = new Vector3(1, 1, 1);
const DEFAULT_MATERIAL = Enum.Material.SmoothPlastic;
const DEAD_PARTICLES_CFRAME = new CFrame(0, 10000, 0);
const DEFAULT_COLOR = new Color3(1, 1, 1);
const DEFAULT_COLOR_VECTOR3 = new Vector3(1, 1, 1);

const DEFAULT_MESH_ID = 17518593957;
const DEFAULT_TEXTURE_ID = 16403621767;

interface MeshParticlePart extends Part {
    Mesh: SpecialMesh;
}

function CreateVolumetricParticle(): MeshParticlePart {
    const base = new Instance("Part");
    base.Name = "MeshParticle";
    base.Locked = true;

    base.Size = BASE_SIZE;
    base.Material = DEFAULT_MATERIAL;
    base.Color = DEFAULT_COLOR;

    base.CastShadow = false;

    base.Anchored = true;
    base.CanCollide = false;
    base.CanQuery = false;
    base.CanTouch = false;
    base.Massless = true;

    const mesh = new Instance("SpecialMesh");
    mesh.MeshId = `rbxassetid://${DEFAULT_MESH_ID}`;
    mesh.MeshType = Enum.MeshType.FileMesh;
    mesh.Scale = DEFAULT_SIZE;
    mesh.TextureId = `rbxassetid://${DEFAULT_TEXTURE_ID}`;
    mesh.VertexColor = DEFAULT_COLOR_VECTOR3;
    mesh.Parent = base;

    base.Parent = GetMeshParticlesFolder();
    return base as MeshParticlePart;
}

function UpdateParticleProperties(data: ParticleData) {
    const particle = data.particle as MeshParticlePart;

    const newScale = data.sizeNormal.add(data.sizeNormal.mul(data.sizeMultiplier));
    if (particle.Mesh.Scale !== newScale) {
        particle.Mesh.Scale = newScale;
    }

    if (particle.Transparency !== data.transparency) {
        particle.Transparency = data.transparency;
    }

    const newColor = new Vector3(data.color.R * data.emission, data.color.G * data.emission, data.color.B * data.emission);
    if (particle.Mesh.VertexColor !== newColor) {
        particle.Mesh.VertexColor = newColor;
    }
}

export class MeshParticle extends RenderNode {
    static className = "MeshParticle";

    nodeFields = {
        meshId: new NumberField(DEFAULT_MESH_ID),
        textureId: new NumberField(DEFAULT_TEXTURE_ID),
        textureSize: new Vector2Field(1024, 1024),
        spriteSheetRows: new NumberField(1),
        spriteSheetColumns: new NumberField(1),
        spriteSheetFrameCount: new NumberField(1),
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
        const particle = this.objectPool.GetItem() as MeshParticlePart;

        const meshId = `rbxassetid://${this.nodeFields.meshId.GetNumber()}`;
        if (particle.Mesh.MeshId !== meshId) {
            particle.Mesh.MeshId = meshId;
        }

        particle.CFrame = CFrameZero;

        const data = CreateParticleData(id, ParticleTypes.Cube, particle, updateNodes);

        for (const node of initializeNodes) {
            node.Run(data);
        }

        for (const node of updateNodes) {
            node.Run(data, 1);
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
        return MeshParticle.className;
    }
}
