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

	SetValue = (newValue: unknown) => {
		this.value = newValue as boolean;
		this.FieldChanged.Fire();
	};

	BindValue(newValue: () => boolean): void {
		this.value = newValue;
		this.FieldChanged.Fire();
	}
}
