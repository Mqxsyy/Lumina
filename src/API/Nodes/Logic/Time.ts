import { LogicNode } from "./LogicNode";

export class Time extends LogicNode {
    static className = "Time";

    nodeFields = {};

    Calculate = () => {
        return os.clock();
    };

    GetClassName(): string {
        return Time.className;
    }
}
