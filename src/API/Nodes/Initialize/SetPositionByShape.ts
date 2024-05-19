import { BooleanField } from "API/Fields/BooleanField";
import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { ConnectableVector2Field } from "API/Fields/ConnectableVector2Field";
import { SpawnShape, SpawnShapeField } from "API/Fields/SpawnShapeField";
import { Rand } from "API/Lib";
import type { ParticleData } from "API/ParticleService";
import { NodeGroups } from "../../NodeGroup";
import { InitializeNode } from "./InitializeNode";

// IMPORTANT: add other shapes

export const SetPositionByShapeName = "SetPositionByShape";
export const SetPositionByShapeFieldNames = {
    spawnShape: "spawnShape",
    squareSize: "squareSize",
    filled: "filled",
    edgeWidth: "edgeWidth",
};

export class SetPositionByShape extends InitializeNode {
    nodeGroup: NodeGroups = NodeGroups.Initialize;
    nodeFields: {
        spawnShape: SpawnShapeField;
        squareSize: ConnectableVector2Field;
        filled: BooleanField;
        edgeWidth: ConnectableNumberField;
    };

    constructor() {
        super();

        this.nodeFields = {
            spawnShape: new SpawnShapeField(SpawnShape.Square),
            squareSize: new ConnectableVector2Field(2, 2),
            filled: new BooleanField(false),
            edgeWidth: new ConnectableNumberField(0),
        };
    }

    Initialize(data: ParticleData) {
        if (this.nodeFields.spawnShape.GetSpawnShape() === SpawnShape.Square) {
            const rangeX = this.nodeFields.squareSize.GetX(data);
            let rangeY = this.nodeFields.squareSize.GetY(data);

            const edgeWidth = this.nodeFields.edgeWidth.GetNumber(data);

            if (!this.nodeFields.filled.GetBoolean()) {
                const side = Rand.NextInteger(0, rangeX + rangeY + edgeWidth * 2);
                if (side > rangeX) {
                    let positionX = Rand.NextInteger(0, 1);

                    if (positionX === 0) {
                        positionX = -1;
                    } else {
                        positionX = 1;
                    }

                    positionX *= rangeX * 0.5;

                    if (edgeWidth !== 0) {
                        const edgeX = Rand.NextNumber(0, edgeWidth);

                        if (positionX > 0) {
                            positionX += edgeX;
                        } else {
                            positionX -= edgeX;
                        }

                        rangeY += edgeWidth * 2;
                    }

                    const positionY = Rand.NextNumber(-rangeY * 0.5, rangeY * 0.5);
                    data.particle.Position = new Vector3(positionX, 0, positionY);
                } else {
                    let positionY = Rand.NextInteger(0, 1);

                    if (positionY === 0) {
                        positionY = -1;
                    } else {
                        positionY = 1;
                    }
                    positionY *= rangeY * 0.5;

                    if (edgeWidth !== 0) {
                        const edgeY = Rand.NextNumber(0, edgeWidth);

                        if (positionY > 0) {
                            positionY += edgeY;
                        } else {
                            positionY -= edgeY;
                        }
                    }

                    const positionX = Rand.NextNumber(-rangeX * 0.5, rangeX * 0.5);
                    data.particle.Position = new Vector3(positionX, 0, positionY);
                }

                return;
            }

            const x = Rand.NextNumber(-rangeX * 0.5, rangeX * 0.5);
            const y = Rand.NextNumber(-rangeY * 0.5, rangeY * 0.5);
            data.particle.Position = new Vector3(x, 0, y);
        }
    }

    GetNodeName(): string {
        return SetPositionByShapeName;
    }

    GetAutoGenerationCode() {
        return "";
    }
}
