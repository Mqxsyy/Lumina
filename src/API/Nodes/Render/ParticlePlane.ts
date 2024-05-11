import { RunService, Workspace } from "@rbxts/services";
import { NumberField } from "API/Fields/NumberField";
import { Orientation, OrientationField } from "API/Fields/OrientationField";
import { Vector2Field } from "API/Fields/Vector2Field";
import { GetPlaneParticlesFolder } from "API/FolderLocations";
import { ObjectPool } from "API/ObjectPool";
import {
    CreateParticleData,
    GetNextParticleId,
    GetParticleData,
    ParticleData,
    ParticleTypes,
} from "API/ParticleService";
import { NodeGroups } from "../../NodeGroup";
import { AutogenParticlePlane } from "../AutoGeneration/RenderNodes/AutoGenParticlePlane";
import { InitializeNode } from "../Initialize/InitializeNode";
import { UpdateNode } from "../Update/UpdateNode";
import { RenderNode } from "./RenderNode";
import { BooleanField } from "API/Fields/BooleanField";

// TODO: make use of parallel luau
// OPTIMIZE: kinda long file
// BUG: Flipping the particle image with negative size not working properly, seems more like an engine bug than a bug with the code. on second thought was it ever possible to flip an image with negative size?

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
    doubleSided: "doubleSided",
    imageSize: "imageSize",
    spriteSheetRows: "spriteSheetRows",
    spriteSheetColumns: "spriteSheetColumns",
    spriteSheetFrameCount: "spriteSheetFrameCount",
};

interface AliveParticle {
    id: number;
    aliveTime: number;
    orientation: Orientation;
    basePart: BasePart;
    updateNodes: UpdateNode[];
}

export interface OneSidedPlaneParticle extends Part {
    Front: SurfaceGui & {
        ImageLabel: ImageLabel;
    };
}

interface Texture extends SurfaceGui {
    ImageLabel: ImageLabel;
}

export interface DoubleSidedPlaneParticle extends Part {
    Front: Texture;
    Back: Texture;
}

function CreateParticlePlaneBase(): BasePart {
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

    return particlePlane;
}

function CreateParticleTexture(): Texture {
    const surfaceGui = new Instance("SurfaceGui");
    surfaceGui.CanvasSize = CANVAS_SIZE;
    surfaceGui.LightInfluence = 0;
    surfaceGui.Brightness = DEFAULT_EMISSION;

    const imageLabel = new Instance("ImageLabel");
    imageLabel.Size = IMAGE_LABEL_SIZE;
    imageLabel.BackgroundTransparency = 1;
    imageLabel.Image = DEFAULT_TEXTURE;
    imageLabel.ImageColor3 = DEFAULT_COLOR;
    imageLabel.Parent = surfaceGui;

    return surfaceGui as Texture;
}

function CreateOneSidedParticlePlane(): OneSidedPlaneParticle {
    const particleBase = CreateParticlePlaneBase();
    const particleTexture = CreateParticleTexture();
    particleTexture.Name = "Front";
    particleTexture.Parent = particleBase;

    particleBase.Parent = GetPlaneParticlesFolder();
    particleBase.CFrame = DEAD_PARTICLES_CFRAME;

    return particleBase as OneSidedPlaneParticle;
}

function CreateDoubleSidedParticlePlane(): DoubleSidedPlaneParticle {
    const particleBase = CreateParticlePlaneBase();
    const particelFrontTexture = CreateParticleTexture();
    particelFrontTexture.Name = "Front";
    particelFrontTexture.Parent = particleBase;

    const particleBackTexture = CreateParticleTexture();
    particleBackTexture.ImageLabel.Position = UDim2.fromScale(1, 0);
    particleBackTexture.ImageLabel.Size = UDim2.fromScale(-1, 1);
    particleBackTexture.Face = Enum.NormalId.Back;
    particleBackTexture.Name = "Back";
    particleBackTexture.Parent = particleBase;

    particleBase.Parent = GetPlaneParticlesFolder();
    particleBase.CFrame = DEAD_PARTICLES_CFRAME;

    return particleBase as DoubleSidedPlaneParticle;
}

