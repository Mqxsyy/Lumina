import { LogicNode } from "API/Nodes/Logic/LogicNode";
import { NodeField } from "./NodeField";

interface SerializedData {
	x: number;
	y: number;
	z: number;
}

export interface SimpleVector3 {
	x: number;
	y: number;
	z: number;
}

export class Vector3Field extends NodeField {
	x: number;
	boundNodeX: undefined | LogicNode;
	private boundFunctionX: undefined | (() => number);

	y: number;
	boundNodeY: undefined | LogicNode;
	private boundFunctionY: undefined | (() => number);

	z: number;
	boundNodeZ: undefined | LogicNode;
	private boundFunctionZ: undefined | (() => number);

	boundNode: undefined | LogicNode;
	private boundFunction: undefined | (() => SimpleVector3);

	constructor(x: number, y: number, z: number) {
		super();

		this.x = x;
		this.y = y;
		this.z = z;
	}

	GetVector3(): SimpleVector3 {
		if (this.boundFunction !== undefined) {
			return this.boundFunction();
		}

		const x = this.GetX();
		const y = this.GetY();
		const z = this.GetZ();

		return { x, y, z };
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

	GetZ = () => {
		if (this.boundFunctionZ !== undefined) {
			return this.boundFunctionZ();
		}

		return this.z;
	};

	SetVector3 = (x: number, y: number, z: number) => {
		this.boundFunction = undefined;
		this.boundNode = undefined;

		this.SetX(x, true);
		this.SetY(y, true);
		this.SetZ(z, true);

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

	SetZ = (z: number, ignoreFieldChange: boolean = false) => {
		this.z = z;
		this.boundFunctionZ = undefined;
		this.boundNodeZ = undefined;

		if (!ignoreFieldChange) return;
		this.FieldChanged.Fire();
	};

	BindVector3 = (boundFunction: () => SimpleVector3, boundNode: LogicNode) => {
		this.boundFunction = boundFunction;
		this.boundNode = boundNode;
		this.FieldChanged.Fire();
	};

	UnbindVector3 = () => {
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

	BindY = (boundFunction: () => number, boundNode: LogicNode) => {
		this.boundFunctionY = boundFunction;
		this.boundNodeY = boundNode;
		this.FieldChanged.Fire();
	};

	UnbindY = () => {
		this.boundFunctionY = undefined;
		this.boundNodeY = undefined;
		this.FieldChanged.Fire();
	};

	BindZ = (boundFunction: () => number, boundNode: LogicNode) => {
		this.boundFunctionZ = boundFunction;
		this.boundNodeZ = boundNode;
		this.FieldChanged.Fire();
	};

	UnbindZ = () => {
		this.boundFunctionZ = undefined;
		this.boundNodeZ = undefined;
		this.FieldChanged.Fire();
	};

	SerializeData() {
		return {
			x: this.x,
			y: this.y,
			z: this.z,
		};
	}

	ReadSerializedData(data: {}) {
		const serializedData = data as SerializedData;
		this.SetVector3(serializedData.x, serializedData.y, serializedData.z);
	}
}
