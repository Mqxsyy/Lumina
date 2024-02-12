export interface INodeField {
	GetValue(): unknown;
	SetValue(newValue: unknown): void;
	BindValue(newValue: unknown): void;
}

export abstract class NodeField implements INodeField {
	abstract GetValue(): unknown;
	abstract SetValue(newValue: unknown): void;
	abstract BindValue(newValue: unknown): void;
}
