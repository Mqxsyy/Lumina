import Roact, { useRef } from "@rbxts/roact";
import { SetEmission as SetEmissionAPI, SetEmissionFieldNames } from "API/Nodes/Initialize/SetEmission";
import NumberFieldConnectionIn from "Components/NodeFields/NumberFieldConnectionIn";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateSetEmission() {
	return AddNode(new SetEmissionAPI(), (data: NodeData) => {
		return <SetEmission key={`node_${data.node.id}`} data={data} />;
	});
}

function SetEmission({ data }: { data: NodeData }) {
	const emissionFieldRef = useRef((data.node as SetEmissionAPI).nodeFields.emission);

	return (
		<Node Name="Set Emission" Id={data.node.id} AnchorPoint={data.anchorPoint}>
			<NumberFieldConnectionIn
				NodeId={data.node.id}
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
