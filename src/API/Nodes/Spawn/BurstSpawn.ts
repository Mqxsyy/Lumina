import { NumberField } from "API/Fields/NumberField";
import { SpawnNode } from "./SpawnNode";

export class BurstSpawn extends SpawnNode {
    static className = "BurstSpawn";

    nodeFields = {
        amount: new NumberField(20),
        delay: new NumberField(0),
    };

    GetValue = () => {
        return this.nodeFields.amount.GetNumber();
    };

    GetClassName() {
        return BurstSpawn.className;
    }
}
