import { RunService, Workspace } from "@rbxts/services";
import { BooleanField } from "API/Fields/BooleanField";
import { NumberField } from "API/Fields/NumberField";
import { StateField } from "API/Fields/StateField";
import { Vector2Field } from "API/Fields/Vector2Field";
import { GetPlaneParticlesFolder } from "API/FolderLocations";
import { CFrameZero } from "API/Lib";
import { ObjectPool } from "API/ObjectPool";
import { CreateParticleData, GetNextParticleId, type ParticleData, ParticleTypes } from "API/ParticleService";
import { OrientationType } from "../FieldStates";
import type { InitializeNode } from "../Initialize/InitializeNode";
import type { UpdateNode } from "../Update/UpdateNode";
import { RenderNode } from "./RenderNode";

const DEFAULT_SIZE = new Vector3(1, 1, 0.001);

const DEFAULT_TEXTURE = "rbxassetid://7848741169";
const DEFAULT_COLOR = new Color3(1, 1, 1);
const DEFAULT_EMISSION = 1;

const DEAD_PARTICLES_CFRAME = new CFrame(0, 10000, 0);

const CANVAS_SIZE = new Vector2(1000, 1000);
const IMAGE_LABEL_SIZE = new UDim2(1, 0, 1, 0);

interface Texture extends SurfaceGui {
    ImageLabel: ImageLabel;
}

export interface OneSidedPlaneParticle extends BasePart {
    Front: Texture;
}
export interface DoubleSidedPlaneParticle extends BasePart {
    Front: Texture;
    Back: Texture;
}

