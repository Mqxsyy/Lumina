import { ConnectableVector2Field } from "API/Fields/ConnectableVector2Field";
import { Rand, RoundDecimal } from "API/Lib";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { NodeGroups } from "../../NodeGroup";
import { AutoGenInitializeNode, InitializeNode } from "./InitializeNode";

export const SetVelocityRandomName = "SetVelocityRandom";
export const SetVelocityRandomFieldNames = {
    rangeX: "rangeX",
    rangeY: "rangeY",
    rangeZ: "rangeZ",
};

export class SetVelocityRandom extends InitializeNode {
    nodeGroup: NodeGroups = NodeGroups.Initialize;
    nodeFields = {
        rangeX: new ConnectableVector2Field(0, 0),
        rangeY: new ConnectableVector2Field(0, 0),
        rangeZ: new ConnectableVector2Field(0, 0),
    };

    Initialize(data: ParticleData) {
        const xRange = this.nodeFields.rangeX.GetVector2(data);
        const x = RoundDecimal(Rand.NextNumber(xRange.x, xRange.y), 0.01);

        const yRange = this.nodeFields.rangeY.GetVector2(data);
        const y = RoundDecimal(Rand.NextNumber(yRange.x, yRange.y), 0.01);

        const zRange = this.nodeFields.rangeZ.GetVector2(data);
        const z = RoundDecimal(Rand.NextNumber(zRange.x, zRange.y), 0.01);

        data.velocityNormal = new Vector3(x, y, z);
    }

    GetNodeName(): string {
        return SetVelocityRandomName;
    }

    GetAutoGenerationCode(src: Src) {
        AutoGenInitializeNode(this, src, (varName) => {
            this.nodeFields.rangeX.AutoGenerateField(`${varName}.nodeFields.rangeX`, src);
            this.nodeFields.rangeY.AutoGenerateField(`${varName}.nodeFields.rangeY`, src);
            this.nodeFields.rangeZ.AutoGenerateField(`${varName}.nodeFields.rangeZ`, src);
        });
    }
}
