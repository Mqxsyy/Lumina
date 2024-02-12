export class ObjectPool {
	item: BasePart;
	folder: Folder;

	activeItems: BasePart[];
	standbyItems: BasePart[];

	constructor(item: BasePart, poolFolder: Folder) {
		this.item = item;
		this.folder = poolFolder;

		this.activeItems = [];
		this.standbyItems = [];
	}

	GetItem() {
		let item = this.standbyItems.pop();

		if (item === undefined) {
			item = this.item.Clone();
		}

		item.Parent = this.folder;
		this.activeItems.push(item);
		return item;
	}

	RemoveItem(targetItem: BasePart) {
		const index = this.activeItems.findIndex((item) => item === targetItem);

		if (index === -1) {
			error(targetItem + " not found in " + this.activeItems);
		}

		const item = this.activeItems.remove(index);
		item!.Parent = undefined;
		this.standbyItems.push(item!);
	}
}
