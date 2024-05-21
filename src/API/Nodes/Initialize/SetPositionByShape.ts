import { BooleanField } from "API/Fields/BooleanField";
import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { ConnectableVector2Field } from "API/Fields/ConnectableVector2Field";
import { ConnectableVector3Field } from "API/Fields/ConnectableVector3Field";
import { SpawnShape, SpawnShapeField } from "API/Fields/SpawnShapeField";
import { Rand } from "API/Lib";
import type { ParticleData } from "API/ParticleService";
import { NodeGroups } from "../../NodeGroup";
import { InitializeNode } from "./InitializeNode";

export const SetPositionByShapeName = "SetPositionByShape";
export const SetPositionByShapeFieldNames = {
    spawnShape: "spawnShape",
    squareSize: "squareSize",
    cubeSize: "cubeSize",
    filled: "filled",
    edgeWidth: "edgeWidth",
    rotation: "rotation",
};

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

export class SetPositionByShape extends InitializeNode {
    nodeGroup: NodeGroups = NodeGroups.Initialize;
    nodeFields: {
        spawnShape: SpawnShapeField;
        squareSize: ConnectableVector2Field;
        cubeSize: ConnectableVector3Field;
        filled: BooleanField;
        edgeWidth: ConnectableNumberField;
        rotation: ConnectableVector3Field;
    };

    constructor() {
        super();

        this.nodeFields = {
            spawnShape: new SpawnShapeField(SpawnShape.Square),
            squareSize: new ConnectableVector2Field(2, 2),
            cubeSize: new ConnectableVector3Field(2, 2, 2),
            filled: new BooleanField(false),
            edgeWidth: new ConnectableNumberField(0),
            rotation: new ConnectableVector3Field(0, 0, 0),
        };
    }

    Initialize(data: ParticleData) {
        switch (this.nodeFields.spawnShape.GetSpawnShape()) {
            case SpawnShape.Square: {
                const width = this.nodeFields.squareSize.GetX(data);
                const height = this.nodeFields.squareSize.GetY(data);
                const edgeWidth = this.nodeFields.edgeWidth.GetNumber(data);
                const filled = this.nodeFields.filled.GetBoolean();
                const position = GetPositionSquare(width, height, edgeWidth, filled);
                const rotation = this.nodeFields.rotation.GetVector3(data);

                data.particle.CFrame = CFrame.Angles(math.rad(rotation.x), math.rad(rotation.y), math.rad(rotation.z)).mul(
                    new CFrame(position),
                );

                break;
            }
            case SpawnShape.Cube: {
                const width = this.nodeFields.cubeSize.GetX(data);
                const height = this.nodeFields.cubeSize.GetY(data);
                const depth = this.nodeFields.cubeSize.GetZ(data);
                const edgeWidth = this.nodeFields.edgeWidth.GetNumber(data);
                const filled = this.nodeFields.filled.GetBoolean();
                const position = GetPositionCube(width, height, depth, edgeWidth, filled);
                const rotation = this.nodeFields.rotation.GetVector3(data);

                data.particle.CFrame = CFrame.Angles(math.rad(rotation.x), math.rad(rotation.y), math.rad(rotation.z)).mul(
                    new CFrame(position),
                );

                break;
            }
        }
    }

    GetNodeName(): string {
        return SetPositionByShapeName;
    }

    GetAutoGenerationCode() {
        return "";
    }
}
