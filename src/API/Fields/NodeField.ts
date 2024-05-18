import { Event } from "API/Bindables/Event";

export abstract class NodeField {
    abstract AutoGenerateField(fieldPath: string): string;
    abstract SerializeData(): {};
    abstract ReadSerializedData(data: unknown): void;
    FieldChanged = new Event();
}
