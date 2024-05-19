import { NodeField } from "./NodeField";

export enum VolumetricParticleShapes {
    Cube = 1,
    Sphere = 2,
}

function GetShapeName(shape: VolumetricParticleShapes) {
    switch (shape) {
        case VolumetricParticleShapes.Cube:
            return "Cube";
        case VolumetricParticleShapes.Sphere:
            return "Sphere";
    }
}

interface SerializedData {
    shape: number;
}

export class VolumetricParticleShapeField extends NodeField {
    shape: VolumetricParticleShapes;

    constructor(shape: VolumetricParticleShapes) {
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

    ReadSerializedData(data: SerializedData) {
        this.SetShape(data.shape);
    }
}
