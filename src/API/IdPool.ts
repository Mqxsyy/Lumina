export class IdPool {
	private currentId: number;
	private usedIds: number[];
	private freeIds: number[];

	constructor() {
		this.currentId = 0;
		this.usedIds = [];
		this.freeIds = [];
	}

	GetNextId() {
		let id = this.freeIds.pop();

		if (id === undefined) {
			id = this.currentId++;
		}

		this.usedIds.push(id);
		return id;
	}

	ReleaseId(id: number) {
		const index = this.usedIds.findIndex((usedId) => usedId === id);

		if (index === -1) {
			error(id + " not found in " + this.usedIds);
		}

		const item = this.usedIds.remove(index);
		this.freeIds.push(item!);
	}
}
