import { Event } from "API/Bindables/Event";
import type { LogicNode } from "API/Nodes/Logic/LogicNode";
import type { Src } from "API/VFXScriptCreator";
import { NodeField } from "./NodeField";

interface SerializedData {
    boolean: boolean;
}

export class BooleanField extends NodeField {
    boolean: boolean;
    boundNode: undefined | LogicNode;
    private boundFunction: undefined | (() => boolean);

    FieldChanged = new Event();

    constructor(boolean: boolean) {
        super();
        this.boolean = boolean;
    }

    GetBoolean() {
        if (this.boundFunction !== undefined) {
            return this.boundFunction();
        }

        return this.boolean;
    }

    SetBoolean = (boolean: boolean) => {
        this.boolean = boolean;
        this.boundFunction = undefined;
        this.boundNode = undefined;
        this.FieldChanged.Fire();
    };

    BindBoolean = (boundFunction: (() => boolean) | undefined, boundNode: LogicNode | undefined) => {
        this.boundFunction = boundFunction;
        this.boundNode = boundNode;
        this.FieldChanged.Fire();
    };

    AutoGenerateField(fieldPath: string, src: Src) {
        src.value += `${fieldPath}.SetBoolean(${this.boolean}) \n`;
    }

    SerializeData() {
        return {
            boolean: this.boolean,
        };
    }

    ReadSerializedData(data: SerializedData) {
        this.SetBoolean((data as SerializedData).boolean);
    }
}
