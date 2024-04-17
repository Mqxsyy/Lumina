import { LogicNode } from "API/Nodes/Logic/LogicNode";
import { NodeField } from "./NodeField";
import { GetNodeById } from "Services/NodesService";

interface SerializedData {
	number: number;
}

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

	BindNumber = (boundFunction: () => number, boundNodeId: number) => {
		this.boundFunction = boundFunction;
		this.boundNode = GetNodeById(boundNodeId)!.data.node as LogicNode;
		this.FieldChanged.Fire();
	};

	UnbindNumber = () => {
		this.boundFunction = undefined;
		this.boundNode = undefined;
		this.FieldChanged.Fire();
	};

	SerializeData() {
		return {
			number: this.number,
		};
	}

	ReadSerializedData(data: {}) {
		this.SetNumber((data as SerializedData).number);
	}
}
