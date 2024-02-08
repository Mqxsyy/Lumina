import { NodeField } from "./NodeField";

export class BooleanField extends NodeField {
	value: boolean;

	constructor(value: boolean) {
		super();
		this.value = value;
	}

	GetValue(): unknown {
		return this.value;
	}
}
