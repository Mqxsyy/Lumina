import { LogicNode } from "API/Nodes/Logic/LogicNode";
import { NodeField } from "./NodeField";

export class Vector3Field extends NodeField<Vector3> {
	x: number;
	xBindNode: undefined | LogicNode;
	private xBind: undefined | (() => number);

	y: number;
	yBindNode: undefined | LogicNode;
	private yBind: undefined | (() => number);

	z: number;
	zBindNode: undefined | LogicNode;
	private zBind: undefined | (() => number);

	private valueBind: undefined | (() => Vector3);

	constructor(defaultValue: Vector3) {
		super();

		this.x = defaultValue.X;
		this.y = defaultValue.Y;
		this.z = defaultValue.Z;
	}

	GetValue() {
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

	SetValue = (newValue: Vector3) => {
		this.valueBind = undefined;

		this.x = (newValue as Vector3).X;
		this.y = (newValue as Vector3).Y;
		this.z = (newValue as Vector3).Z;

		this.FieldChanged.Fire();
	};

	SetValueX = (newValue: number) => {
		this.x = newValue;
		this.xBind = undefined;
		this.xBindNode = undefined;
		this.FieldChanged.Fire();
	};

	SetValueY = (newValue: number) => {
		this.y = newValue;
		this.yBind = undefined;
		this.yBindNode = undefined;
		this.FieldChanged.Fire();
	};

	SetValueZ = (newValue: number) => {
		this.z = newValue;
		this.zBind = undefined;
		this.zBindNode = undefined;
		this.FieldChanged.Fire();
	};

	BindValue = (newValue: (() => Vector3) | undefined) => {
		this.valueBind = newValue;
		this.FieldChanged.Fire();
	};

	BindValueX = (newValue: undefined | (() => number), boundNode: LogicNode | undefined) => {
		this.xBind = newValue;
		this.xBindNode = boundNode;
		this.FieldChanged.Fire();
	};

	BindValueY = (newValue: undefined | (() => number), boundNode: LogicNode | undefined) => {
		this.yBind = newValue;
		this.yBindNode = boundNode;
		this.FieldChanged.Fire();
	};

	BindValueZ = (newValue: undefined | (() => number), boundNode: LogicNode | undefined) => {
		this.zBind = newValue;
		this.zBindNode = boundNode;
		this.FieldChanged.Fire();
	};
}
