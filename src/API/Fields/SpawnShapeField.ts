import type { Src } from "API/VFXScriptCreator";
import { NodeField } from "./NodeField";

export enum SpawnShape {
    Square = 1,
    Cube = 2,
    Ellipse = 3,
    Sphere = 4,
}

function GetSpawnShapeName(spawnShape: SpawnShape) {
    switch (spawnShape) {
        case SpawnShape.Square:
            return "Square";
        case SpawnShape.Cube:
            return "Cube";
        case SpawnShape.Ellipse:
            return "Ellipse";
        case SpawnShape.Sphere:
            return "Sphere";
    }
}

interface SerializedData {
    spawnShape: number;
}

export class SpawnShapeField extends NodeField {
    spawnShape: SpawnShape;

    constructor(spawnShape: SpawnShape) {
        super();
        this.spawnShape = spawnShape;
    }

    GetSpawnShape() {
        return this.spawnShape;
    }

    GetSpawnShapeName() {
        return GetSpawnShapeName(this.spawnShape);
    }

    SetSpawnShape = (spawnshape: number) => {
        this.spawnShape = spawnshape;
        this.FieldChanged.Fire();
    };

    AutoGenerateField(fieldPath: string, src: Src) {
        src.value += `${fieldPath}.SetSpawnShape(${this.spawnShape}) \n`;
    }

    SerializeData() {
        return {
            spawnShape: this.spawnShape,
        };
    }

    ReadSerializedData(data: SerializedData) {
        this.SetSpawnShape(data.spawnShape);
    }
}
