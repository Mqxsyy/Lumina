import { NodeField } from "./NodeField";

export class BooleanField extends NodeField {
	private value: boolean | (() => boolean);

	constructor(defaultValue: boolean) {
		super();
		this.value = defaultValue;
	}

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
