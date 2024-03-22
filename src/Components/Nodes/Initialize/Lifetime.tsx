import Roact, { useRef } from "@rbxts/roact";
import { Event } from "API/Bindables/Event";
import { Lifetime as LifetimeAPI } from "API/Nodes/Initialize/Lifetime";
import ConnectionPointIn from "Components/Connections/ConnectionPointIn";
import Div from "Components/Div";
import { NumberField } from "Components/NodeFields/NumberField";
import { AddNode, GetNextNodeId, NodeData } from "Services/NodesService";
import { GetMousePositionOnCanvas } from "Windows/MainWindow";
import { Node } from "../Node";

export function CreateLifetimeNode() {
	return AddNode({
		data: {
			id: GetNextNodeId(),
			anchorPoint: GetMousePositionOnCanvas(),
			node: new LifetimeAPI(),
			elementLoaded: new Event(),
		},
		create: (data: NodeData) => {
			return <Lifetime key={data.id} data={data} />;
		},
	});
}

function Lifetime({ data }: { data: NodeData }) {
	const timeFieldRef = useRef((data.node as LifetimeAPI).nodeFields.time);

	const timeChanged = (number: number) => {
		timeFieldRef.current.SetValue(number);
	};

	return (
		<Node Name="Lifetime" Id={data.id} AnchorPoint={data.anchorPoint}>
			<uipadding PaddingLeft={new UDim(0, 10)} />

			<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
				<uilistlayout FillDirection="Horizontal" Padding={new UDim(0, 5)} />

				<ConnectionPointIn Size={UDim2.fromOffset(20, 20)} BindFunction={timeFieldRef.current.BindValue} />
				<NumberField
					Size={new UDim2(1, -25, 0, 0)}
					Label={"Time"}
					DefaultText={"1"}
					PlaceholderText={"..."}
					TextToInputRatio={0.25}
					NumberChanged={timeChanged}
				/>
			</Div>
		</Node>
	);
}
