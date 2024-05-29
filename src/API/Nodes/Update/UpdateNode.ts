import type { ParticleData } from "API/ParticleService";
import { Node } from "../Node";

export abstract class UpdateNode extends Node {
    abstract Update(data: ParticleData, dt: number): void;
    ClearCache(id: number) {}
}
