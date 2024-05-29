import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { AutoGenAddToSystem, AutoGenImport } from "../AutoGenLib";
import { Node } from "../Node";

export abstract class InitializeNode extends Node {
    abstract Initialize(data: ParticleData): void;
}

export function AutoGenInitializeNode(node: InitializeNode, src: Src, createFields?: (varName: string) => void) {
    const varName = AutoGenImport(node, src);

    if (createFields !== undefined) {
        createFields(varName);
    }

    AutoGenAddToSystem(varName, src);
}
