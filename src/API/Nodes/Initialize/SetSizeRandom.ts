import { Vector2Field } from "API/Fields/Vector2Field";
import { Rand, RoundDecimal } from "API/Lib";
import { UpdateParticleData } from "API/ParticleService";
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
        range: Vector2Field;
    };

    constructor() {
        super();

        this.nodeFields = {
            range: new Vector2Field(0, 0),
        };
    }

    Initialize(id: number) {
        UpdateParticleData(id, (data) => {
            const range = this.nodeFields.range.GetVector2();
            const size = RoundDecimal(Rand.NextNumber(range.x, range.y), 0.01);
            const sizeVector3 = new Vector3(size, size, 0.001);

            data.sizeNormal = sizeVector3;
            return data;
        });
    }

    GetNodeName(): string {
        return SetSizeRandomName;
    }

    GetAutoGenerationCode() {
        return AutoGenSetSizeRandom(this);
    }
}
