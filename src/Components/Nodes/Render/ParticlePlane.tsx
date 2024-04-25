import Roact, { useRef } from "@rbxts/roact";
import { ParticlePlane as ParticlePlaneAPI } from "API/Nodes/Render/ParticlePlane";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";
import { Vector2Field } from "Components/NodeFields/Vector2Field";
import { NumberField } from "Components/NodeFields/NumberField";

export function CreateParticlePlane() {
	return AddNode(new ParticlePlaneAPI(1000), (data: NodeData) => {
		return <ParticlePlane key={`node_${data.node.id}`} data={data} />;
	});
}

function ParticlePlane({ data }: { data: NodeData }) {
	const imageIdFieldRef = useRef((data.node as ParticlePlaneAPI).nodeFields.assetId);
	const imageSizeFieldRef = useRef((data.node as ParticlePlaneAPI).nodeFields.imageSize);
	const spriteSheetRowsFieldRef = useRef((data.node as ParticlePlaneAPI).nodeFields.spriteSheetRows);
	const spriteSheetColumnsFieldRef = useRef((data.node as ParticlePlaneAPI).nodeFields.spriteSheetColumns);
	const spriteSheetFrameCountFieldRef = useRef((data.node as ParticlePlaneAPI).nodeFields.spriteSheetFrameCount);

	return (
		<Node Name="Particle Plane" Id={data.node.id} AnchorPoint={data.anchorPoint}>
			<BasicTextLabel Size={new UDim2(1, 0, 0, 20)} Text={"Orientation - Facing camera"} />
			<NumberField
				Label={"Image Id"}
				DefaultText={tostring(imageIdFieldRef.current.GetNumber())}
				TextToInputRatio={0.3}
				NumberChanged={imageIdFieldRef.current.SetNumber}
			/>
			<Vector2Field
				Label="Image Size"
				ValueLabels={["Width", "Height"]}
				DefaultValues={{
					x: imageSizeFieldRef.current.GetX(),
					y: imageSizeFieldRef.current.GetY(),
				}}
				TextToInputRatios={[0.25, 0.25]}
				Vector2Changed={imageSizeFieldRef.current.SetVector2}
			/>
			<NumberField
				Label={"Spritesheet Rows"}
				DefaultText={tostring(spriteSheetRowsFieldRef.current.GetNumber())}
				TextToInputRatio={0.65}
				NumberChanged={spriteSheetRowsFieldRef.current.SetNumber}
			/>
			<NumberField
				Label={"Spritesheet Columns"}
				DefaultText={tostring(spriteSheetColumnsFieldRef.current.GetNumber())}
				TextToInputRatio={0.65}
				NumberChanged={spriteSheetColumnsFieldRef.current.SetNumber}
			/>
			<NumberField
				Label={"Spritesheet Frames"}
				DefaultText={tostring(spriteSheetFrameCountFieldRef.current.GetNumber())}
				TextToInputRatio={0.65}
				NumberChanged={spriteSheetFrameCountFieldRef.current.SetNumber}
			/>
		</Node>
	);
}
