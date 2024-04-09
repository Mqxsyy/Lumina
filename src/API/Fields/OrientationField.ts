import { NodeField } from "./NodeField";

export enum Orientation {
	FacingCamera = 1,
}

interface SerializedData {
	orientation: number;
}

export class OrientationField extends NodeField {
	orientation: Orientation;

	constructor(orientation: Orientation) {
		super();
		this.orientation = orientation;
	}

	GetOrientation() {
		return this.orientation;
	}

	SetOrientation = (orientation: number) => {
		this.orientation = orientation;
		this.FieldChanged.Fire();
	};

	SerializeData() {
		return {
			orientation: this.orientation,
		};
	}

	ReadSerializedData(data: {}) {
		this.SetOrientation((data as SerializedData).orientation);
	}
}
