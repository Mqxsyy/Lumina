export class ObjectPool {
    create: () => Instance;

    activeItems: Instance[];
    standbyItems: Instance[];

    constructor(create: () => Instance) {
        this.create = create;

        this.activeItems = [];
        this.standbyItems = [];
    }

    Pregenerate(amount: number) {
        for (let i = 0; i < amount; i++) {
            const item = this.create();
            this.standbyItems.push(item);
        }
    }

    GetItem() {
        let item = this.standbyItems.pop();

        if (item === undefined) {
            item = this.create();
        }

        this.activeItems.push(item);
        return item;
    }

    RemoveItem(targetItem: Instance) {
        const index = this.activeItems.findIndex((item) => item === targetItem);

        if (index === -1) {
            error(`${targetItem} not found in ${this.activeItems}`);
        }

        const item = this.activeItems.remove(index);
        this.standbyItems.push(item as Instance);
    }

    ClearStandby() {
        for (const item of this.standbyItems) {
            item.Destroy();
        }

        this.standbyItems = [];
    }
}
