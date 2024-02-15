export class Event {
	bindableEvent: BindableEvent;

	constructor() {
		this.bindableEvent = new Instance("BindableEvent");
	}

	Connect(callback: (...args: unknown[]) => void) {
		return this.bindableEvent.Event.Connect(callback);
	}

	Fire(...args: unknown[]) {
		this.bindableEvent.Fire(...args);
	}

	Destroy() {
		this.bindableEvent.Destroy();
	}
}
