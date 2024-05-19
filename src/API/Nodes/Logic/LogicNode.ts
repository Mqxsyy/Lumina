import type { ParticleData } from "API/ParticleService";
import { Node } from "../Node";

export abstract class LogicNode extends Node {
    abstract Calculate: (data: ParticleData) => unknown;
}
