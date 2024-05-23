import type { InitializeNode } from "../Initialize/InitializeNode";
import { Node } from "../Node";
import type { UpdateNode } from "../Update/UpdateNode";

export abstract class RenderNode extends Node {
    abstract Render: (initializeNodes: InitializeNode[], updateNodes: UpdateNode[]) => void;
    abstract Destroy(): void;
}
