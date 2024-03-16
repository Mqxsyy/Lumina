import { NodeField } from "./NodeField";

export enum Orientation {
	FacingCamera,
}

export class OrientationField extends NodeField<Orientation> {
	value: Orientation;

	constructor(defaultValue: Orientation) {
		super();
		this.value = defaultValue;
	}

	GetValue() {
		return this.value;
	}

	SetValue = (newValue: number) => {
		this.value = newValue;
		this.FieldChanged.Fire();
	};

	BindValue = () => {
		warn("OrientationField cannot be bound to a function");
	};
}
