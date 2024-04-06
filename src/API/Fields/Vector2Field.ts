import { LogicNode } from "API/Nodes/Logic/LogicNode";
import { NodeField } from "./NodeField";

export class Vector2Field extends NodeField {
	x: number;
	boundNodeX: undefined | LogicNode;
	private boundFunctionX: undefined | (() => number);

	y: number;
	boundNodeY: undefined | LogicNode;
	private boundFunctionY: undefined | (() => number);

	boundNode: undefined | LogicNode;
	private boundFunction: undefined | (() => Vector2);

	constructor(x: number, y: number) {
		super();

		this.x = x;
		this.y = y;
	}

	GetVector2() {
		if (this.boundFunction !== undefined) {
			return this.boundFunction();
		}

		let x;
		if (this.boundFunctionX !== undefined) {
			x = this.boundFunctionX();
		} else {
			x = this.x;
		}

		let y;
		if (this.boundFunctionY !== undefined) {
			y = this.boundFunctionY();
		} else {
			y = this.y;
		}

		return new Vector2(x, y);
	}

	SetVector2 = (x: number, y: number) => {
		this.boundFunction = undefined;
		this.boundNode = undefined;

		this.SetX(x, true);
		this.SetY(y, true);

		this.FieldChanged.Fire();
	};

	SetX = (x: number, ignoreFieldChange: boolean = false) => {
		this.x = x;
		this.boundFunctionX = undefined;
		this.boundNodeX = undefined;

		if (!ignoreFieldChange) return;
		this.FieldChanged.Fire();
	};

	SetY = (y: number, ignoreFieldChange: boolean = false) => {
		this.y = y;
		this.boundFunctionY = undefined;
		this.boundNodeY = undefined;

		if (!ignoreFieldChange) return;
		this.FieldChanged.Fire();
	};

	BindVector2 = (boundFunction: (() => Vector2) | undefined, boundNode: LogicNode | undefined) => {
		this.boundFunction = boundFunction;
		this.boundNode = boundNode;
		this.FieldChanged.Fire();
	};

	BindX = (boundFunction: undefined | (() => number), boundNode: LogicNode | undefined) => {
		this.boundFunctionX = boundFunction;
		this.boundNodeX = boundNode;
		this.FieldChanged.Fire();
	};

	BindY = (boundFunction: undefined | (() => number), boundNode: LogicNode | undefined) => {
		this.boundFunctionY = boundFunction;
		this.boundNodeY = boundNode;
		this.FieldChanged.Fire();
	};
}