function CreateParticleBase(): BasePart {
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

function CreateOneSidedParticle(): OneSidedPlaneParticle {
    const particleBase = CreateParticleBase();
    const particleTexture = CreateParticleTexture();
    particleTexture.Name = "Front";
    particleTexture.Parent = particleBase;

    particleBase.Parent = GetPlaneParticlesFolder();
    particleBase.CFrame = DEAD_PARTICLES_CFRAME;

    return particleBase as OneSidedPlaneParticle;
}

function CreateDoubleSidedParticle(): DoubleSidedPlaneParticle {
    const particleBase = CreateParticleBase();
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

function CheckOrientation(orientation: string, position: Vector3, data: ParticleData): CFrame {
    switch (orientation) {
        case OrientationType.FacingCamera: {
            return CFrame.lookAt(position, (game.Workspace.CurrentCamera as Camera).CFrame.Position).mul(
                CFrame.Angles(0, 0, math.rad(data.rotation.Z)),
            );
        }
        case OrientationType.VelocityParallel: {
            const velocity = data.velocityNormal.Unit;
            if (velocity === Vector3.zero) return new CFrame(position);

            // math :O
            // kinda maybe understand it, took around 3 hours to get working
            const cameraPosition = (game.Workspace.CurrentCamera as Camera).CFrame.Position;
            const cameraToPosition = cameraPosition.sub(position);
            const cameraDirection = cameraToPosition.sub(velocity.mul(cameraToPosition.Dot(velocity) / velocity.Dot(velocity))).Unit;

            const velocityAligned = CFrame.lookAt(position, position.add(velocity)).mul(CFrame.Angles(0, math.rad(90), 0));
            const newLookVector = velocityAligned.LookVector;

            const dot = cameraDirection.Dot(newLookVector);
            let angle = math.acos(dot / (cameraDirection.Magnitude * newLookVector.Magnitude));

            if (cameraDirection.Cross(newLookVector).Dot(velocity) > 0) {
                angle = -angle;
            }

            return velocityAligned.mul(CFrame.Angles(angle, 0, 0)).mul(CFrame.Angles(0, 0, math.rad(data.rotation.Z)));
        }
        case OrientationType.VelocityPerpendicular: {
            const nextPosition = position.add(data.velocityNormal);
            return CFrame.lookAt(position, nextPosition).mul(CFrame.Angles(0, 0, math.rad(data.rotation.Z)));
        }
    }

    warn(`Orientation check failed, returning CFrameZero. (${orientation})`);
    return CFrameZero;
}

function UpdateImageProperties(texture: Texture, data: ParticleData) {
    // texture.ImageLabel.Rotation = data.rotation.Z;
    texture.ImageLabel.ImageTransparency = data.transparency;
    texture.ImageLabel.ImageColor3 = data.color;
    texture.Brightness = data.emission;
}

function UpdateParticleProperties(data: ParticleData) {
    const particle = data.particle as OneSidedPlaneParticle | DoubleSidedPlaneParticle;

    const size = data.sizeNormal.add(data.sizeNormal.mul(data.sizeMultiplier));
    particle.Size = new Vector3(size.X, size.Y, 0.001);

    UpdateImageProperties(particle.Front, data);
    if (data.particleType === ParticleTypes.DoubleSidedPlane) {
        UpdateImageProperties((particle as DoubleSidedPlaneParticle).Back, data);
    }
}

export class PlaneParticle extends RenderNode {
    static className = "PlaneParticle";

    nodeFields = {
        orientation: new StateField(OrientationType, OrientationType.FacingCamera),
        assetId: new NumberField(7848741169),
        doubleSided: new BooleanField(false),
        imageSize: new Vector2Field(1024, 1024),
        spriteSheetRows: new NumberField(1),
        spriteSheetColumns: new NumberField(1),
        spriteSheetFrameCount: new NumberField(1),
    };

    aliveParticles: ParticleData[];

    objectPoolOneSided: ObjectPool;
    objectPoolDoubleSided: ObjectPool;
    updateLoop: RBXScriptConnection | undefined;

    constructor() {
        super();

        this.aliveParticles = [];
        this.objectPoolOneSided = new ObjectPool(CreateOneSidedParticle);
        this.objectPoolDoubleSided = new ObjectPool(CreateDoubleSidedParticle);
    }

    Render = (initializeNodes: InitializeNode[], updateNodes: UpdateNode[]) => {
        const id = GetNextParticleId();

        let particle: OneSidedPlaneParticle | DoubleSidedPlaneParticle;
        let data: ParticleData;

        const doubleSided = this.nodeFields.doubleSided.GetBoolean();
        const imageId = `rbxassetid://${this.nodeFields.assetId.GetNumber()}`;

        const orderedInitializeNodes = initializeNodes.sort((a, b) => {
            if (a.updatePriority !== b.updatePriority) {
                return a.updatePriority < b.updatePriority;
            }

            return a.updateOrder < b.updateOrder;
        });

        const orderedUpdateNodes = updateNodes
            .sort((a, b) => a.updateOrder < b.updateOrder)
            .sort((a, b) => a.updatePriority < b.updatePriority);

        if (!doubleSided) {
            particle = this.objectPoolOneSided.GetItem() as OneSidedPlaneParticle;
            particle.Front.ImageLabel.Image = imageId;
            particle.CFrame = CFrameZero;

            data = CreateParticleData(id, ParticleTypes.OneSidedPlane, particle, orderedUpdateNodes);
        } else {
            particle = this.objectPoolDoubleSided.GetItem() as DoubleSidedPlaneParticle;
            particle.Front.ImageLabel.Image = imageId;
            (particle as DoubleSidedPlaneParticle).Back.ImageLabel.Image = imageId;
            particle.CFrame = CFrameZero;

            data = CreateParticleData(id, ParticleTypes.DoubleSidedPlane, particle, orderedUpdateNodes);
        }

        for (let i = 0; i < orderedInitializeNodes.size(); i++) {
            orderedInitializeNodes[i].Run(data);
        }

        for (let i = 0; i < orderedUpdateNodes.size(); i++) {
            orderedUpdateNodes[i].Run(data, 0.0167); // ideal 60 fps dt
        }

        const orientation = this.nodeFields.orientation.GetState();

        particle.CFrame = CheckOrientation(orientation, particle.CFrame.Position, data);

        UpdateParticleProperties(data);

        // sprite sheet
        if (this.nodeFields.spriteSheetFrameCount.GetNumber() >= 1) {
            const size = this.nodeFields.imageSize.GetVector2();

            const rows = this.nodeFields.spriteSheetRows.GetNumber();
            const columns = this.nodeFields.spriteSheetColumns.GetNumber();

            const rect = new Vector2(size.x / columns, size.y / rows);

            particle.Front.ImageLabel.ImageRectSize = new Vector2(size.x / columns, size.y / rows);
            particle.Front.ImageLabel.ImageRectOffset = Vector2.zero;

            if (doubleSided) {
                (particle as DoubleSidedPlaneParticle).Back.ImageLabel.ImageRectSize = rect;
                (particle as DoubleSidedPlaneParticle).Back.ImageLabel.ImageRectOffset = Vector2.zero;
            }
        }

        this.aliveParticles.push(data);

        if (this.updateLoop !== undefined) return;

        this.updateLoop = RunService.RenderStepped.Connect((dt) => {
            const movedParticles: BasePart[] = [];
            const movedParticlesCFrames: CFrame[] = [];

            for (let i = this.aliveParticles.size() - 1; i >= 0; i--) {
                const aliveParticleData = this.aliveParticles[i];

                if (aliveParticleData.alivetime + dt >= aliveParticleData.lifetime) {
                    this.aliveParticles.remove(i);

                    if (aliveParticleData.particleType === ParticleTypes.OneSidedPlane) {
                        this.objectPoolOneSided.RemoveItem(aliveParticleData.particle);
                    } else if (aliveParticleData.particleType === ParticleTypes.DoubleSidedPlane) {
                        this.objectPoolDoubleSided.RemoveItem(aliveParticleData.particle);
                    }

                    movedParticles.push(aliveParticleData.particle);
                    movedParticlesCFrames.push(DEAD_PARTICLES_CFRAME);

                    for (const updateNode of aliveParticleData.updateNodes) {
                        updateNode.ClearCache(aliveParticleData.particleId);
                    }

                    if (this.aliveParticles.size() === 0) {
                        if (this.updateLoop === undefined) continue;

                        this.updateLoop.Disconnect();
                        this.updateLoop = undefined;
                    }

                    continue;
                }

                for (let i = 0; i < aliveParticleData.updateNodes.size(); i++) {
                    aliveParticleData.updateNodes[i].Run(aliveParticleData, dt);
                }

                UpdateParticleProperties(aliveParticleData);

                // sprite sheet
                if (this.nodeFields.spriteSheetFrameCount.GetNumber() >= 1) {
                    const alivetimePercent = aliveParticleData.alivetime / aliveParticleData.lifetime;

                    const currentFrame = math.floor(this.nodeFields.spriteSheetFrameCount.GetNumber() * alivetimePercent);

                    if (aliveParticleData.spriteSheetFrame !== currentFrame) {
                        aliveParticleData.spriteSheetFrame = currentFrame;

                        const row = math.floor(currentFrame / this.nodeFields.spriteSheetColumns.GetNumber());
                        const column = currentFrame % this.nodeFields.spriteSheetColumns.GetNumber();

                        const size = this.nodeFields.imageSize.GetVector2();
                        const uvOffset = new Vector2(
                            column / this.nodeFields.spriteSheetColumns.GetNumber(),
                            row / this.nodeFields.spriteSheetRows.GetNumber(),
                        );

                        const rect = new Vector2(uvOffset.X * size.x, uvOffset.Y * size.y);
                        const localParticle = aliveParticleData.particle as OneSidedPlaneParticle | DoubleSidedPlaneParticle;
                        localParticle.Front.ImageLabel.ImageRectOffset = rect;

                        if (aliveParticleData.particleType === ParticleTypes.DoubleSidedPlane) {
                            (aliveParticleData.particle as DoubleSidedPlaneParticle).Back.ImageLabel.ImageRectOffset = rect;
                        }
                    }
                }

                let cframe = aliveParticleData.particle.CFrame;
                if (aliveParticleData.nextPos === undefined) {
                    if (aliveParticleData.velocityNormal !== Vector3.zero) {
                        const velocity = aliveParticleData.velocityNormal.mul(aliveParticleData.velocityMultiplier).mul(dt);
                        cframe = new CFrame(aliveParticleData.particle.Position.add(velocity));
                    }
                } else {
                    cframe = new CFrame(aliveParticleData.nextPos);
                    aliveParticleData.nextPos = undefined;
                }

                cframe = CheckOrientation(orientation, cframe.Position, aliveParticleData);

                if (aliveParticleData.particle.CFrame !== cframe) {
                    movedParticles.push(aliveParticleData.particle);
                    movedParticlesCFrames.push(cframe);
                }

                aliveParticleData.alivetime += dt;
            }

            Workspace.BulkMoveTo(movedParticles, movedParticlesCFrames, Enum.BulkMoveMode.FireCFrameChanged);
        });
    };

    GetClassName(): string {
        return PlaneParticle.className;
    }

    Destroy() {
        if (this.updateLoop !== undefined) {
            this.updateLoop.Disconnect();
        }

        for (const data of this.aliveParticles) {
            this.objectPoolOneSided.RemoveItem(data.particle);
        }

        this.objectPoolOneSided.ClearStandby();
    }
}
