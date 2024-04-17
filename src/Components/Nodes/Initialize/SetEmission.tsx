import Roact, { useRef } from "@rbxts/roact";
import { SetEmission as SetEmissionAPI, SetEmissionFieldNames } from "API/Nodes/Initialize/SetEmission";
import ConnectionPointIn from "Components/Connections/ConnectionPointIn";
import Div from "Components/Div";
import { NumberField } from "Components/NodeFields/NumberField";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";
import NumberFieldConnectionIn from "Components/NodeFields/NumberFieldConnectionIn";

export function CreateSetEmission() {
	return AddNode(new SetEmissionAPI(), (data: NodeData) => {
		return <SetEmission key={data.id} data={data} />;
	});
}

function SetEmission({ data }: { data: NodeData }) {
	const emissionFieldRef = useRef((data.node as SetEmissionAPI).nodeFields.emission);

	return (
		<Node Name="Set Emission" Id={data.id} AnchorPoint={data.anchorPoint}>
			<NumberFieldConnectionIn
				NodeId={data.id}
				NodeFieldName={SetEmissionFieldNames.emission}
				NodeAbsolutePosition={data.anchorPoint}
				DefaultText={tostring(emissionFieldRef.current.GetNumber())}
				InputDisabled={emissionFieldRef.current.boundNode !== undefined}
				NumberChanged={emissionFieldRef.current.SetNumber}
				BindFunction={emissionFieldRef.current.BindNumber}
				UnbindFunction={emissionFieldRef.current.UnbindNumber}
			/>
		</Node>
	);
}
