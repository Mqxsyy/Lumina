import type { Src } from "API/VFXScriptCreator";
import { AutoGenAddToSystem, AutoGenImport } from "../AutoGenLib";
import { Node } from "../Node";

export abstract class SpawnNode extends Node {
    abstract GetValue: () => number;
}

export function AutoGenSpawnNode(node: SpawnNode, src: Src, createFields?: (varName: string) => void) {
    const varName = AutoGenImport(node, src);

    if (createFields !== undefined) {
        createFields(varName);
    }

    AutoGenAddToSystem(varName, src);
}
