import { NodeField } from "./NodeField";

export enum Orientation {
	FacingCamera,
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
}
