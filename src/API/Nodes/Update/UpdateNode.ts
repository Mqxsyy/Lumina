import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { AutoGenAddToSystem, AutoGenImport } from "../AutoGenLib";
import { Node } from "../Node";

export abstract class UpdateNode extends Node {
    abstract Update(data: ParticleData, dt: number): void;
    ClearCache(id: number) {}
}

export function AutoGenUpdateNode(node: UpdateNode, src: Src, createFields?: (varName: string) => void) {
    const varName = AutoGenImport(node, src);

    if (createFields !== undefined) {
        createFields(varName);
    }

    AutoGenAddToSystem(varName, src);
}
