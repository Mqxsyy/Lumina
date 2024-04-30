import Roact from "@rbxts/roact";
import { Vector3Field as Vector3FieldAPI } from "API/Fields/Vector3Field";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { NumberInput } from "Components/Basic/NumberInput";
import ConnectionPointIn from "Components/Connections/ConnectionPointIn";
import Div from "Components/Div";
import { GetZoomScale } from "ZoomScale";

interface Props {
	NodeId: number;
	NodeField: Vector3FieldAPI;
	NodeFieldName: string;

	Label: string;
	ValueLabels?: [string, string, string];
	TextToInputRatios?: [number, number, number];

	AllowConnections?: [boolean, boolean, boolean];
}

export function Vector3Field({
	NodeId,
	NodeField,
	NodeFieldName,
	Label,
	ValueLabels = ["X", "Y", "Z"],
	TextToInputRatios = [0.15, 0.15, 0.15],
	AllowConnections = [true, true, true],
}: Props) {
	const zoomScale = GetZoomScale();

	return (
		<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
			<uilistlayout FillDirection="Vertical" Padding={new UDim(0, 5 * zoomScale)} />

			<BasicTextLabel Size={new UDim2(0.5, 0, 0, 20)} Text={Label} />
			<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
				<uilistlayout FillDirection="Vertical" Padding={new UDim(0, 5 * zoomScale)} />
				<uipadding PaddingLeft={new UDim(0, 10)} />

				<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
					<uilistlayout
						FillDirection="Horizontal"
						VerticalAlignment={"Center"}
						Padding={new UDim(0, 5 * zoomScale)}
					/>

					{AllowConnections[0] && (
						<ConnectionPointIn
							NodeId={NodeId}
							NodeFieldName={NodeFieldName}
							BindFunction={NodeField.BindX}
							UnbindFunction={NodeField.UnbindX}
						/>
					)}
					<Div Size={new UDim2(1, AllowConnections[0] ? -19 * zoomScale : 0, 0, 0)} AutomaticSize="Y">
						<BasicTextLabel
							Size={new UDim2(TextToInputRatios[0], 0, 0, 20)}
							Text={ValueLabels[0]}
							TextYAlignment="Bottom"
						/>
						<NumberInput
							AnchorPoint={new Vector2(1, 0)}
							Position={UDim2.fromScale(1, 0)}
							Size={new UDim2(1 - TextToInputRatios[0], 0, 0, 20)}
							Text={() => tostring(NodeField.GetX())}
							AllowNegative={true}
							NumberChanged={NodeField.SetX}
						/>
					</Div>
				</Div>
				<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
					<uilistlayout
						FillDirection="Horizontal"
						VerticalAlignment={"Center"}
						Padding={new UDim(0, 5 * zoomScale)}
					/>

					{AllowConnections[1] && (
						<ConnectionPointIn
							NodeId={NodeId}
							NodeFieldName={NodeFieldName}
							BindFunction={NodeField.BindY}
							UnbindFunction={NodeField.UnbindY}
						/>
					)}
					<Div Size={new UDim2(1, AllowConnections[1] ? -19 * zoomScale : 0, 0, 0)} AutomaticSize="Y">
						<BasicTextLabel
							Size={new UDim2(TextToInputRatios[1], 0, 0, 20)}
							Text={ValueLabels[1]}
							TextYAlignment="Bottom"
						/>
						<NumberInput
							AnchorPoint={new Vector2(1, 0)}
							Position={UDim2.fromScale(1, 0)}
							Size={new UDim2(1 - TextToInputRatios[1], 0, 0, 20)}
							Text={() => tostring(NodeField.GetY())}
							AllowNegative={true}
							NumberChanged={NodeField.SetY}
						/>
					</Div>
				</Div>
				<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
					<uilistlayout
						FillDirection="Horizontal"
						VerticalAlignment={"Center"}
						Padding={new UDim(0, 5 * zoomScale)}
					/>

					{AllowConnections[2] && (
						<ConnectionPointIn
							NodeId={NodeId}
							NodeFieldName={NodeFieldName}
							BindFunction={NodeField.BindZ}
							UnbindFunction={NodeField.UnbindZ}
						/>
					)}
					<Div Size={new UDim2(1, AllowConnections[2] ? -19 * zoomScale : 0, 0, 0)} AutomaticSize="Y">
						<BasicTextLabel
							Size={new UDim2(TextToInputRatios[2], 0, 0, 20)}
							Text={ValueLabels[2]}
							TextYAlignment="Bottom"
						/>
						<NumberInput
							AnchorPoint={new Vector2(1, 0)}
							Position={UDim2.fromScale(1, 0)}
							Size={new UDim2(1 - TextToInputRatios[2], 0, 0, 20)}
							Text={() => tostring(NodeField.GetZ())}
							AllowNegative={true}
							NumberChanged={NodeField.SetZ}
						/>
					</Div>
				</Div>
			</Div>
		</Div>
	);
}
