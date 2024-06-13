import { BooleanField } from "API/Fields/BooleanField";
import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { ConnectableVector2Field } from "API/Fields/ConnectableVector2Field";
import { ConnectableVector3Field } from "API/Fields/ConnectableVector3Field";
import { NumberField } from "API/Fields/NumberField";
import { StateField } from "API/Fields/StateField";
import { CFrameZero, Rand } from "API/Lib";
import type { ParticleData } from "API/ParticleService";
import { SpawnShapeType } from "../FieldStates";
import { LogicNode } from "./LogicNode";

function GetPositionSquare(width: number, height: number, edge: number, filled: boolean) {
    if (filled) {
        const x = Rand.NextNumber(-width * 0.5, width * 0.5);
        const y = Rand.NextNumber(-height * 0.5, height * 0.5);
        return new Vector3(x, 0, y);
    }

    let adjustedHeight = height;

    const side = Rand.NextInteger(0, width + adjustedHeight + edge * 2);
    if (side > width) {
        let positionX = width * 0.5;
        if (Rand.NextInteger(0, 1) === 0) positionX *= -1;

        if (edge !== 0) {
            const edgeX = Rand.NextNumber(0, edge);

            if (positionX > 0) {
                positionX += edgeX;
            } else {
                positionX -= edgeX;
            }

            adjustedHeight += edge * 2;
        }

        const positionY = Rand.NextNumber(-adjustedHeight * 0.5, adjustedHeight * 0.5);
        return new Vector3(positionX, 0, positionY);
    }

    let positionY = adjustedHeight * 0.5;
    if (Rand.NextInteger(0, 1) === 0) positionY *= -1;

    if (edge !== 0) {
        const edgeY = Rand.NextNumber(0, edge);

        if (positionY > 0) {
            positionY += edgeY;
        } else {
            positionY -= edgeY;
        }
    }

    const positionX = Rand.NextNumber(-width * 0.5, width * 0.5);
    return new Vector3(positionX, 0, positionY);
}

function GetPositionCube(width: number, height: number, depth: number, edge: number, filled: boolean) {
    if (filled) {
        const x = Rand.NextNumber(-width * 0.5, width * 0.5);
        const y = Rand.NextNumber(-height * 0.5, height * 0.5);
        const z = Rand.NextNumber(-depth * 0.5, depth * 0.5);
        return new Vector3(x, y, z);
    }

    const side = Rand.NextNumber(0, width + height + depth + edge * 6);

    if (side < width) {
        let positionX = width * 0.5 + Rand.NextNumber(0, edge);
        if (Rand.NextInteger(0, 1)) positionX *= -1;

        const positionY = Rand.NextNumber(-height * 0.5, height * 0.5);
        const positionZ = Rand.NextNumber(-depth * 0.5, depth * 0.5);
        return new Vector3(positionX, positionY, positionZ);
    }

    if (side < width + height + edge * 2) {
        let positionY = height * 0.5 + Rand.NextNumber(0, edge);
        if (Rand.NextInteger(0, 1)) positionY *= -1;

        const adjustedWidth = width + edge * 2;
        const positionX = Rand.NextNumber(-adjustedWidth * 0.5, adjustedWidth * 0.5);
        const positionZ = Rand.NextNumber(-depth * 0.5, depth * 0.5);
        return new Vector3(positionX, positionY, positionZ);
    }

    let positionZ = depth * 0.5 + Rand.NextNumber(0, edge);
    if (Rand.NextInteger(0, 1)) positionZ *= -1;

    const adjustedWidth = width + edge * 2;
    const adjustedHeight = height + edge * 2;
    const positionX = Rand.NextNumber(-adjustedWidth * 0.5, adjustedWidth * 0.5);
    const positionY = Rand.NextNumber(-adjustedHeight * 0.5, adjustedHeight * 0.5);
    return new Vector3(positionX, positionY, positionZ);
}

function GetPositionEllipse(width: number, height: number, radius: number, spacing: number, edgeWidth: number, filled: boolean) {
    let adjustedWidth = width;
    let adjustedHeight = height;

    if (filled) {
        adjustedWidth = Rand.NextNumber(0, width);
        adjustedHeight = Rand.NextNumber(0, height);
    }

    if (!filled && edgeWidth !== 0) {
        adjustedWidth = Rand.NextNumber(width, width + edgeWidth);
        adjustedHeight = Rand.NextNumber(height, height + edgeWidth);
    }

    let theta = 0;

    const angleRangeInRadians = (radius / 360) * 2 * math.pi;

    if (spacing === -1) {
        theta = Rand.NextNumber(0, 1) * angleRangeInRadians;
    } else {
        theta = (spacing / math.deg(angleRangeInRadians)) * angleRangeInRadians;
    }

    const x = adjustedWidth * 0.5 * math.cos(theta);
    const y = adjustedHeight * 0.5 * math.sin(theta);

    return [new Vector3(x, 0, y), spacing % math.deg(angleRangeInRadians)] as [Vector3, number];
}

