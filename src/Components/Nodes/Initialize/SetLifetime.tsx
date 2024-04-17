import Roact, { useRef } from "@rbxts/roact";
import { SetLifetime as SetLifetimeAPI, SetLifetimeFieldNames } from "API/Nodes/Initialize/SetLifetime";
import ConnectionPointIn from "Components/Connections/ConnectionPointIn";
import Div from "Components/Div";
import { NumberField } from "Components/NodeFields/NumberField";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateSetLifetime() {
	return AddNode(new SetLifetimeAPI(), (data: NodeData) => {
		return <SetLifetime key={data.id} data={data} />;
	});
}

function SetLifetime({ data }: { data: NodeData }) {
	const timeFieldRef = useRef((data.node as SetLifetimeAPI).nodeFields.time);

	return (
		<Node Name="Set Lifetime" Id={data.id} AnchorPoint={data.anchorPoint}>
			<uipadding PaddingLeft={new UDim(0, 10)} />

			<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
				<uilistlayout FillDirection="Horizontal" Padding={new UDim(0, 5)} />

				<ConnectionPointIn
					Size={UDim2.fromOffset(20, 20)}
					NodeId={data.id}
					NodeFieldName={SetLifetimeFieldNames.time}
					NodeAbsolutePosition={data.anchorPoint}
					BindFunction={timeFieldRef.current.BindNumber}
					UnbindFunction={timeFieldRef.current.UnbindNumber}
				/>
				<NumberField
					Size={new UDim2(1, -25, 0, 0)}
					Label={"Time"}
					DefaultText={tostring(timeFieldRef.current.GetNumber())}
					TextToInputRatio={0.3}
					Disabled={timeFieldRef.current.boundNode !== undefined}
					NumberChanged={timeFieldRef.current.SetNumber}
				/>
			</Div>
		</Node>
	);
}
