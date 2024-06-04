import { RunService } from "@rbxts/services";
import { StateField } from "API/Fields/StateField";
import { NodeGroups } from "API/NodeGroup";
import type { Src } from "API/VFXScriptCreator";
import { PropertyType } from "../FieldStates";
import { AutoGenLogicNode, LogicNode } from "./LogicNode";

let Selection: Selection | undefined;
if (RunService.IsStudio()) {
    Selection = game.GetService("Selection");
}

export const GetParentPropertyName = "GetParentProperty";
export const GetParentPropertyFieldNames = {
    propertyType: "propertyType",
};

export class GetParentProperty extends LogicNode {
    nodeGroup: NodeGroups = NodeGroups.Logic;
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

    GetNodeName(): string {
        return GetParentPropertyName;
    }

    GetAutoGenerationCode(src: Src, wrapper: string) {
        AutoGenLogicNode(
            this,
            src,
            wrapper,
            (varName) => {
                this.nodeFields.propertyType.AutoGenerateField(`${varName}.nodeFields.propertyType`, src);
            },
            "script.Parent",
        );
    }
}
