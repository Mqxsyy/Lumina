import { Event } from "API/Bindables/Event";

export abstract class NodeField {
    abstract SerializeData(): void;
    abstract ReadSerializedData(data: {}): void;
    FieldChanged = new Event();
}
