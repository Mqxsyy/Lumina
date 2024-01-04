import Roact from "@rbxts/roact";
import { Node } from "Components/Node";
import { UIUpdateEvent } from "Events";

export const PlacedNodes = [] as Roact.Element[];

export function CreateNode(position: Vector2) {
	PlacedNodes.push(<Node Position={position} />);
	UIUpdateEvent.Fire();
}

export function DestroyNode() {}
