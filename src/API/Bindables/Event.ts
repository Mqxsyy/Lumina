export class Event<T extends unknown[] = []> {
    bindableEvent: BindableEvent;

    constructor() {
        this.bindableEvent = new Instance("BindableEvent");
    }

    Connect(callback: (...args: T) => void) {
        return this.bindableEvent.Event.Connect(callback);
    }

    Fire(...args: T) {
        this.bindableEvent.Fire(...args);
    }

    Destroy() {
        this.bindableEvent.Destroy();
    }
}
