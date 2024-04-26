import { LogicNode } from "API/Nodes/Logic/LogicNode";
import { NodeField } from "./NodeField";

interface SerializedData {
	x: number;
	y: number;
}

export interface SimpleVector2 {
	x: number;
	y: number;
}

export class Vector2Field extends NodeField {
	x: number;
	boundNodeX: undefined | LogicNode;
	private boundFunctionX: undefined | (() => number);

	y: number;
	boundNodeY: undefined | LogicNode;
	private boundFunctionY: undefined | (() => number);

	boundNode: undefined | LogicNode;
	private boundFunction: undefined | (() => SimpleVector2);

	constructor(x: number, y: number) {
		super();

		this.x = x;
		this.y = y;
	}

	GetVector2(): SimpleVector2 {
		if (this.boundFunction !== undefined) {
			return this.boundFunction();
		}

		const x = this.GetX();
		const y = this.GetY();

		return { x, y };
	}

	GetX = () => {
		if (this.boundFunctionX !== undefined) {
			return this.boundFunctionX();
		}

		return this.x;
	};

	GetY = () => {
		if (this.boundFunctionY !== undefined) {
			return this.boundFunctionY();
		}

		return this.y;
	};

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

	BindVector2 = (boundFunction: (() => SimpleVector2) | undefined, boundNode: LogicNode | undefined) => {
		this.boundFunction = boundFunction;
		this.boundNode = boundNode;
		this.FieldChanged.Fire();
	};

	UnbindVector2 = () => {
		this.boundFunction = undefined;
		this.boundNode = undefined;
		this.FieldChanged.Fire();
	};

	BindX = (boundFunction: () => number, boundNode: LogicNode) => {
		this.boundFunctionX = boundFunction;
		this.boundNodeX = boundNode;
		this.FieldChanged.Fire();
	};

	UnbindX = () => {
		this.boundFunctionX = undefined;
		this.boundNodeX = undefined;
		this.FieldChanged.Fire();
	};

	BindY = (boundFunction: undefined | (() => number), boundNode: LogicNode | undefined) => {
		this.boundFunctionY = boundFunction;
		this.boundNodeY = boundNode;
		this.FieldChanged.Fire();
	};

	UnbindY = () => {
		this.boundFunctionY = undefined;
		this.boundNodeY = undefined;
		this.FieldChanged.Fire();
	};

	SerializeData() {
		return {
			x: this.x,
			y: this.y,
		};
	}

	ReadSerializedData(data: {}) {
		const serializedData = data as SerializedData;
		this.SetVector2(serializedData.x, serializedData.y);
	}
}
