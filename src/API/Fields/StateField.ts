import type { FieldState } from "API/Nodes/FieldStates";
import type { Src } from "API/VFXScriptCreator";
import { NodeField } from "./NodeField";

interface SerializedData {
    currentState: string;
}

export class StateField extends NodeField {
    readonly stateCollection: FieldState;
    currentState: string;

    constructor(stateCollection: FieldState, currentState: string) {
        super();
        this.stateCollection = stateCollection;
        this.currentState = currentState;
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
        src.value += `${fieldPath}.SetOrientation(${this.currentState}) \n`;
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
