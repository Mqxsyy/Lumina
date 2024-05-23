import type { NodeSystemCollectioEntry } from "Services/NodeSystemService";
import type { NodeCollectionEntry } from "Services/NodesService";

export interface SelectionEntry {
    name: string;
    create?: () => NodeCollectionEntry | NodeSystemCollectioEntry | NodeSystemCollectioEntry[]; // technically only nodeData required, others just for compatability
}
