import { ConnectableVector2Field } from "API/Fields/ConnectableVector2Field";
import { Rand, RoundDecimal } from "API/Lib";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { NodeGroups } from "../../NodeGroup";
import { AutoGenInitializeNode, InitializeNode } from "./InitializeNode";

export const SetLifetimeRandomName = "SetLifetimeRandom";
export const SetLifetimeRandomFieldNames = {
    range: "range",
};

export class SetLifetimeRandom extends InitializeNode {
    nodeGroup: NodeGroups = NodeGroups.Initialize;
    nodeFields = {
        range: new ConnectableVector2Field(0.5, 1),
    };

    Initialize(data: ParticleData) {
        const range = this.nodeFields.range.GetVector2(data);
        const lifetime = RoundDecimal(Rand.NextNumber(range.x, range.y), 0.01);

        data.lifetime = lifetime;
    }

    GetNodeName(): string {
        return SetLifetimeRandomName;
    }

    GetAutoGenerationCode(src: Src) {
        AutoGenInitializeNode(this, src, (varName) => {
            this.nodeFields.range.AutoGenerateField(`${varName}.nodeFields.range`, src);
        });
    }
}
