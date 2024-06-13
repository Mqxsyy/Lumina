import { NumberField } from "API/Fields/NumberField";
import { SpawnNode } from "./SpawnNode";

export class ConstantSpawn extends SpawnNode {
    static className = "ConstantSpawn";

    nodeFields = {
        rate: new NumberField(20),
    };

    GetValue = () => {
        return this.nodeFields.rate.GetNumber();
    };

    GetClassName() {
        return ConstantSpawn.className;
    }
}
