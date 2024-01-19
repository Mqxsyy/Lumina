import Roact, { useEffect } from "@rbxts/roact";

interface Props {
	abc: UDim2;
}

export function TestComp({ abc }: Props) {
	useEffect(() => {
		print(abc);
	}, [abc]);

	return <textlabel Text={tostring(abc.X.Offset)} />;
}
