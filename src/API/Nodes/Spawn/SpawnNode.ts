import { NodeGroups } from "API/NodeGroup";
import { Node } from "../Node";

export abstract class SpawnNode extends Node {
    static nodeGroups = [NodeGroups.Spawn];

    GetNodeGroups(): NodeGroups[] {
        return SpawnNode.nodeGroups;
    }

    GetNodeFolderName(): string {
        return "Spawn";
    }

    abstract GetValue: () => number;
}
