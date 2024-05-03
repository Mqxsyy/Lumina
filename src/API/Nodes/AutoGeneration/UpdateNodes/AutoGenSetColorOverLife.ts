import { SetColorOverLife } from "API/Nodes/Update/SetColorOverLife";

export function AutoGenSetColorOverLife(node: SetColorOverLife) {
    const className = `SetColorOverLife${node.id}`;
    const varName = `setColorOverLife${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Update", "SetColorOverLife").SetColorOverLife \n`;
    src += `local ${varName} = ${className}.new() \n`;

    const startPoint = node.nodeFields.ramp.startPoint.color;
    src += `${varName}.nodeFields.ramp.startPoint.color.SetHSV(${startPoint.hue}, ${startPoint.saturation}, ${startPoint.value}) \n`;
    const endPoint = node.nodeFields.ramp.endPoint.color;
    src += `${varName}.nodeFields.ramp.endPoint.color.SetHSV(${endPoint.hue}, ${endPoint.saturation}, ${endPoint.value}) \n`;

    const rampPoints = node.nodeFields.ramp.GetPoints();
    for (const point of rampPoints) {
        src += `${varName}.nodeFields.ramp:AddPoint(${point.time}, Vector3.new(${point.color.hue}, ${point.color.saturation}, ${point.color.value})) \n`;
    }

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
