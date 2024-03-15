import { NumberField } from "../../Fields/NumberField";
import { NodeGroups } from "../../NodeGroup";
import { NodeTypes } from "../NodeTypes";
import { InitializeNode } from "./InitializeNode";

const autoGenCode = `
local Lifetime = TS.import(script, APIFolder, "Nodes", "Initialize", "Lifetime").Lifetime
local lifetime = Lifetime.new()
nodeSystem:AddNode(lifetime)`;

export class Lifetime extends InitializeNode {
	nodeGroup: NodeGroups = NodeGroups.Initialize;
	nodeType: NodeTypes = NodeTypes.Lifetime;
	nodeFields: {
		time: NumberField;
	};

	constructor() {
		super();

		this.nodeFields = {
			time: new NumberField(1),
		};
	}

	GetValue = (): number => {
		return this.nodeFields.time.GetValue() as number;
	};

	GetAutoGenerationCode() {
		return autoGenCode;
	}
}
