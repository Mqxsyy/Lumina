import Roact, { useRef } from "@rbxts/roact";
import { SetLifetime as SetLifetimeAPI, SetLifetimeFieldNames } from "API/Nodes/Initialize/SetLifetime";
import NumberFieldConnectionIn from "Components/NodeFields/NumberFieldConnectionIn";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateSetLifetime() {
	return AddNode(new SetLifetimeAPI(), (data: NodeData) => {
		return <SetLifetime key={`node_${data.node.id}`} data={data} />;
	});
}

function SetLifetime({ data }: { data: NodeData }) {
	const timeFieldRef = useRef((data.node as SetLifetimeAPI).nodeFields.time);

	return (
		<Node Name="Set Lifetime" Id={data.node.id} AnchorPoint={data.anchorPoint}>
			<NumberFieldConnectionIn
				NodeId={data.node.id}
				NodeFieldName={SetLifetimeFieldNames.time}
				NodeAbsolutePosition={data.anchorPoint}
				DefaultText={tostring(timeFieldRef.current.GetNumber())}
				InputDisabled={timeFieldRef.current.boundNode !== undefined}
				NumberChanged={timeFieldRef.current.SetNumber}
				BindFunction={timeFieldRef.current.BindNumber}
				UnbindFunction={timeFieldRef.current.UnbindNumber}
			/>
		</Node>
	);
}
