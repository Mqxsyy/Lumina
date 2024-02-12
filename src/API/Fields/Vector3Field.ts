import { NodeField } from "./NodeField";

// TODO: make expandable / each value be able to be assigned individually

const DEFAULT_VALUE = new Vector3(0, 0, 0);

export class Vector3Field extends NodeField {
	private value: Vector3 | (() => Vector3) = DEFAULT_VALUE;

	GetValue(): Vector3 {
		if (typeIs(this.value, "Vector3")) {
			return this.value;
		}

		return this.value();
	}

	SetValue(newValue: Vector3): void {
		this.value = newValue;
	}

	BindValue(newValue: () => Vector3): void {
		this.value = newValue;
	}
}
