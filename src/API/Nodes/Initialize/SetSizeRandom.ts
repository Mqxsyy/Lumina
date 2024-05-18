import { ConnectableVector2Field } from "API/Fields/ConnectableVector2Field";
import { Rand, RoundDecimal } from "API/Lib";
import { ParticleData } from "API/ParticleService";
import { NodeGroups } from "../../NodeGroup";
import { AutoGenSetSizeRandom } from "../AutoGeneration/InitializeNodes/AutoGenSetSizeRandom";
import { InitializeNode } from "./InitializeNode";

export const SetSizeRandomName = "SetSizeRandom";
export const SetSizeRandomFieldNames = {
    range: "range",
};

export class SetSizeRandom extends InitializeNode {
    nodeGroup: NodeGroups = NodeGroups.Initialize;
    nodeFields: {
        range: ConnectableVector2Field;
    };

    constructor() {
        super();

        this.nodeFields = {
            range: new ConnectableVector2Field(0, 0),
        };
    }

    Initialize(data: ParticleData) {
        const range = this.nodeFields.range.GetVector2(data);
        const size = RoundDecimal(Rand.NextNumber(range.x, range.y), 0.01);
        data.sizeNormal = new Vector3(size, size, size);
    }

    GetNodeName(): string {
        return SetSizeRandomName;
    }

    GetAutoGenerationCode() {
        return AutoGenSetSizeRandom(this);
    }
}
