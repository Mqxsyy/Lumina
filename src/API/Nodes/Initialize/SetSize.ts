import { NumberField } from "API/Fields/NumberField";
import { UpdateParticleData } from "API/ParticleService";
import { NodeGroups } from "../../NodeGroup";
import { AutoGenSetSize } from "../AutoGeneration/InitializeNodes/AutoGenSetSize";
import { InitializeNode } from "./InitializeNode";

export const SetSizeName = "SetSize";
export const SetSizeFieldNames = {
    size: "size",
};

export class SetSize extends InitializeNode {
    nodeGroup: NodeGroups = NodeGroups.Initialize;
    nodeFields: {
        size: NumberField;
    };

    constructor() {
        super();

        this.nodeFields = {
            size: new NumberField(1),
        };
    }

    Initialize(id: number) {
        UpdateParticleData(id, (data) => {
            const size = this.nodeFields.size.GetNumber();
            const sizeVector3 = new Vector3(size, size, 0.001);

            data.sizeNormal = sizeVector3;
            return data;
        });
    }

    GetNodeName(): string {
        return SetSizeName;
    }

    GetAutoGenerationCode() {
        return AutoGenSetSize(this);
    }
}
