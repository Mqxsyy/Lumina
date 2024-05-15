import { NodeField } from "./NodeField";

export enum Shapes {
    Cube = 1,
    Sphere = 2,
}

function GetShapeName(shape: Shapes) {
    switch (shape) {
        case Shapes.Cube:
            return "Cube";
        case Shapes.Sphere:
            return "Sphere";
    }
}

interface SerializedData {
    shape: number;
}

export class ShapeField extends NodeField {
    shape: Shapes;

    constructor(shape: Shapes) {
        super();
        this.shape = shape;
    }

    GetShape() {
        return this.shape;
    }

    GetShapeName() {
        return GetShapeName(this.shape);
    }

    SetShape = (shape: number) => {
        this.shape = shape;
        this.FieldChanged.Fire();
    };

    AutoGenerateField(fieldPath: string) {
        return `${fieldPath}.SetShape(${this.shape}) \n`;
    }

    SerializeData() {
        return {
            shape: this.shape,
        };
    }

    ReadSerializedData(data: {}) {
        this.SetShape((data as SerializedData).shape);
    }
}
