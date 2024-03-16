import { Event } from "API/Event";
import { LogicNode } from "API/Nodes/Logic/LogicNode";

export abstract class NodeField<T> {
	abstract GetValue(): T;
	abstract SetValue: (newValue: T) => void;
	abstract BindValue: (newValue: (() => T) | undefined, boundNode: LogicNode | undefined) => void;

	FieldChanged = new Event();
}
