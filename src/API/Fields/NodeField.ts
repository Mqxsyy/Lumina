import { Event } from "API/Event";

export interface INodeField {
	GetValue(id: number): unknown;
	SetValue(newValue: unknown): void;
	BindValue(newValue: unknown): void;
	FieldChanged: Event;
}

export abstract class NodeField implements INodeField {
	abstract GetValue(id: number): unknown;
	abstract SetValue(newValue: unknown): void;
	abstract BindValue(newValue: unknown): void;

	FieldChanged = new Event();
}
