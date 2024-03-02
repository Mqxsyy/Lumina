import Roact from "@rbxts/roact";
import { Node } from "../Node";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { Div } from "Components/Div";
import { NumberInput } from "Components/Basic/NumeberInput";
import { AddNode, GetNextNodeId, NodeData } from "Services/NodesService";
import { GetMousePositionOnCanvas } from "WidgetHandler";
import { Position as PositionAPI } from "API/Nodes/Initialize/Position";

export function CreatePositionNode() {
	AddNode({
		data: {
			id: GetNextNodeId(),
			anchorPoint: GetMousePositionOnCanvas(),
			node: new PositionAPI(),
		},
		create: (data: NodeData) => {
			return <Position key={data.id} data={data} />;
		},
	});
}

function Position({ data }: { data: NodeData }) {
	const xChanged = (number: number) => {
		const positionField = (data.node as PositionAPI).nodeFields.position;
		positionField.SetValueX(number);
	};

	const yChanged = (number: number) => {
		const positionField = (data.node as PositionAPI).nodeFields.position;
		positionField.SetValueY(number);
	};

	const zChanged = (number: number) => {
		const positionField = (data.node as PositionAPI).nodeFields.position;
		positionField.SetValueZ(number);
	};

	return (
		<Node Name="Position" Id={data.id} AnchorPoint={data.anchorPoint}>
			<uipadding PaddingLeft={new UDim(0, 10)} />
			<uilistlayout FillDirection="Vertical" Padding={new UDim(0, 5)} />

			<Div Size={new UDim2(1, 0, 0, 20)}>
				<BasicTextLabel Size={new UDim2(0.25, 0, 0, 20)} Text={"X"} />
				<NumberInput
					Position={UDim2.fromScale(0.25, 0)}
					Size={new UDim2(0.75, 0, 0, 20)}
					PlaceholderText={"..."}
					Text="0"
					AllowNegative={true}
					NumberChanged={xChanged}
				/>
			</Div>

			<Div Size={new UDim2(1, 0, 0, 20)}>
				<BasicTextLabel Size={new UDim2(0.25, 0, 0, 20)} Text={"Y"} />
				<NumberInput
					Position={UDim2.fromScale(0.25, 0)}
					Size={new UDim2(0.75, 0, 0, 20)}
					PlaceholderText={"..."}
					Text="0"
					AllowNegative={true}
					NumberChanged={yChanged}
				/>
			</Div>

			<Div Size={new UDim2(1, 0, 0, 20)}>
				<BasicTextLabel Size={new UDim2(0.25, 0, 0, 20)} Text={"Z"} />
				<NumberInput
					Position={UDim2.fromScale(0.25, 0)}
					Size={new UDim2(0.75, 0, 0, 20)}
					PlaceholderText={"..."}
					Text="0"
					AllowNegative={true}
					NumberChanged={zChanged}
				/>
			</Div>
		</Node>
	);
}
