import Roact, { useRef } from "@rbxts/roact";
import { AddRotationZ as AddRotationZAPI, AddRotationZFieldNames } from "API/Nodes/Update/AddRotationZ";
import ConnectionPointIn from "Components/Connections/ConnectionPointIn";
import Div from "Components/Div";
import { NumberField } from "Components/NodeFields/NumberField";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateAddRotationZ() {
	return AddNode(new AddRotationZAPI(), (data: NodeData) => {
		return <AddRotationZ data={data} />;
	});
}

function AddRotationZ({ data }: { data: NodeData }) {
	const rotationFieldRef = useRef((data.node as AddRotationZAPI).nodeFields.rotation);

	return (
		<Node Name="Add Rotation Z" Id={data.id} AnchorPoint={data.anchorPoint}>
			<uipadding PaddingLeft={new UDim(0, 10)} />

			<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
				<uilistlayout FillDirection="Horizontal" Padding={new UDim(0, 5)} />

				<ConnectionPointIn
					Size={UDim2.fromOffset(20, 20)}
					NodeId={data.id}
					NodeFieldName={AddRotationZFieldNames.rotation}
					NodeAbsolutePosition={data.anchorPoint}
					BindFunction={rotationFieldRef.current.BindNumber}
					UnbindFunction={rotationFieldRef.current.UnbindNumber}
				/>
				<NumberField
					Size={new UDim2(1, -25, 0, 0)}
					Label={"Rotation"}
					DefaultText={tostring(rotationFieldRef.current.GetNumber())}
					NumberChanged={rotationFieldRef.current.SetNumber}
					Disabled={rotationFieldRef.current.boundNode !== undefined}
				/>
			</Div>
		</Node>
	);
}
