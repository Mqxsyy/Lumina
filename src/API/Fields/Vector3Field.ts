import { LogicNode } from "API/Nodes/Logic/LogicNode";
import { NodeField } from "./NodeField";

interface SerializedData {
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
	private boundFunction: undefined | (() => Vector3);

	constructor(x: number, y: number, z: number) {
		super();

		this.x = x;
		this.y = y;
		this.z = z;
	}

	GetVector3() {
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

		let z;
		if (this.boundFunctionZ !== undefined) {
			z = this.boundFunctionZ();
		} else {
			z = this.z;
		}

		return new Vector3(x, y, z);
	}

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

	BindVector3 = (boundFunction: (() => Vector3) | undefined, boundNode: LogicNode | undefined) => {
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

	BindZ = (boundFunction: undefined | (() => number), boundNode: LogicNode | undefined) => {
		this.boundFunctionZ = boundFunction;
		this.boundNodeZ = boundNode;
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
