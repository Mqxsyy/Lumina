import { Event } from "API/Bindables/Event";
import type { Src } from "API/VFXScriptCreator";

export abstract class NodeField {
    abstract AutoGenerateField(fieldPath: string, src: Src): void;
    abstract SerializeData(): unknown;
    abstract ReadSerializedData(data: unknown): void;
    FieldChanged = new Event();
}
