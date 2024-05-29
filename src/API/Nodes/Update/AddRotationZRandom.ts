import { ConnectableVector2Field } from "API/Fields/ConnectableVector2Field";
import { FrameRateMultiplier, Rand, RoundDecimal } from "API/Lib";
import { NodeGroups } from "API/NodeGroup";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { AutoGenAddRotationZRandom } from "../AutoGeneration/UpdateNodes/AutoGenAddRotationZRandom";
import { UpdateNode } from "./UpdateNode";

export const AddRotationZRandomName = "AddRotationZRandom";
export const AddRotationZRandomFieldNames = {
    range: "range",
};

export class AddRotationZRandom extends UpdateNode {
    nodeGroup: NodeGroups = NodeGroups.Update;
    nodeFields: {
        range: ConnectableVector2Field;
    };

    storedValues = new Map<number, number>();

    constructor() {
        super();

        this.nodeFields = {
            range: new ConnectableVector2Field(0, 0),
        };
    }

    Update(data: ParticleData, dt: number) {
        let zAddition = this.storedValues.get(data.particleId);
        if (zAddition === undefined) {
            const range = this.nodeFields.range.GetVector2(data);
            zAddition = RoundDecimal(Rand.NextNumber(range.x, range.y) * dt, 0.01);
            this.storedValues.set(data.particleId, zAddition);
        }

        data.rotation = new Vector3(data.rotation.X, data.rotation.Y, data.rotation.Z + zAddition);
    }

    GetNodeName(): string {
        return AddRotationZRandomName;
    }

    GetAutoGenerationCode(src: Src) {
        AutoGenAddRotationZRandom(this, src);
    }
}
