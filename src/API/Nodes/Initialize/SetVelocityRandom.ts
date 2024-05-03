import { Vector2Field } from "API/Fields/Vector2Field";
import { Rand, RoundDecimal } from "API/Lib";
import { UpdateParticleData } from "API/ParticleService";
import { NodeGroups } from "../../NodeGroup";
import { AutoGenSetVelocityRandom } from "../AutoGeneration/InitializeNodes/AutoGenSetVelocityRandom";
import { InitializeNode } from "./InitializeNode";

export const SetVelocityRandomName = "SetVelocityRandom";
export const SetVelocityRandomFieldNames = {
    rangeX: "rangeX",
    rangeY: "rangeY",
    rangeZ: "rangeZ",
};

export class SetVelocityRandom extends InitializeNode {
    nodeGroup: NodeGroups = NodeGroups.Initialize;
    nodeFields: {
        rangeX: Vector2Field;
        rangeY: Vector2Field;
        rangeZ: Vector2Field;
    };

    constructor() {
        super();

        this.nodeFields = {
            rangeX: new Vector2Field(0, 0),
            rangeY: new Vector2Field(0, 0),
            rangeZ: new Vector2Field(0, 0),
        };
    }

    Initialize(id: number) {
        const xRange = this.nodeFields.rangeX.GetVector2();
        const x = RoundDecimal(Rand.NextNumber(xRange.x, xRange.y), 0.01);

        const yRange = this.nodeFields.rangeY.GetVector2();
        const y = RoundDecimal(Rand.NextNumber(yRange.x, yRange.y), 0.01);

        const zRange = this.nodeFields.rangeZ.GetVector2();
        const z = RoundDecimal(Rand.NextNumber(zRange.x, zRange.y), 0.01);

        UpdateParticleData(id, (data) => {
            data.velocity = new Vector3(x, y, z);
            return data;
        });
    }

    GetNodeName(): string {
        return SetVelocityRandomName;
    }

    GetAutoGenerationCode() {
        return AutoGenSetVelocityRandom(this);
    }
}
