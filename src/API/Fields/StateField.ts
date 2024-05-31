import type { FieldState } from "API/Nodes/FieldStates";
import type { Src } from "API/VFXScriptCreator";
import { NodeField } from "./NodeField";

interface SerializedData {
    currentState: string;
}

export class StateField extends NodeField {
    readonly stateCollection: FieldState;
    currentState: string;

    constructor(stateCollection: FieldState, currentState: string, excludedStates?: string[]) {
        super();

        this.currentState = currentState;

        if (excludedStates === undefined) {
            this.stateCollection = stateCollection;
            return;
        }

        const filteredStateCollection: FieldState = {};
        for (const [k, v] of pairs(stateCollection)) {
            if (excludedStates.findIndex((s) => s === v) !== -1) continue;
            filteredStateCollection[k] = v;
        }

        this.stateCollection = filteredStateCollection;
    }

    GetState() {
        return this.currentState;
    }

    GetStateCollection() {
        return this.stateCollection;
    }

    SetState = (currentState: string) => {
        this.currentState = currentState;
        this.FieldChanged.Fire();
    };

    AutoGenerateField(fieldPath: string, src: Src) {
        src.value += `${fieldPath}.SetState(${this.currentState}) \n`;
    }

    SerializeData() {
        return {
            currentState: this.currentState,
        };
    }

    ReadSerializedData(data: SerializedData) {
        this.SetState(data.currentState);
    }
}
