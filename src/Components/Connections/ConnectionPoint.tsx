import Roact, { useState } from "@rbxts/roact";
import { Div } from "Components/Div";
import { StyleColors } from "Style";
import { CreateConnection } from "./Connection";
import { RemoveConnection } from "Services/ConnectionsService";

interface Props {
	AnchorPoint?: Vector2;
	Position?: UDim2;
	Size?: UDim2;
}

export default function ConnectionPoint({
	AnchorPoint = new Vector2(0, 0),
	Position = UDim2.fromScale(0, 0),
	Size = UDim2.fromScale(1, 1),
}: Props) {
	const [connectionId, setConnectionId] = useState(-1);

	const onMouseButton1Down = () => {
		if (connectionId !== -1) {
			RemoveConnection(connectionId);
			setConnectionId(-1);
			return;
		}

		setConnectionId(CreateConnection().id);
	};

	return (
		<textbutton
			AnchorPoint={AnchorPoint}
			Position={Position}
			Size={Size}
			SizeConstraint="RelativeYY"
			BackgroundTransparency={1}
			AutoButtonColor={false}
			Text={""}
			Active={true}
			Event={{
				InputBegan: (_, input) => {
					if (input.UserInputType === Enum.UserInputType.MouseButton1) {
						onMouseButton1Down();
					}
				},
			}}
		>
			<uipadding
				PaddingBottom={new UDim(0, 5)}
				PaddingLeft={new UDim(0, 5)}
				PaddingRight={new UDim(0, 5)}
				PaddingTop={new UDim(0, 5)}
			/>

			<Div Size={UDim2.fromOffset(Size.X.Offset - 10, Size.Y.Offset - 10)} SizeConstaint="RelativeYY">
				<uicorner CornerRadius={new UDim(2, 0)} />
				<uistroke Color={StyleColors.Highlight} Thickness={2} />
				<uipadding
					PaddingBottom={new UDim(0, 2)}
					PaddingLeft={new UDim(0, 2)}
					PaddingRight={new UDim(0, 2)}
					PaddingTop={new UDim(0, 2)}
				/>

				{connectionId !== -1 ? (
					<frame
						Size={UDim2.fromOffset(Size.X.Offset - 14, Size.Y.Offset - 14)}
						BackgroundColor3={StyleColors.Highlight}
					>
						<uicorner CornerRadius={new UDim(2, 0)} />
					</frame>
				) : undefined}
			</Div>
		</textbutton>
	);
}
