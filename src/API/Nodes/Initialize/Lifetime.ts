import { Element } from "@rbxts/roact";
import { NumberField } from "../../Fields/NumberField";
import { NodeGroups } from "../../NodeGroup";
import { NodeTypes } from "../NodeTypes";
import { InitializeNode } from "./InitializeNode";

export class Lifetime extends InitializeNode {
	nodeGroup: NodeGroups = NodeGroups.Initialize;
	nodeType: NodeTypes = NodeTypes.Lifetime;
	nodeFields: {
		time: NumberField;
	};
	nodeElement?: (() => Element) | undefined;

	constructor() {
		super();

		this.nodeFields = {
			time: new NumberField(1),
		};
	}

	GetValue = (): number => {
		return this.nodeFields.time.GetValue() as number;
	};
}
