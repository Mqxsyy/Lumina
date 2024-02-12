import { NodeField } from "./NodeField";

const DEFAULT_VALUE = true;

export class BooleanField extends NodeField {
	private value: boolean | (() => boolean) = DEFAULT_VALUE;

	GetValue(): boolean {
		if (typeIs(this.value, "boolean")) {
			return this.value;
		}

		return this.value();
	}

	SetValue(newValue: boolean): void {
		this.value = newValue;
	}

	BindValue(newValue: () => boolean): void {
		this.value = newValue;
	}
}
