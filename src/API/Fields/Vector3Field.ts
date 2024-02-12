import { NodeField } from "./NodeField";

export class Vector3Field extends NodeField {
	private x: number | (() => number);
	private y: number | (() => number);
	private z: number | (() => number);
	private valueBind: undefined | (() => Vector3);

	constructor(defaultValue: Vector3) {
		super();

		this.x = defaultValue.X;
		this.y = defaultValue.Y;
		this.z = defaultValue.Z;
	}

	GetValue(): Vector3 {
		if (this.valueBind !== undefined) {
			return this.valueBind();
		}

		let x;
		if (typeIs(this.x, "number")) {
			x = this.x;
		} else {
			x = this.x();
		}

		let y;
		if (typeIs(this.y, "number")) {
			y = this.y;
		} else {
			y = this.y();
		}

		let z;
		if (typeIs(this.z, "number")) {
			z = this.z;
		} else {
			z = this.z();
		}

		return new Vector3(x, y, z);
	}

	SetValue(newValue: Vector3): void {
		this.valueBind = undefined;

		this.x = newValue.X;
		this.y = newValue.Y;
		this.z = newValue.Z;
	}

	SetValueX(newValue: number): void {
		this.x = newValue;
	}

	SetValueY(newValue: number): void {
		this.y = newValue;
	}

	SetValueZ(newValue: number): void {
		this.z = newValue;
	}

	BindValue(newValue: () => Vector3): void {
		this.valueBind = newValue;
	}

	BindValueX(newValue: () => number): void {
		this.x = newValue;
	}

	BindValueY(newValue: () => number): void {
		this.y = newValue;
	}

	BindValueZ(newValue: () => number): void {
		this.z = newValue;
	}
}
