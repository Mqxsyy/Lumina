import { ConnectableVector2Field } from "API/Fields/ConnectableVector2Field";
import { FrameRateMultiplier, Rand, RoundDecimal } from "API/Lib";
import { NodeGroups } from "API/NodeGroup";
import { ParticleData } from "API/ParticleService";
import { AutoGenAddRotationXYZRandom } from "../AutoGeneration/UpdateNodes/AutoGenAddRotationXYZRandom";
import { UpdateNode } from "./UpdateNode";
import { SimpleVector3 } from "API/Fields/Vector3Field";

export const AddRotationXYZRandomName = "AddRotationXYZRandom";
export const AddRotationXYZRandomFieldNames = {
    rangeX: "rangeX",
    rangeY: "rangeY",
    rangeZ: "rangeZ",
};

export class AddRotationXYZRandom extends UpdateNode {
    nodeGroup: NodeGroups = NodeGroups.Update;
    nodeFields: {
        rangeX: ConnectableVector2Field;
        rangeY: ConnectableVector2Field;
        rangeZ: ConnectableVector2Field;
    };

    storedValues = new Map<number, SimpleVector3>();

    constructor() {
        super();

        this.nodeFields = {
            rangeX: new ConnectableVector2Field(0, 0),
            rangeY: new ConnectableVector2Field(0, 0),
            rangeZ: new ConnectableVector2Field(0, 0),
        };
    }

    Update(data: ParticleData) {
        let addition = this.storedValues.get(data.particleId);
        if (addition === undefined) {
            const rangeX = this.nodeFields.rangeX.GetVector2(data);
            const rangeY = this.nodeFields.rangeX.GetVector2(data);
            const rangeZ = this.nodeFields.rangeX.GetVector2(data);

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
