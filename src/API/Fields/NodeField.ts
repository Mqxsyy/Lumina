import { Event } from "API/Bindables/Event";

export abstract class NodeField {
    abstract AutoGenerateField(fieldPath: string): string;
    abstract SerializeData(): void;
    abstract ReadSerializedData(data: {}): void;
    FieldChanged = new Event();
}
