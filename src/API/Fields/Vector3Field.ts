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

	SetValue = (newValue: unknown) => {
		this.valueBind = undefined;

		this.x = (newValue as Vector3).X;
		this.y = (newValue as Vector3).Y;
		this.z = (newValue as Vector3).Z;

		this.FieldChanged.Fire();
	};

	SetValueX = (newValue: number) => {
		this.x = newValue;
		this.FieldChanged.Fire();
	};

	SetValueY = (newValue: number) => {
		this.y = newValue;
		this.FieldChanged.Fire();
	};

	SetValueZ = (newValue: number) => {
		this.z = newValue;
		this.FieldChanged.Fire();
	};

	BindValue(newValue: () => Vector3): void {
		this.valueBind = newValue;
		this.FieldChanged.Fire();
	}

	BindValueX(newValue: () => number): void {
		this.x = newValue;
		this.FieldChanged.Fire();
	}

	BindValueY(newValue: () => number): void {
		this.y = newValue;
		this.FieldChanged.Fire();
	}

	BindValueZ(newValue: () => number): void {
		this.z = newValue;
		this.FieldChanged.Fire();
	}
}
