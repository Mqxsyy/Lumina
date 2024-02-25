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

	SetValue = (newValue: unknown) => {
		this.value = newValue as number;
	};

	BindValue(): void {
		warn("OrientationField cannot be bound to a function");
	}
}
