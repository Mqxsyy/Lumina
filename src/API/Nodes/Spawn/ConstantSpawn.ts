import { NumberField } from "API/Fields/NumberField";
import { NodeGroups } from "API/NodeGroup";
import type { Src } from "API/VFXScriptCreator";
import { AutoGenSpawnNode, SpawnNode } from "./SpawnNode";

export const ConstantSpawnName = "ConstantSpawn";
export const ConstantSpawnFieldNames = {
    rate: "rate",
};

export class ConstantSpawn extends SpawnNode {
    nodeGroup: NodeGroups = NodeGroups.Spawn;
    nodeFields: {
        rate: NumberField; // per second
    };

    constructor() {
        super();

        this.nodeFields = {
            rate: new NumberField(20),
        };
    }

    GetNodeName() {
        return ConstantSpawnName;
    }

    GetValue = (): number => {
        return this.nodeFields.rate.GetNumber();
    };

    GetAutoGenerationCode(src: Src) {
        AutoGenSpawnNode(this, src, (varName) => {
            this.nodeFields.rate.AutoGenerateField(`${varName}.nodeFields.rate`, src);
        });
    }
}
