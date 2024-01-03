import Roact from "@rbxts/roact";
import { Node } from "Components/Node";

export const PlacedNodes = [] as Roact.Element[];

export function CreateNode() {
	PlacedNodes.push(<Node />);
}

export function DestroyNode() {}
