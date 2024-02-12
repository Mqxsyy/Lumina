import { NodeField } from "./NodeField";

export class NumberField extends NodeField {
	private value: number | (() => number);

	constructor(defaultValue: number) {
		super();
		this.value = defaultValue;
	}

	GetValue(): number {
		if (typeIs(this.value, "number")) {
			return this.value;
		}

		return this.value();
	}

	SetValue(newValue: number): void {
		this.value = newValue;
	}

	BindValue(newValue: () => number): void {
		this.value = newValue;
	}
}
