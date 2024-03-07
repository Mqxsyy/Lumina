import Roact from "@rbxts/roact";
import { Node } from "../Node";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { AddNode, GetNextNodeId, NodeData } from "Services/NodesService";
import { GetMousePositionOnCanvas } from "WidgetHandler";
import { Lifetime as LifetimeAPI } from "API/Nodes/Initialize/Lifetime";
import { Div } from "Components/Div";
import { NumberInput } from "Components/Basic/NumeberInput";

export function CreateLifetimeNode() {
	AddNode({
		data: {
			id: GetNextNodeId(),
			anchorPoint: GetMousePositionOnCanvas(),
			node: new LifetimeAPI(),
		},
		create: (data: NodeData) => {
			return <Lifetime key={data.id} data={data} />;
		},
	});
}

function Lifetime({ data }: { data: NodeData }) {
	const timeChanged = (number: number) => {
		const timeField = (data.node as LifetimeAPI).nodeFields.time;
		timeField.SetValue(number);
	};

	return (
		<Node Name="Lifetime" Id={data.id} AnchorPoint={data.anchorPoint}>
			<uipadding PaddingLeft={new UDim(0, 10)} />

			<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
				<BasicTextLabel Size={new UDim2(0.25, 0, 0, 20)} Text={"Time"} />
				<NumberInput
					Position={UDim2.fromScale(0.25, 0)}
					Size={new UDim2(0.75, 0, 0, 20)}
					PlaceholderText={"..."}
					Text="1"
					NumberChanged={timeChanged}
				/>
			</Div>
		</Node>
	);
}
