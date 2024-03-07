import Roact from "@rbxts/roact";
import { ConstantSpawn as ConstantSpawnAPI } from "API/Nodes/Spawn/ConstantSpawn";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { NumberInput } from "Components/Basic/NumeberInput";
import { Div } from "Components/Div";
import { AddNode, GetNextNodeId, NodeData } from "Services/NodesService";
import { GetMousePositionOnCanvas } from "WidgetHandler";
import { Node } from "../Node";

export function CreateConstantSpawnNode() {
	AddNode({
		data: {
			id: GetNextNodeId(),
			anchorPoint: GetMousePositionOnCanvas(),
			node: new ConstantSpawnAPI(),
		},
		create: (data: NodeData) => {
			return <ConstantSpawn key={data.id} data={data} />;
		},
	});
}

function ConstantSpawn({ data }: { data: NodeData }) {
	const rateChanged = (number: number) => {
		const rateField = (data.node as ConstantSpawnAPI).nodeFields.rate;

		if (number > 1000) {
			rateField.SetValue(1000);
		}

		rateField.SetValue(number);
	};

	return (
		<Node Name="Constant Spawn" Id={data.id} AnchorPoint={data.anchorPoint}>
			<uipadding PaddingLeft={new UDim(0, 10)} />

			<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
				<BasicTextLabel Size={new UDim2(0.25, 0, 0, 20)} Text={"Rate"} />
				<NumberInput
					Position={UDim2.fromScale(0.25, 0)}
					Size={new UDim2(0.75, 0, 0, 20)}
					PlaceholderText={"..."}
					Text="20"
					NumberChanged={rateChanged}
				/>
			</Div>
		</Node>
	);
}
