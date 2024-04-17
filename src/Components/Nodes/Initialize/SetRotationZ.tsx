import Roact, { useRef } from "@rbxts/roact";
import { SetRotationZ as SetRotationZAPI, SetRotationZFieldNames } from "API/Nodes/Initialize/SetRotationZ";
import ConnectionPointIn from "Components/Connections/ConnectionPointIn";
import Div from "Components/Div";
import { NumberField } from "Components/NodeFields/NumberField";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";
import NumberFieldConnectionIn from "Components/NodeFields/NumberFieldConnectionIn";

export function CreateSetRotationZ() {
	return AddNode(new SetRotationZAPI(), (data: NodeData) => {
		return <SetRotationZ key={data.id} data={data} />;
	});
}

function SetRotationZ({ data }: { data: NodeData }) {
	const rotationFieldRef = useRef((data.node as SetRotationZAPI).nodeFields.rotation);

	return (
		<Node Name="Set Rotation Z" Id={data.id} AnchorPoint={data.anchorPoint}>
			<NumberFieldConnectionIn
				NodeId={data.id}
				NodeFieldName={SetRotationZFieldNames.rotation}
				NodeAbsolutePosition={data.anchorPoint}
				DefaultText={tostring(rotationFieldRef.current.GetNumber())}
				InputDisabled={rotationFieldRef.current.boundNode !== undefined}
				NumberChanged={rotationFieldRef.current.SetNumber}
				BindFunction={rotationFieldRef.current.BindNumber}
				UnbindFunction={rotationFieldRef.current.UnbindNumber}
			/>
		</Node>
	);
}
