import { Vector3Field } from "API/Fields/Vector3Field";
import { GetParticleData } from "API/ParticleService";
import { NodeGroups } from "../../NodeGroup";
import { AutoGenSetPosition } from "../AutoGeneration/InitializeNodes/AutoGenSetPosition";
import { InitializeNode } from "./InitializeNode";

export const SetPositionName = "SetPosition";
export const SetPositionFieldNames = {
    position: "position",
};

export class SetPosition extends InitializeNode {
    nodeGroup: NodeGroups = NodeGroups.Initialize;
    nodeFields: {
        position: Vector3Field;
    };

    constructor() {
        super();

        this.nodeFields = {
            position: new Vector3Field(0, 0, 0),
        };
    }

    Initialize(id: number) {
        const vector3 = this.nodeFields.position.GetVector3();
        GetParticleData(id).particle.Position = new Vector3(vector3.x, vector3.y, vector3.z);
    }

    GetNodeName(): string {
        return SetPositionName;
    }

    GetAutoGenerationCode() {
        return AutoGenSetPosition(this);
    }
}
