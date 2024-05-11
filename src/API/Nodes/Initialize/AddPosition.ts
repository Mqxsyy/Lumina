import { Vector3Field } from "API/Fields/Vector3Field";
import { UpdateParticleData } from "API/ParticleService";
import { NodeGroups } from "../../NodeGroup";
import { AutoGenAddPosition } from "../AutoGeneration/InitializeNodes/AutoGenAddPosition";
import { InitializeNode } from "./InitializeNode";

export const AddPositionName = "AddPosition";
export const AddPositionFieldNames = {
    position: "position",
};

export class AddPosition extends InitializeNode {
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
        UpdateParticleData(id, (data) => {
            data.particle.Position = data.particle.Position.add(new Vector3(vector3.x, vector3.y, vector3.z));
            return data;
        });
    }

    GetNodeName(): string {
        return AddPositionName;
    }

    GetAutoGenerationCode() {
        return AutoGenAddPosition(this);
    }
}
