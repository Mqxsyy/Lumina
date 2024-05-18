import { ConnectableVector3Field } from "API/Fields/ConnectableVector3Field";
import { ParticleData } from "API/ParticleService";
import { NodeGroups } from "../../NodeGroup";
import { AutoGenAddPosition } from "../AutoGeneration/InitializeNodes/AutoGenAddPosition";
import { InitializeNode } from "./InitializeNode";

// IMPORTANT: Sometimes gets overriden by set position

export const AddPositionName = "AddPosition";
export const AddPositionFieldNames = {
    position: "position",
};

export class AddPosition extends InitializeNode {
    nodeGroup: NodeGroups = NodeGroups.Initialize;
    nodeFields: {
        position: ConnectableVector3Field;
    };

    constructor() {
        super();

        this.nodeFields = {
            position: new ConnectableVector3Field(0, 0, 0),
        };
    }

    Initialize(data: ParticleData) {
        const vector3 = this.nodeFields.position.GetVector3(data);
        data.particle.Position = data.particle.Position.add(new Vector3(vector3.x, vector3.y, vector3.z));
    }

    GetNodeName(): string {
        return AddPositionName;
    }

    GetAutoGenerationCode() {
        return AutoGenAddPosition(this);
    }
}
