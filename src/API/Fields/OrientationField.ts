import { NodeField } from "./NodeField";

export enum Orientation {
	FacingCamera,
}

export class OrientationField extends NodeField {
	private value: Orientation;

	constructor(defaultValue: Orientation) {
		super();
		this.value = defaultValue;
	}

	GetValue(): number {
		return this.value;
	}

	SetValue(newValue: number): void {
		this.value = newValue;
	}

	BindValue(): void {
		warn("OrientationField cannot be bound to a function");
	}
}