function GetPositionSphere(width: number, height: number, depth: number, edgeWidth: number, filled: boolean) {
    let adjustedWidth = width;
    let adjustedHeight = height;
    let adjustedDepth = depth;

    if (filled) {
        adjustedWidth = Rand.NextNumber(0, width);
        adjustedHeight = Rand.NextNumber(0, height);
        adjustedDepth = Rand.NextNumber(0, depth);
    }

    if (!filled && edgeWidth !== 0) {
        adjustedWidth = Rand.NextNumber(width, width + edgeWidth);
        adjustedHeight = Rand.NextNumber(height, height + edgeWidth);
        adjustedDepth = Rand.NextNumber(depth, depth + edgeWidth);
    }

    const theta = Rand.NextNumber(0, 1) * 2 * math.pi;
    const phi = Rand.NextNumber(0, 1) * math.pi;

    const x = adjustedWidth * 0.5 * math.cos(theta) * math.sin(phi);
    const y = adjustedHeight * 0.5 * math.sin(theta) * math.sin(phi);
    const z = adjustedDepth * 0.5 * math.cos(phi);

    return new Vector3(x, y, z);
}

export class Shape extends LogicNode {
    static className = "Shape";

    nodeFields = {
        spawnShape: new StateField(SpawnShapeType, SpawnShapeType.Square),
        sizeVec2: new ConnectableVector2Field(2, 2),
        sizeVec3: new ConnectableVector3Field(2, 2, 2),
        radius: new NumberField(360),
        spacing: new NumberField(0),
        filled: new BooleanField(false),
        edgeWidth: new NumberField(0),
        rotation: new ConnectableVector3Field(0, 0, 0),
    };

    storedOffsets: Map<number, CFrame> = new Map();
    storedAngle = 0;

    Calculate = (data: ParticleData) => {
        const rotation = this.nodeFields.rotation.GetSimpleVector3(data);
        const rotationCF = CFrame.Angles(math.rad(rotation.x), math.rad(rotation.y), math.rad(rotation.z));

        let offset = this.storedOffsets.get(data.particleId);
        if (offset !== undefined) return rotationCF.mul(offset).Position;

        const filled = this.nodeFields.filled.GetBoolean();
        const edgeWidth = this.nodeFields.edgeWidth.GetNumber();

        switch (this.nodeFields.spawnShape.GetState()) {
            case SpawnShapeType.Square: {
                const width = this.nodeFields.sizeVec2.GetX(data);
                const height = this.nodeFields.sizeVec2.GetY(data);

                offset = new CFrame(GetPositionSquare(width, height, edgeWidth, filled));
                break;
            }
            case SpawnShapeType.Cube: {
                const width = this.nodeFields.sizeVec3.GetX(data);
                const height = this.nodeFields.sizeVec3.GetY(data);
                const depth = this.nodeFields.sizeVec3.GetZ(data);

                offset = new CFrame(GetPositionCube(width, height, depth, edgeWidth, filled));
                break;
            }
            case SpawnShapeType.Ellipse: {
                const width = this.nodeFields.sizeVec2.GetX(data);
                const height = this.nodeFields.sizeVec2.GetY(data);
                const radius = this.nodeFields.radius.GetNumber();
                const spacing = this.nodeFields.spacing.GetNumber();

                if (filled || edgeWidth !== 0 || spacing === 0) {
                    offset = new CFrame(GetPositionEllipse(width, height, radius, -1, edgeWidth, filled)[0]);
                    break;
                }

                const [pos, newAngle] = GetPositionEllipse(width, height, radius, this.storedAngle + spacing, edgeWidth, filled);
                this.storedAngle = newAngle;
                offset = new CFrame(pos);

                break;
            }
            case SpawnShapeType.Sphere: {
                const width = this.nodeFields.sizeVec3.GetX(data);
                const height = this.nodeFields.sizeVec3.GetY(data);
                const depth = this.nodeFields.sizeVec3.GetZ(data);

                offset = new CFrame(GetPositionSphere(width, height, depth, edgeWidth, filled));
                break;
            }
            default:
                offset = CFrameZero;
        }

        data.isRemoving.Connect(() => {
            this.storedOffsets.delete(data.particleId);
        });

        this.storedOffsets.set(data.particleId, offset);
        return rotationCF.mul(offset).Position;
    };

    GetClassName(): string {
        return Shape.className;
    }
}
