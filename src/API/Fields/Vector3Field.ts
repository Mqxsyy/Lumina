import { NodeField } from "./NodeField";

export class Vector3Field extends NodeField {
	private x: number;
	private xBind: undefined | (() => number);
	private y: number;
	private yBind: undefined | (() => number);
	private z: number;
	private zBind: undefined | (() => number);
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
		if (this.xBind !== undefined) {
			x = this.xBind();
		} else {
			x = this.x;
		}

		let y;
		if (this.yBind !== undefined) {
			y = this.yBind();
		} else {
			y = this.y;
		}

		let z;
		if (this.zBind !== undefined) {
			z = this.zBind();
		} else {
			z = this.z;
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

	BindValueX = (newValue: undefined | (() => number)) => {
		this.xBind = newValue;
		this.FieldChanged.Fire();
	};

	BindValueY = (newValue: undefined | (() => number)) => {
		this.yBind = newValue;
		this.FieldChanged.Fire();
	};

	BindValueZ = (newValue: undefined | (() => number)) => {
		this.zBind = newValue;
		this.FieldChanged.Fire();
	};
}
