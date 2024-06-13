import { NodeGroups } from "API/NodeGroup";
import type { InitializeNode } from "../Initialize/InitializeNode";
import { Node } from "../Node";
import type { UpdateNode } from "../Update/UpdateNode";

export abstract class RenderNode extends Node {
    static nodeGroups = [NodeGroups.Render];

    GetNodeGroups(): NodeGroups[] {
        return RenderNode.nodeGroups;
    }

    GetNodeFolderName(): string {
        return "Render";
    }

    abstract Render: (initializeNodes: InitializeNode[], updateNodes: UpdateNode[]) => void;
    abstract Destroy(): void;
}
