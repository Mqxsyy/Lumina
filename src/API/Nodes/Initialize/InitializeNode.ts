import type { ParticleData } from "API/ParticleService";
import { Node } from "../Node";

export abstract class InitializeNode extends Node {
    abstract Initialize(data: ParticleData): void;
}
