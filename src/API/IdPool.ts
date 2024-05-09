export class IdPool {
    private currentId: number;

    constructor() {
        this.currentId = 0;
    }

    GetNextId() {
        return this.currentId++;
    }
}
