import { Event } from "API/Bindables/Event";

export abstract class NodeField {
	FieldChanged = new Event();
}
