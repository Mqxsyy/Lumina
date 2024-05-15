import { NodeField } from "./NodeField";

export enum Orientation {
    FacingCamera = 1,
    VelocityParallel = 2,
    VelocityPerpendicular = 3,
}

function GetOrientationName(orientation: Orientation) {
    switch (orientation) {
        case Orientation.FacingCamera:
            return "Facing Camera";
        case Orientation.VelocityParallel:
            return "Velocity Parallel";
        case Orientation.VelocityPerpendicular:
            return "Velocity Perpendicular";
    }
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

    GetOrientationName() {
        return GetOrientationName(this.orientation);
    }

    SetOrientation = (orientation: number) => {
        this.orientation = orientation;
        this.FieldChanged.Fire();
    };

    AutoGenerateField(fieldPath: string) {
        return `${fieldPath}.SetOrientation(${this.orientation}) \n`;
    }

    SerializeData() {
        return {
            orientation: this.orientation,
        };
    }

    ReadSerializedData(data: {}) {
        this.SetOrientation((data as SerializedData).orientation);
    }
}
