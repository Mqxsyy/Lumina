import { NodeField } from "./NodeField";

export class Vector2Field extends NodeField {
	private value: Vector2 | (() => Vector2);

	constructor(defaultValue: Vector2) {
		super();
		this.value = defaultValue;
	}

	GetValue(): Vector2 {
		if (typeIs(this.value, "Vector2")) {
			return this.value;
		}

		return this.value();
	}

	SetValue(newValue: Vector2): void {
		this.value = newValue;
		this.FieldChanged.Fire();
	}

	BindValue(newValue: () => Vector2): void {
		this.value = newValue;
		this.FieldChanged.Fire();
	}
}
