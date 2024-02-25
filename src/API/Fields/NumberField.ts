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

	SetValue = (newValue: unknown) => {
		print(newValue);
		this.value = newValue as number;
	};

	BindValue(newValue: () => number): void {
		this.value = newValue;
	}
}
