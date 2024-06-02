import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { ConnectableVector2Field } from "API/Fields/ConnectableVector2Field";
import { StateField } from "API/Fields/StateField";
import { Rand, RoundDecimal } from "API/Lib";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { NodeGroups } from "../../NodeGroup";
import { AxisType, CalculationType } from "../FieldStates";
import { IsAxisX, IsAxisY, IsAxisZ } from "../FieldStatesLib";
import { AutoGenInitializeNode, InitializeNode } from "./InitializeNode";

export const SetSizeName = "SetSize";
export const SetSizeFieldNames = {
    calculationType: "calculationType",
    axisType: "axisType",
    size: "size",
    sizeX: "sizeX",
    sizeY: "sizeY",
    sizeZ: "sizeZ",
    range: "range",
    rangeX: "rangeX",
    rangeY: "rangeY",
    rangeZ: "rangeZ",
};

export class SetSize extends InitializeNode {
    nodeGroup: NodeGroups = NodeGroups.Initialize;
    nodeFields = {
        calculationType: new StateField(CalculationType, CalculationType.Uniform),
        axisType: new StateField(AxisType, AxisType.XYZ, [AxisType.X, AxisType.Y, AxisType.Z]),
        size: new ConnectableNumberField(1),
        sizeX: new ConnectableNumberField(1),
        sizeY: new ConnectableNumberField(1),
        sizeZ: new ConnectableNumberField(1),
        range: new ConnectableVector2Field(0.5, 1),
        rangeX: new ConnectableVector2Field(0.5, 1),
        rangeY: new ConnectableVector2Field(0.5, 1),
        rangeZ: new ConnectableVector2Field(0.5, 1),
    };

    Initialize(data: ParticleData) {
        const calculationType = this.nodeFields.calculationType.GetState();
        if (calculationType === CalculationType.UniformConnected) {
            const size = this.nodeFields.size.GetNumber(data);
            data.sizeNormal = new Vector3(size, size, size);
            return;
        }

        if (calculationType === CalculationType.RandomConncted) {
            const range = this.nodeFields.range.GetSimpleVector2(data);
            const size = RoundDecimal(Rand.NextNumber(range.x, range.y), 0.01);
            data.sizeNormal = new Vector3(size, size, size);
            return;
        }

        const axisType = this.nodeFields.axisType.GetState();
        let x = 0;
        let y = 0;
        let z = 0;

        if (IsAxisX(axisType)) {
            if (calculationType === CalculationType.Uniform) {
                x = this.nodeFields.sizeX.GetNumber(data);
            } else {
                const range = this.nodeFields.rangeX.GetSimpleVector2(data);
                x = RoundDecimal(Rand.NextNumber(range.x, range.y), 0.01);
            }
        }

        if (IsAxisY(axisType)) {
            if (calculationType === CalculationType.Uniform) {
                y = this.nodeFields.sizeY.GetNumber(data);
            } else {
                const range = this.nodeFields.rangeY.GetSimpleVector2(data);
                y = RoundDecimal(Rand.NextNumber(range.x, range.y), 0.01);
            }
        }

        if (IsAxisZ(axisType)) {
            if (calculationType === CalculationType.Uniform) {
                z = this.nodeFields.sizeZ.GetNumber(data);
            } else {
                const range = this.nodeFields.rangeZ.GetSimpleVector2(data);
                z = RoundDecimal(Rand.NextNumber(range.x, range.y), 0.01);
            }
        }

        data.sizeNormal = new Vector3(x, y, z);
    }

    GetNodeName(): string {
        return SetSizeName;
    }

    GetAutoGenerationCode(src: Src) {
        AutoGenInitializeNode(this, src, (varName) => {
            this.nodeFields.calculationType.AutoGenerateField(`${varName}.nodeFields.calculationType`, src);
            this.nodeFields.axisType.AutoGenerateField(`${varName}.nodeFields.axisType`, src);

            const axisType = this.nodeFields.axisType.GetState();
            const calculationType = this.nodeFields.calculationType.GetState();

            if (calculationType === CalculationType.UniformConnected) {
                this.nodeFields.size.AutoGenerateField(`${varName}.nodeFields.size`, src);
            }

            if (calculationType === CalculationType.Uniform) {
                if (IsAxisX(axisType)) this.nodeFields.sizeX.AutoGenerateField(`${varName}.nodeFields.sizeX`, src);
                if (IsAxisY(axisType)) this.nodeFields.sizeY.AutoGenerateField(`${varName}.nodeFields.sizeY`, src);
                if (IsAxisZ(axisType)) this.nodeFields.sizeZ.AutoGenerateField(`${varName}.nodeFields.sizeZ`, src);
            }

            if (calculationType === CalculationType.RandomConncted) {
                this.nodeFields.range.AutoGenerateField(`${varName}.nodeFields.range`, src);
            }

            if (calculationType === CalculationType.Random) {
                if (IsAxisX(axisType)) this.nodeFields.rangeX.AutoGenerateField(`${varName}.nodeFields.rangeX`, src);
                if (IsAxisY(axisType)) this.nodeFields.rangeY.AutoGenerateField(`${varName}.nodeFields.rangeY`, src);
                if (IsAxisZ(axisType)) this.nodeFields.rangeZ.AutoGenerateField(`${varName}.nodeFields.rangeZ`, src);
            }
        });
    }
}
