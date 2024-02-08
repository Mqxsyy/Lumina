import { NodeField } from "./NodeField";

export class Vector3Field extends NodeField {
	value: Vector3;

	constructor(value: Vector3) {
		super();
		this.value = value;
	}

	GetValue(): unknown {
		return this.value;
	}
}
