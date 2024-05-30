import { ConnectableVector2Field } from "API/Fields/ConnectableVector2Field";
import { Rand, RoundDecimal } from "API/Lib";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { NodeGroups } from "../../NodeGroup";
import { AutoGenInitializeNode, InitializeNode } from "./InitializeNode";

export const SetRotationZRandomName = "SetRotationZRandom";
export const SetRotationZRandomFieldNames = {
    range: "range",
};

export class SetRotationZRandom extends InitializeNode {
    nodeGroup: NodeGroups = NodeGroups.Initialize;
    nodeFields = {
        range: new ConnectableVector2Field(0, 0),
    };

    Initialize(data: ParticleData) {
        const range = this.nodeFields.range.GetVector2(data);
        const zRotation = RoundDecimal(Rand.NextNumber(range.x, range.y), 0.01);

        data.rotation = new Vector3(data.rotation.X, data.rotation.Y, zRotation);
    }

    GetNodeName(): string {
        return SetRotationZRandomName;
    }

    GetAutoGenerationCode(src: Src) {
        AutoGenInitializeNode(this, src, (varName) => {
            this.nodeFields.range.AutoGenerateField(`${varName}.nodeFields.range`, src);
        });
    }
}
