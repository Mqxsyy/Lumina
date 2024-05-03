import { InitializeNode } from "../Initialize/InitializeNode";
import { Node } from "../Node";
import { UpdateNode } from "../Update/UpdateNode";

export abstract class RenderNode extends Node {
    abstract Render: (initializeNodes: InitializeNode[], updateNodes: UpdateNode[]) => void;
    abstract Destroy(): void;
}
