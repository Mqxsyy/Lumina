import { NodeSystemCollectioEntry } from "Services/NodeSystemService";
import { NodeCollectionEntry } from "Services/NodesService";

export interface SelectionEntry {
	name: string;
	create?: () => NodeCollectionEntry | NodeSystemCollectioEntry | NodeSystemCollectioEntry[]; // technically only nodeData required, others just for compatability
}
