import Roact from "@rbxts/roact";
import { Div } from "../Div";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";

interface Props {
	Text: string;
}

export function NodeSelectionLabel({ Text }: Props) {
	return (
		<Div Size={new UDim2(1, 0, 0, 25)}>
			<BasicTextLabel Text={Text} TextXAlignment={Enum.TextXAlignment.Center} IsAffectedByZoom={false} />
		</Div>
	);
}
