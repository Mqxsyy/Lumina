import { NodeField } from "./NodeField";

export class NumberField extends NodeField {
	value: number;

	constructor(value: number) {
		super();
		this.value = value;
	}

	GetValue(): unknown {
		return this.value;
	}
}
