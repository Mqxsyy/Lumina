import { RunService, Workspace } from "@rbxts/services";
import { NumberField } from "API/Fields/NumberField";
import { Orientation, OrientationField } from "API/Fields/OrientationField";
import { Vector2Field } from "API/Fields/Vector2Field";
import { GetPlaneParticlesFolder } from "API/FolderLocations";
import { ObjectPool } from "API/ObjectPool";
import { CreateParticleData, GetNextParticleId, GetParticleData } from "API/ParticleService";
import { NodeGroups } from "../../NodeGroup";
import { AutogenParticlePlane } from "../AutoGeneration/RenderNodes/AutoGenParticlePlane";
import { InitializeNode } from "../Initialize/InitializeNode";
import { UpdateNode } from "../Update/UpdateNode";
import { RenderNode } from "./RenderNode";

// IMPORTANT: make double sided, required reversed image if not symmetrical

// TODO: make use of parallel luau

const DEFAULT_SIZE = new Vector3(1, 1, 0.001);
const DEFAULT_TEXTURE = "rbxassetid://7848741169";
const DEFAULT_COLOR = new Color3(1, 1, 1);
const DEFAULT_EMISSION = 1;
const DEAD_PARTICLES_CFRAME = new CFrame(0, 10000, 0);
const PREGEN_BATCH_SIZE = 50;

const CANVAS_SIZE = new Vector2(1000, 1000);
const IMAGE_LABEL_SIZE = new UDim2(1, 0, 1, 0);

const CFrameZero = new CFrame();

export const ParticlePlaneName = "ParticlePlane";
export const ParticlePlaneFieldNames = {
    orientation: "orientation",
    assetId: "assetId",
    imageSize: "imageSize",
    spriteSheetRows: "spriteSheetRows",
    spriteSheetColumns: "spriteSheetColumns",
    spriteSheetFrameCount: "spriteSheetFrameCount",
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
    particlePlane.Locked = true;

    particlePlane.Size = DEFAULT_SIZE;
    particlePlane.Transparency = 1;

    particlePlane.CastShadow = false;

    particlePlane.Anchored = true;
    particlePlane.CanCollide = false;
    particlePlane.CanQuery = false;
    particlePlane.CanTouch = false;
    particlePlane.Massless = true;
    particlePlane.Material = Enum.Material.SmoothPlastic;

    const surfaceGui = new Instance("SurfaceGui");
    surfaceGui.Parent = particlePlane;
    surfaceGui.CanvasSize = CANVAS_SIZE;
    surfaceGui.LightInfluence = 0;
    surfaceGui.Brightness = DEFAULT_EMISSION;

    const imageLabel = new Instance("ImageLabel");
    imageLabel.Size = IMAGE_LABEL_SIZE;
    imageLabel.BackgroundTransparency = 1;
    imageLabel.Image = DEFAULT_TEXTURE;
    imageLabel.ImageColor3 = DEFAULT_COLOR;
    imageLabel.Parent = surfaceGui;

    particlePlane.Parent = GetPlaneParticlesFolder();
    particlePlane.CFrame = DEAD_PARTICLES_CFRAME;

    return particlePlane as PlaneParticle;
}

export class ParticlePlane extends RenderNode {
    nodeGroup: NodeGroups = NodeGroups.Render;
    nodeFields = {
        orientation: new OrientationField(Orientation.FacingCamera),
        assetId: new NumberField(7848741169),
        imageSize: new Vector2Field(1024, 1024),
        spriteSheetRows: new NumberField(1),
        spriteSheetColumns: new NumberField(1),
        spriteSheetFrameCount: new NumberField(1),
    };

    aliveParticles: AliveParticle[];
    aliveParticleBaseParts: BasePart[];

    objectPool: ObjectPool;
    updateLoop: RBXScriptConnection | undefined;

    constructor(pregenerateParticlesCount?: number) {
        super();

        this.aliveParticles = [];
        this.aliveParticleBaseParts = [];
        this.objectPool = new ObjectPool(CreateParticlePlane);

        // BUG: studio check not working...
        if (pregenerateParticlesCount !== undefined && !RunService.IsEdit()) {
            let particlesLeft = pregenerateParticlesCount;

            task.spawn(() => {
                while (particlesLeft > 0) {
                    const batch = math.min(particlesLeft, PREGEN_BATCH_SIZE);
                    this.objectPool.Pregenerate(batch);
                    particlesLeft -= batch;
                    task.wait();
                }
            });
        }
    }

    CheckOrientation(orientation: Orientation, position: Vector3, particleId: number): CFrame {
        switch (orientation) {
            case Orientation.FacingCamera: {
                return CFrame.lookAt(position, game.Workspace.CurrentCamera!.CFrame.Position);
            }
            case Orientation.VelocityParallel: {
                const data = GetParticleData(particleId)!;

                const velocity = data.velocity.Unit;
                if (velocity === Vector3.zero) return new CFrame(position);

                // math :O
                // kinda maybe understand it, took around 3 hours to get working
                const cameraPosition = game.Workspace.CurrentCamera!.CFrame.Position;
                const cameraToPosition = cameraPosition.sub(position);
                const cameraDirection = cameraToPosition.sub(
                    velocity.mul(cameraToPosition.Dot(velocity) / velocity.Dot(velocity)),
                ).Unit;

                const velocityAligned = CFrame.lookAt(position, position.add(velocity)).mul(
                    CFrame.Angles(0, math.rad(90), 0),
                );
                const newLookVector = velocityAligned.LookVector;

                const dot = cameraDirection.Dot(newLookVector);
                let angle = math.acos(dot / (cameraDirection.Magnitude * newLookVector.Magnitude));

                if (cameraDirection.Cross(newLookVector).Dot(velocity) > 0) {
                    angle = -angle;
                }

                return velocityAligned.mul(CFrame.Angles(angle, 0, 0));
            }
            case Orientation.VelocityPerpendicular: {
                const velocity = GetParticleData(particleId).velocity;
                const nextPosition = position.add(velocity);
                return CFrame.lookAt(position, nextPosition);
            }
        }
    }

