import { NodeField } from "./NodeField";

const DEFAULT_VALUE = 1;

export class NumberField extends NodeField {
	private value: number | (() => number) = DEFAULT_VALUE;

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
