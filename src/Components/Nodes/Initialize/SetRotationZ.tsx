import Roact, { useRef } from "@rbxts/roact";
import { SetRotationZ as SetRotationZAPI, SetRotationZFieldNames } from "API/Nodes/Initialize/SetRotationZ";
import ConnectionPointIn from "Components/Connections/ConnectionPointIn";
import Div from "Components/Div";
import { NumberField } from "Components/NodeFields/NumberField";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateSetRotationZ() {
	return AddNode(new SetRotationZAPI(), (data: NodeData) => {
		return <SetRotationZ key={data.id} data={data} />;
	});
}

function SetRotationZ({ data }: { data: NodeData }) {
	const rotationFieldRef = useRef((data.node as SetRotationZAPI).nodeFields.rotation);

	return (
		<Node Name="Set Rotation Z" Id={data.id} AnchorPoint={data.anchorPoint}>
			<uipadding PaddingLeft={new UDim(0, 10)} />

			<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
				<uilistlayout FillDirection="Horizontal" Padding={new UDim(0, 5)} />

				<ConnectionPointIn
					Size={UDim2.fromOffset(20, 20)}
					NodeId={data.id}
					NodeFieldName={SetRotationZFieldNames.rotation}
					NodeAbsolutePosition={data.anchorPoint}
					BindFunction={rotationFieldRef.current.BindNumber}
					UnbindFunction={rotationFieldRef.current.UnbindNumber}
				/>
				<NumberField
					Size={new UDim2(1, -25, 0, 0)}
					Label={"Rotation"}
					DefaultText={tostring(rotationFieldRef.current.GetNumber())}
					TextToInputRatio={0.25}
					Disabled={rotationFieldRef.current.boundNode !== undefined}
					NumberChanged={rotationFieldRef.current.SetNumber}
				/>
			</Div>
		</Node>
	);
}
