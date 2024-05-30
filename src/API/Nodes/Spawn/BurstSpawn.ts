import { NumberField } from "API/Fields/NumberField";
import { NodeGroups } from "API/NodeGroup";
import type { Src } from "API/VFXScriptCreator";
import { AutoGenSpawnNode, SpawnNode } from "./SpawnNode";

export const BurstSpawnName = "BurstSpawn";
export const BurstSpawnFieldNames = {
    amount: "amount",
};

export class BurstSpawn extends SpawnNode {
    nodeGroup: NodeGroups = NodeGroups.Spawn;
    nodeFields = {
        amount: new NumberField(20),
    };

    GetNodeName() {
        return BurstSpawnName;
    }

    GetValue = (): number => {
        return this.nodeFields.amount.GetNumber();
    };

    GetAutoGenerationCode(src: Src) {
        AutoGenSpawnNode(this, src, (varName) => {
            this.nodeFields.amount.AutoGenerateField(`${varName}.nodeFields.amount`, src);
        });
    }
}
