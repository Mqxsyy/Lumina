import { NumberField } from "API/Fields/NumberField";
import { NodeGroups } from "API/NodeGroup";
import { AutoGenBurstSpawn } from "../AutoGeneration/SpawnNodes/AutoGenBurstSpawn";
import { SpawnNode } from "./SpawnNode";

export const BurstSpawnName = "BurstSpawn";
export const BurstSpawnFieldNames = {
    amount: "amount",
};

export class BurstSpawn extends SpawnNode {
    nodeGroup: NodeGroups = NodeGroups.Spawn;
    nodeFields: {
        amount: NumberField;
    };

    constructor() {
        super();

        this.nodeFields = {
            amount: new NumberField(20),
        };
    }

    GetNodeName() {
        return BurstSpawnName;
    }

    GetValue = (): number => {
        return this.nodeFields.amount.GetNumber();
    };

    GetAutoGenerationCode() {
        return AutoGenBurstSpawn(this);
    }
}
