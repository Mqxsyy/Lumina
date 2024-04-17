import Roact, { useRef } from "@rbxts/roact";
import { SetSize as SetSizeAPI, SetSizeFieldNames } from "API/Nodes/Initialize/SetSize";
import ConnectionPointIn from "Components/Connections/ConnectionPointIn";
import Div from "Components/Div";
import { NumberField } from "Components/NodeFields/NumberField";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateSetSize() {
	return AddNode(new SetSizeAPI(), (data: NodeData) => {
		return <SetSize data={data} />;
	});
}

function SetSize({ data }: { data: NodeData }) {
	const sizeFieldRef = useRef((data.node as SetSizeAPI).nodeFields.size);

	return (
		<Node Name="Set Size" Id={data.id} AnchorPoint={data.anchorPoint}>
			<uipadding PaddingLeft={new UDim(0, 10)} />

			<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
				<uilistlayout FillDirection="Horizontal" Padding={new UDim(0, 5)} />

				<ConnectionPointIn
					Size={UDim2.fromOffset(20, 20)}
					NodeId={data.id}
					NodeFieldName={SetSizeFieldNames.size}
					NodeAbsolutePosition={data.anchorPoint}
					BindFunction={sizeFieldRef.current.BindNumber}
					UnbindFunction={sizeFieldRef.current.UnbindNumber}
				/>
				<NumberField
					Size={new UDim2(1, -25, 0, 0)}
					Label={"Size"}
					DefaultText={tostring(sizeFieldRef.current!.GetNumber())}
					TextToInputRatio={0.25}
					Disabled={sizeFieldRef.current!.boundNode !== undefined}
					NumberChanged={sizeFieldRef.current.SetNumber}
				/>
			</Div>
		</Node>
	);
}
