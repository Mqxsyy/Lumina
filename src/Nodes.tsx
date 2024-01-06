import Roact from "@rbxts/roact";
import { Node } from "Components/Node";
import { UIUpdateEvent } from "Events";

export const PlacedNodes = [] as Roact.Element[];

export function CreateNode() {
	PlacedNodes.push(<Node />);
	UIUpdateEvent.Fire();
}

export function DestroyNode() {}
