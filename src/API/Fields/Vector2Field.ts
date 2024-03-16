import { LogicNode } from "API/Nodes/Logic/LogicNode";
import { NodeField } from "./NodeField";

export class Vector2Field extends NodeField<Vector2> {
	x: number;
	xBindNode: undefined | LogicNode;
	private xBind: undefined | (() => number);

	y: number;
	yBindNode: undefined | LogicNode;
	private yBind: undefined | (() => number);

	private valueBind: undefined | (() => Vector2);

	constructor(defaultValue: Vector2) {
		super();

		this.x = defaultValue.X;
		this.y = defaultValue.Y;
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

		return new Vector2(x, y);
	}

	SetValue = (newValue: Vector2) => {
		this.valueBind = undefined;

		this.x = newValue.X;
		this.y = newValue.Y;

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

	BindValue = (newValue: (() => Vector2) | undefined) => {
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
}
