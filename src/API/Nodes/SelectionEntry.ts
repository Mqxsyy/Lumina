import type { NodeGroups } from "API/NodeGroup";
import type { NodeSystemCollectioEntry } from "Services/NodeSystemService";
import type { NodeCollectionEntry } from "Services/NodesService";

export interface Entry {
    name: string;
    create: () => NodeCollectionEntry | NodeSystemCollectioEntry | NodeSystemCollectioEntry[];
}

export interface SelectionEntry {
    className: string;
    nodeGroups: NodeGroups[];
    defaultEntry: Entry;
    alternativeEntries?: Entry[];
}
