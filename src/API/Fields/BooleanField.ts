import { LogicNode } from "API/Nodes/Logic/LogicNode";
import { NodeField } from "./NodeField";

export class BooleanField extends NodeField<boolean> {
	value: boolean;
	valueBindNode: undefined | LogicNode;
	private valueBind: undefined | (() => boolean);

	constructor(defaultValue: boolean) {
		super();
		this.value = defaultValue;
	}

	GetValue() {
		if (this.valueBind !== undefined) {
			return this.valueBind();
		}

		return this.value;
	}

	SetValue = (newValue: boolean) => {
		this.value = newValue;
		this.FieldChanged.Fire();
	};

	BindValue = (newValue: (() => boolean) | undefined, boundNode: LogicNode | undefined) => {
		this.valueBind = newValue;
		this.valueBindNode = boundNode;
		this.FieldChanged.Fire();
	};
}
