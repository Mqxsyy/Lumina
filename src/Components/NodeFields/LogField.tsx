import Roact, { useRef } from "@rbxts/roact";
import { ConnectionPointIn } from "./ConnectionPoint/ConnectionPointIn";

export const LogField = ({ ZIndex }: NodeFieldProps) => {
	const fieldRef = useRef(undefined as Frame | undefined);

	return (
		<frame Size={new UDim2(1, 0, 0, 20)} BackgroundTransparency={1} ZIndex={ZIndex} ref={fieldRef}>
			<ConnectionPointIn ZIndex={ZIndex + 1} field={fieldRef.current as Frame} />
		</frame>
	);
};
