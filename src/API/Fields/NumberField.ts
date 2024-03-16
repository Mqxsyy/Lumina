import { LogicNode } from "API/Nodes/Logic/LogicNode";
import { NodeField } from "./NodeField";

export class NumberField extends NodeField<number> {
	value: number;
	valueBindNode: undefined | LogicNode;
	private valueBind: undefined | (() => number);

	constructor(defaultValue: number) {
		super();
		this.value = defaultValue;
	}

	GetValue() {
		if (this.valueBind !== undefined) {
			return this.valueBind();
		}

		return this.value;
	}

	SetValue = (newValue: number) => {
		this.value = newValue;
		this.FieldChanged.Fire();
	};

	BindValue = (newValue: (() => number) | undefined, boundNode: LogicNode | undefined) => {
		this.valueBind = newValue;
		this.valueBindNode = boundNode;
		this.FieldChanged.Fire();
	};
}
