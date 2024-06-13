import type { ParticleData } from "API/ParticleService";
import { LogicNode } from "./LogicNode";

export class AliveTime extends LogicNode {
    static className = "AliveTime";

    nodeFields = {};

    Calculate = (data: ParticleData) => {
        return data.alivetime;
    };

    GetClassName(): string {
        return AliveTime.className;
    }
}