    Render = (initializeNodes: InitializeNode[], updateNodes: UpdateNode[]) => {
        const particle = this.objectPool.GetItem() as PlaneParticle;
        particle.SurfaceGui.ImageLabel.ImageTransparency = 0;
        particle.SurfaceGui.ImageLabel.Image = `rbxassetid://${this.nodeFields.assetId.GetNumber()}`;
        particle.CFrame = CFrameZero;

        const id = GetNextParticleId();
        CreateParticleData(id, particle);

        initializeNodes.forEach((node) => {
            node.Initialize(id);
        });

        updateNodes.forEach((node) => {
            node.Update(id);
        });

        const orientation = this.nodeFields.orientation.GetOrientation();
        const rotation = this.CheckOrientation(orientation, particle.CFrame.Position, id);
        particle.CFrame = new CFrame(particle.Position).mul(rotation);

        if (this.nodeFields.spriteSheetFrameCount.GetNumber() >= 1) {
            const size = this.nodeFields.imageSize.GetVector2();

            const rows = this.nodeFields.spriteSheetRows.GetNumber();
            const columns = this.nodeFields.spriteSheetColumns.GetNumber();

            particle.SurfaceGui.ImageLabel.ImageRectSize = new Vector2(size.x / columns, size.y / rows);
            particle.SurfaceGui.ImageLabel.ImageRectOffset = Vector2.zero;
        }

        const aliveParticle: AliveParticle = {
            id: id,
            aliveTime: 0,
            orientation: orientation,
            basePart: particle,
            updateNodes: updateNodes,
        };

        this.aliveParticles.push(aliveParticle);
        this.aliveParticleBaseParts.push(particle);

        if (this.updateLoop === undefined) {
            this.updateLoop = RunService.RenderStepped.Connect((dt) => {
                const targetParticles: BasePart[] = [];
                const targetCFrames: CFrame[] = [];

                const diedParticles: BasePart[] = [];
                const diedParticlesCFrames: CFrame[] = [];

                for (let i = this.aliveParticles.size() - 1; i >= 0; i--) {
                    const particle = this.aliveParticles[i];
                    const particleData = GetParticleData(particle.id);

                    if (particle.aliveTime >= particleData.lifetime) {
                        this.aliveParticles.remove(i);
                        this.objectPool.RemoveItem(particle.basePart);

                        diedParticles.push(this.aliveParticleBaseParts.remove(i)!);
                        diedParticlesCFrames.push(DEAD_PARTICLES_CFRAME);

                        if (this.aliveParticles.size() === 0) {
                            this.updateLoop!.Disconnect();
                            this.updateLoop = undefined;
                        }
                    } else {
                        particleData.aliveTimePercent = particle.aliveTime / particleData.lifetime;

                        for (const updateNode of particle.updateNodes) {
                            updateNode.Update(particle.id);
                        }

                        if (this.nodeFields.spriteSheetFrameCount.GetNumber() >= 1) {
                            const currentFrame = math.floor(
                                this.nodeFields.spriteSheetFrameCount.GetNumber() * particleData.aliveTimePercent,
                            );

                            if (particleData.spriteSheetFrame !== currentFrame) {
                                particleData.spriteSheetFrame = currentFrame;

                                const row = math.floor(currentFrame / this.nodeFields.spriteSheetColumns.GetNumber());
                                const column = currentFrame % this.nodeFields.spriteSheetColumns.GetNumber();

                                const size = this.nodeFields.imageSize.GetVector2();
                                const uvOffset = new Vector2(
                                    column / this.nodeFields.spriteSheetColumns.GetNumber(),
                                    row / this.nodeFields.spriteSheetRows.GetNumber(),
                                );

                                particleData.particle.SurfaceGui.ImageLabel.ImageRectOffset = new Vector2(
                                    uvOffset.X * size.x,
                                    uvOffset.Y * size.y,
                                );
                            }
                        }

                        let position;
                        if (particleData.velocity !== Vector3.zero) {
                            position = particle.basePart.CFrame.Position.add(particleData.velocity.mul(dt));
                        }

                        let cframe;
                        if (position !== undefined) {
                            cframe = this.CheckOrientation(particle.orientation, position, particle.id);
                        } else {
                            cframe = this.CheckOrientation(
                                particle.orientation,
                                particle.basePart.Position,
                                particle.id,
                            );
                        }

                        targetParticles.push(particle.basePart);

                        if (cframe !== undefined) {
                            targetCFrames.push(cframe);
                        } else if (position !== undefined) {
                            targetCFrames.push(new CFrame(position));
                        }

                        particle.aliveTime += dt;
                    }
                }

                Workspace.BulkMoveTo(targetParticles, targetCFrames, Enum.BulkMoveMode.FireCFrameChanged);
                Workspace.BulkMoveTo(diedParticles, diedParticlesCFrames, Enum.BulkMoveMode.FireCFrameChanged);
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
