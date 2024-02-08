import { Node } from "../Node";
import { INodeField } from "../../Fields/NodeField";
import { NodeGroups } from "../../NodeGroup";
import { NodeTypes } from "../NodeTypes";

export class ParticlePlane extends Node {
	nodeGroup: NodeGroups = NodeGroups.Render;
	nodeType: NodeTypes = NodeTypes.ParticlePlane;
	nodeFields: INodeField[] = [];

	fn() {
		print("SPAWN PARTICLE PLANE");
		return;
	}
}
