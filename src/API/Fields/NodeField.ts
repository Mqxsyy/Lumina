export interface INodeField {
	GetValue(): unknown;
}

export abstract class NodeField implements INodeField {
	abstract GetValue(): unknown;
}
