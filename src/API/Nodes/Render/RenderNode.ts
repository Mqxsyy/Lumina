import type { Src } from "API/VFXScriptCreator";
import { AutoGenAddToSystem, AutoGenImport } from "../AutoGenLib";
import type { InitializeNode } from "../Initialize/InitializeNode";
import { Node } from "../Node";
import type { UpdateNode } from "../Update/UpdateNode";

export abstract class RenderNode extends Node {
    abstract Render: (initializeNodes: InitializeNode[], updateNodes: UpdateNode[]) => void;
    abstract Destroy(): void;
}

export function AutoGenRenderNode(node: RenderNode, src: Src, createFields?: (varName: string) => void) {
    const varName = AutoGenImport(node, src);

    if (createFields !== undefined) {
        createFields(varName);
    }

    AutoGenAddToSystem(varName, src);
}
