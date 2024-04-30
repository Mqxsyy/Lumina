import Roact from "@rbxts/roact";
import { TextInput } from "Components/Basic/TextInput";
import Div from "../Div";

interface Props {
	TextChanged: (text: string) => void;
}

export function NodeSearchInput({ TextChanged }: Props) {
	return (
		<Div Size={new UDim2(1, 0, 0, 25)}>
			<uipadding PaddingTop={new UDim(0, 5)} PaddingLeft={new UDim(0.05, 5)} PaddingRight={new UDim(0.05, 5)} />

			<TextInput
				PlaceholderText={"Search..."}
				TextXAlignment={Enum.TextXAlignment.Center}
				ClearTextOnFocus={false}
				AutoFocus={true}
				TextChanged={TextChanged}
				IsAffectedByZoom={false}
			/>
		</Div>
	);
}
