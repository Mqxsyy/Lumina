import { IdPool } from "API/IdPool";

export interface FastEventConnection {
    Disconnect: () => undefined;
}

export interface FastEventCallback<T extends unknown[]> {
    id: number;
    callback: (...args: T) => void;
}

// isnt there a better way to do these generics...?
// ngl didn't even test so it may be exact same as bindableEvent
export class FastEvent<T extends unknown[] = []> {
    idPool = new IdPool();
    callbacks: FastEventCallback<T>[] = [];

    Connect(callback: (...args: T) => void): FastEventConnection {
        const id = this.idPool.GetNextId();

        this.callbacks.push({
            id,
            callback,
        });

        return {
            Disconnect: () => {
                const index = this.callbacks.findIndex((c) => c.id === id);
                if (index === -1) {
                    warn(`Failed to disconnect FastEvent callback! (Id not found: ${id})`);
                    return;
                }

                this.callbacks.remove(index);
                return undefined;
            },
        };
    }

    Fire(...args: T) {
        for (let i = this.callbacks.size() - 1; i >= 0; i--) {
            const callback = this.callbacks[i];
            callback.callback(...args);
        }
    }
}
