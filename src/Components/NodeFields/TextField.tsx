import Roact, { useRef } from "@rbxts/roact";
import { StyleColors } from "Style";
import { ConnectionPointOut } from "./ConnectionPoint/ConnectionPointOut";

export const TextField = ({ ZIndex }: NodeFieldProps) => {
	const fieldRef = useRef(undefined as TextLabel | undefined);

	return (
		<textlabel
			Size={new UDim2(1, 0, 0, 20)}
			BackgroundTransparency={1}
			Text={"TEXT FIELD"}
			TextColor3={StyleColors.hex100}
			ZIndex={ZIndex}
			ref={fieldRef}
		>
			<ConnectionPointOut ZIndex={ZIndex + 1} field={fieldRef.current as TextLabel} />
		</textlabel>
	);
};
