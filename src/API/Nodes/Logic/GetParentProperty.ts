import { RunService } from "@rbxts/services";
import { StateField } from "API/Fields/StateField";
import { LowerFirstLetter } from "API/Lib";
import type { Src } from "API/VFXScriptCreator";
import { PropertyType } from "../FieldStates";
import { LogicNode } from "./LogicNode";

let Selection: Selection | undefined;
if (RunService.IsStudio()) {
    Selection = game.GetService("Selection");
}

export class GetParentProperty extends LogicNode {
    static className = "GetParentProperty";

    nodeFields = {
        propertyType: new StateField(PropertyType, PropertyType.Position),
    };

    parent: BasePart | undefined;
    temporaryParent: BasePart | undefined;

    constructor(parent?: BasePart) {
        super();
        this.parent = parent;
    }

    Calculate = () => {
        if (this.parent === undefined) {
            if (this.temporaryParent === undefined) return Vector3.zero;
            return this.GetProperty(this.temporaryParent);
        }

        return this.GetProperty(this.parent);
    };

    GetProperty(part: BasePart) {
        const propertyType = this.nodeFields.propertyType.GetState();

        switch (propertyType) {
            case PropertyType.Position:
                return part.Position;
            case PropertyType.Size:
                return part.Size;
            case PropertyType.Rotation:
                return part.Rotation;
            case PropertyType.LookVector:
                return part.CFrame.LookVector;
            case PropertyType.RightVector:
                return part.CFrame.RightVector;
            case PropertyType.UpVector:
                return part.CFrame.UpVector;
        }

        return Vector3.zero as never;
    }

    SetTemporaryParent() {
        if (Selection === undefined) return;
        const selected = Selection.Get();

        if (selected.size() === 0) {
            warn("No objects selected, please select one");
            return;
        }

        if (selected.size() > 1) {
            warn("Multiple objects selected, please select only one");
            return;
        }

        const selectedPart = selected[0];
        if (selectedPart.IsA("BasePart")) {
            this.temporaryParent = selectedPart;
        } else {
            warn("Selected object is not a BasePart");
        }
    }

    GetClassName(): string {
        return GetParentProperty.className;
    }

    GetAutoGenerationCode(src: Src, wrapper: string) {
        const nodeName = this.GetClassName();

        const className = `${nodeName}${this.id}`;
        const varName = `${LowerFirstLetter(nodeName)}${this.id}`;

        if (string.match(src.value, className)[0] === undefined) {
            src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "${this.GetNodeFolderName()}", "${nodeName}").${nodeName} \n`;
            src.value += `local ${varName} = ${className}.new() \n\n`;

            for (const [fieldName, fieldValue] of pairs(this.nodeFields)) {
                fieldValue.AutoGenerateField(`${varName}.nodeFields.${fieldName}`, src);
            }

            src.value += `${varName}.parent = script.Parent\n`;

            src.value += "\n";
        }

        src.value += `${wrapper.gsub("%.%.", `${varName}`)[0]}\n`;
    }
}
