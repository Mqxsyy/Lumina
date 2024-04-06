import { LogicNode } from "API/Nodes/Logic/LogicNode";
import { NodeField } from "./NodeField";

export class NumberField extends NodeField {
	number: number;
	boundNode: undefined | LogicNode;
	private boundFunction: undefined | (() => number);

	constructor(number: number) {
		super();
		this.number = number;
	}

	GetNumber() {
		if (this.boundFunction !== undefined) {
			return this.boundFunction();
		}

		return this.number;
	}

	SetNumber = (number: number) => {
		this.number = number;
		this.boundFunction = undefined;
		this.boundNode = undefined;
		this.FieldChanged.Fire();
	};

	BindNumber = (boundFunction: (() => number) | undefined, boundNode: LogicNode | undefined) => {
		this.boundFunction = boundFunction;
		this.boundNode = boundNode;
		this.FieldChanged.Fire();
	};
}