function CheckOrientation(orientation: Orientation, position: Vector3, particleId: number): CFrame {
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

function UpdateImageProperties(texture: Texture, data: ParticleData) {
    texture.ImageLabel.Rotation = data.rotation.Z;
    texture.ImageLabel.ImageTransparency = data.transparency;
    texture.ImageLabel.ImageColor3 = data.color;
    texture.Brightness = data.emission;
}

function UpdateParticleProperties(data: ParticleData) {
    const particle = data.particle;
    particle.Size = data.sizeNormal.add(data.sizeNormal.mul(data.sizeMultiplier));

    UpdateImageProperties(particle.Front, data);
    if (data.particleType === ParticleTypes.DoubleSidedPlane) {
        UpdateImageProperties((particle as DoubleSidedPlaneParticle).Back, data);
    }
}

export class ParticlePlane extends RenderNode {
    nodeGroup: NodeGroups = NodeGroups.Render;
    nodeFields = {
        orientation: new OrientationField(Orientation.FacingCamera),
        assetId: new NumberField(7848741169),
        doubleSided: new BooleanField(false),
        imageSize: new Vector2Field(1024, 1024),
        spriteSheetRows: new NumberField(1),
        spriteSheetColumns: new NumberField(1),
        spriteSheetFrameCount: new NumberField(1),
    };

    aliveParticles: AliveParticle[];
    aliveParticleBaseParts: BasePart[];

    objectPoolOneSided: ObjectPool;
    objectPoolDoubleSided: ObjectPool;
    updateLoop: RBXScriptConnection | undefined;

    constructor(pregenerateParticlesCount?: number) {
        super();

        this.aliveParticles = [];
        this.aliveParticleBaseParts = [];
        this.objectPoolOneSided = new ObjectPool(CreateOneSidedParticlePlane);
        this.objectPoolDoubleSided = new ObjectPool(CreateDoubleSidedParticlePlane);

        // BUG: studio check not working...
        if (pregenerateParticlesCount !== undefined && !RunService.IsEdit()) {
            let particlesLeft = pregenerateParticlesCount;

            task.spawn(() => {
                while (particlesLeft > 0) {
                    const batch = math.min(particlesLeft, PREGEN_BATCH_SIZE);
                    this.objectPoolOneSided.Pregenerate(batch);
                    particlesLeft -= batch;
                    task.wait();
                }
            });
        }
    }

    Render = (initializeNodes: InitializeNode[], updateNodes: UpdateNode[]) => {
        const id = GetNextParticleId();
        const doubleSided = this.nodeFields.doubleSided.GetBoolean();
        const imageId = `rbxassetid://${this.nodeFields.assetId.GetNumber()}`;

        // initialize particle
        let particlePlane: OneSidedPlaneParticle | DoubleSidedPlaneParticle;
        let data: ParticleData;

        if (!doubleSided) {
            particlePlane = this.objectPoolOneSided.GetItem() as OneSidedPlaneParticle;
            particlePlane.Front.ImageLabel.Image = imageId;
            particlePlane.CFrame = CFrameZero;

            data = CreateParticleData(ParticleTypes.OneSidedPlane, id, particlePlane);
        } else {
            particlePlane = this.objectPoolDoubleSided.GetItem() as DoubleSidedPlaneParticle;
            particlePlane.Front.ImageLabel.Image = imageId;
            (particlePlane as DoubleSidedPlaneParticle).Back.ImageLabel.Image = imageId;
            particlePlane.CFrame = CFrameZero;

            data = CreateParticleData(ParticleTypes.DoubleSidedPlane, id, particlePlane);
        }

        data.transparency = 0;
        data.sizeNormal = DEFAULT_SIZE;
        data.sizeMultiplier = Vector3.zero;
        data.color = DEFAULT_COLOR;
        data.emission = DEFAULT_EMISSION;

        initializeNodes.forEach((node) => {
            node.Initialize(id);
        });

        updateNodes.forEach((node) => {
            node.Update(id);
        });

        const orientation = this.nodeFields.orientation.GetOrientation();
        particlePlane.CFrame = CheckOrientation(orientation, particlePlane.CFrame.Position, id);

        UpdateParticleProperties(data);

        // sprite sheet
        if (this.nodeFields.spriteSheetFrameCount.GetNumber() >= 1) {
            const size = this.nodeFields.imageSize.GetVector2();

            const rows = this.nodeFields.spriteSheetRows.GetNumber();
            const columns = this.nodeFields.spriteSheetColumns.GetNumber();

            const rect = new Vector2(size.x / columns, size.y / rows);

            particlePlane.Front.ImageLabel.ImageRectSize = new Vector2(size.x / columns, size.y / rows);
            particlePlane.Front.ImageLabel.ImageRectOffset = Vector2.zero;

            if (doubleSided) {
                (particlePlane as DoubleSidedPlaneParticle).Back.ImageLabel.ImageRectSize = rect;
                (particlePlane as DoubleSidedPlaneParticle).Back.ImageLabel.ImageRectOffset = Vector2.zero;
            }
        }

        const aliveParticle: AliveParticle = {
            id: id,
            aliveTime: 0,
            orientation: orientation,
            basePart: particlePlane,
            updateNodes: updateNodes,
        };

        this.aliveParticles.push(aliveParticle);
        this.aliveParticleBaseParts.push(particlePlane);

        if (this.updateLoop !== undefined) return;

        this.updateLoop = RunService.RenderStepped.Connect((dt) => {
            const targetParticles: BasePart[] = [];
            const targetCFrames: CFrame[] = [];

            const diedParticles: BasePart[] = [];
            const diedParticlesCFrames: CFrame[] = [];

            for (let i = this.aliveParticles.size() - 1; i >= 0; i--) {
                const selectedAliveParticle = this.aliveParticles[i];
                const selectedAliveParticleData = GetParticleData(selectedAliveParticle.id);

                // lifetime check
                if (selectedAliveParticle.aliveTime >= selectedAliveParticleData.lifetime) {
                    this.aliveParticles.remove(i);
                    if (selectedAliveParticleData.particleType === ParticleTypes.OneSidedPlane) {
                        this.objectPoolOneSided.RemoveItem(selectedAliveParticle.basePart);
                    } else if (selectedAliveParticleData.particleType === ParticleTypes.DoubleSidedPlane) {
                        this.objectPoolDoubleSided.RemoveItem(selectedAliveParticle.basePart);
                    }

                    diedParticles.push(this.aliveParticleBaseParts.remove(i)!);
                    diedParticlesCFrames.push(DEAD_PARTICLES_CFRAME);

                    if (this.aliveParticles.size() === 0) {
                        this.updateLoop!.Disconnect();
                        this.updateLoop = undefined;
                    }

                    continue;
                }

                selectedAliveParticleData.aliveTimePercent =
                    selectedAliveParticle.aliveTime / selectedAliveParticleData.lifetime;

                for (const updateNode of selectedAliveParticle.updateNodes) {
                    updateNode.Update(selectedAliveParticle.id);
                }

                UpdateParticleProperties(selectedAliveParticleData);

                // sprite sheet
                if (this.nodeFields.spriteSheetFrameCount.GetNumber() >= 1) {
                    const currentFrame = math.floor(
                        this.nodeFields.spriteSheetFrameCount.GetNumber() * selectedAliveParticleData.aliveTimePercent,
                    );

                    if (selectedAliveParticleData.spriteSheetFrame !== currentFrame) {
                        selectedAliveParticleData.spriteSheetFrame = currentFrame;

                        const row = math.floor(currentFrame / this.nodeFields.spriteSheetColumns.GetNumber());
                        const column = currentFrame % this.nodeFields.spriteSheetColumns.GetNumber();

                        const size = this.nodeFields.imageSize.GetVector2();
                        const uvOffset = new Vector2(
                            column / this.nodeFields.spriteSheetColumns.GetNumber(),
                            row / this.nodeFields.spriteSheetRows.GetNumber(),
                        );

                        const rect = new Vector2(uvOffset.X * size.x, uvOffset.Y * size.y);
                        selectedAliveParticleData.particle.Front.ImageLabel.ImageRectOffset = rect;

                        if (selectedAliveParticleData.particleType === ParticleTypes.DoubleSidedPlane) {
                            (
                                selectedAliveParticleData.particle as DoubleSidedPlaneParticle
                            ).Back.ImageLabel.ImageRectOffset = rect;
                        }
                    }
                }

                let position;
                if (selectedAliveParticleData.velocity !== Vector3.zero) {
                    position = selectedAliveParticle.basePart.CFrame.Position.add(
                        selectedAliveParticleData.velocity.mul(dt),
                    );
                }

                let cframe;
                if (position !== undefined) {
                    cframe = CheckOrientation(selectedAliveParticle.orientation, position, selectedAliveParticle.id);
                } else {
                    cframe = CheckOrientation(
                        selectedAliveParticle.orientation,
                        selectedAliveParticle.basePart.Position,
                        selectedAliveParticle.id,
                    );
                }

                targetParticles.push(selectedAliveParticle.basePart);

                if (cframe !== undefined) {
                    targetCFrames.push(cframe);
                } else if (position !== undefined) {
                    targetCFrames.push(new CFrame(position));
                }

                selectedAliveParticle.aliveTime += dt;
            }

            Workspace.BulkMoveTo(targetParticles, targetCFrames, Enum.BulkMoveMode.FireCFrameChanged);
            Workspace.BulkMoveTo(diedParticles, diedParticlesCFrames, Enum.BulkMoveMode.FireCFrameChanged);
        });
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
            this.objectPoolOneSided.RemoveItem(particle.basePart);
        });

        this.objectPoolOneSided.ClearStandby();
    }
}
