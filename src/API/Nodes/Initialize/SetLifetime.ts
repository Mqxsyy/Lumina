import { ConnectableVector2Field } from "API/Fields/ConnectableVector2Field";
import { StateField } from "API/Fields/StateField";
import { Rand, RoundDecimal } from "API/Lib";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { ConnectableNumberField } from "../../Fields/ConnectableNumberField";
import { NodeGroups } from "../../NodeGroup";
import { CalculationType } from "../FieldStates";
import { AutoGenInitializeNode, InitializeNode } from "./InitializeNode";

export const SetLifetimeName = "SetLifetime";
export const SetLifetimeFieldNames = {
    calculationType: "calculationType",
    time: "time",
    range: "range",
};

export class SetLifetime extends InitializeNode {
    nodeGroup: NodeGroups = NodeGroups.Initialize;
    nodeFields = {
        calculationType: new StateField(CalculationType, CalculationType.Uniform, [
            CalculationType.RandomConncted,
            CalculationType.UniformConnected,
        ]),
        time: new ConnectableNumberField(1),
        range: new ConnectableVector2Field(0.5, 1),
    };

    Initialize(data: ParticleData) {
        const calculationType = this.nodeFields.calculationType.GetState();

        if (calculationType === CalculationType.Uniform) {
            data.lifetime = this.nodeFields.time.GetNumber(data);
            return;
        }

        const range = this.nodeFields.range.GetVector2(data);
        const lifetime = RoundDecimal(Rand.NextNumber(range.x, range.y), 0.01);

        data.lifetime = lifetime;
    }

    GetNodeName(): string {
        return SetLifetimeName;
    }

    GetAutoGenerationCode(src: Src) {
        AutoGenInitializeNode(this, src, (varName) => {
            this.nodeFields.calculationType.AutoGenerateField(`${varName}.nodeFields.calculationType`, src);
            this.nodeFields.time.AutoGenerateField(`${varName}.nodeFields.time`, src);

            if (this.nodeFields.calculationType.GetState() === CalculationType.Random) {
                this.nodeFields.range.AutoGenerateField(`${varName}.nodeFields.range`, src);
            }
        });
    }
}
