import { NodeField } from "./NodeField";

export class Vector3Field extends NodeField {
	private x: number | ((id: number) => number);
	private y: number | ((id: number) => number);
	private z: number | ((id: number) => number);
	private valueBind: undefined | ((id: number) => Vector3);

	constructor(defaultValue: Vector3) {
		super();

		this.x = defaultValue.X;
		this.y = defaultValue.Y;
		this.z = defaultValue.Z;
	}

	GetValue(id: number): Vector3 {
		if (this.valueBind !== undefined) {
			return this.valueBind(id);
		}

		let x;
		if (typeIs(this.x, "number")) {
			x = this.x;
		} else {
			x = this.x(id);
		}

		let y;
		if (typeIs(this.y, "number")) {
			y = this.y;
		} else {
			y = this.y(id);
		}

		let z;
		if (typeIs(this.z, "number")) {
			z = this.z;
		} else {
			z = this.z(id);
		}

		return new Vector3(x, y, z);
	}

	SetValue(newValue: Vector3): void {
		this.valueBind = undefined;

		this.x = newValue.X;
		this.y = newValue.Y;
		this.z = newValue.Z;

		this.FieldChanged.Fire();
	}

	SetValueX(newValue: number): void {
		this.x = newValue;
		this.FieldChanged.Fire();
	}

	SetValueY(newValue: number): void {
		this.y = newValue;
		this.FieldChanged.Fire();
	}

	SetValueZ(newValue: number): void {
		this.z = newValue;
		this.FieldChanged.Fire();
	}

	BindValue(newValue: (id: number) => Vector3): void {
		this.valueBind = newValue;
		this.FieldChanged.Fire();
	}

	BindValueX(newValue: (id: number) => number): void {
		this.x = newValue;
		this.FieldChanged.Fire();
	}

	BindValueY(newValue: (id: number) => number): void {
		this.y = newValue;
		this.FieldChanged.Fire();
	}

	BindValueZ(newValue: (id: number) => number): void {
		this.z = newValue;
		this.FieldChanged.Fire();
	}
}
