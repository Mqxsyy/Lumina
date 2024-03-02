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

	SetValue = (newValue: unknown) => {
		this.value = newValue as Vector2;
		this.FieldChanged.Fire();
	};

	SetMinValue = (min: number) => {
		const value = this.GetValue();
		this.SetValue(new Vector2(min, value.Y));
		this.FieldChanged.Fire();
	};

	SetMaxValue = (max: number) => {
		const value = this.GetValue();
		this.SetValue(new Vector2(value.X, max));
		this.FieldChanged.Fire();
	};

	BindValue(newValue: () => Vector2): void {
		this.value = newValue;
		this.FieldChanged.Fire();
	}
}
