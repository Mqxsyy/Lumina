import { Vector2Field } from "API/Fields/Vector2Field";
import { FrameRateMultiplier, Rand, RoundDecimal } from "API/Lib";
import { NodeGroups } from "API/NodeGroup";
import { ParticleData } from "API/ParticleService";
import { AutoGenAddRotationZRandom } from "../AutoGeneration/UpdateNodes/AutoGenAddRotationZRandom";
import { UpdateNode } from "./UpdateNode";
import { SimpleVector3 } from "API/Fields/Vector3Field";
import { AutoGenAddRotationXYZRandom } from "../AutoGeneration/UpdateNodes/AutoGenAddRotationXYZRandom";

export const AddRotationXYZRandomName = "AddRotationXYZRandom";
export const AddRotationXYZRandomFieldNames = {
    rangeX: "rangeX",
    rangeY: "rangeY",
    rangeZ: "rangeZ",
};

export class AddRotationXYZRandom extends UpdateNode {
    nodeGroup: NodeGroups = NodeGroups.Update;
    nodeFields: {
        rangeX: Vector2Field;
        rangeY: Vector2Field;
        rangeZ: Vector2Field;
    };

    storedValues = new Map<number, SimpleVector3>();

    constructor() {
        super();

        this.nodeFields = {
            rangeX: new Vector2Field(0, 0),
            rangeY: new Vector2Field(0, 0),
            rangeZ: new Vector2Field(0, 0),
        };
    }

    Update(data: ParticleData) {
        let addition = this.storedValues.get(data.particleId);
        if (addition === undefined) {
            const rangeX = this.nodeFields.rangeX.GetVector2();
            const rangeY = this.nodeFields.rangeX.GetVector2();
            const rangeZ = this.nodeFields.rangeX.GetVector2();

            const x = RoundDecimal(Rand.NextNumber(rangeX.x, rangeY.y) * FrameRateMultiplier, 0.01);
            const y = RoundDecimal(Rand.NextNumber(rangeY.x, rangeY.y) * FrameRateMultiplier, 0.01);
            const z = RoundDecimal(Rand.NextNumber(rangeZ.x, rangeZ.y) * FrameRateMultiplier, 0.01);

            addition = { x, y, z };
            this.storedValues.set(data.particleId, addition);
        }

        data.rotation = new Vector3(data.rotation.X + addition.x, data.rotation.Y + addition.y, data.rotation.Z + addition.z);
    }

    GetNodeName(): string {
        return AddRotationXYZRandomName;
    }

    GetAutoGenerationCode() {
        return AutoGenAddRotationXYZRandom(this);
    }
}
