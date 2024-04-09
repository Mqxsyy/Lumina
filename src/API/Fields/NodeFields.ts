import { BooleanField } from "./BooleanField";
import { ColorField } from "./ColorField";
import { ColorRampField } from "./ColorRampField";
import { LineGraphField } from "./LineGraphField";
import { NumberField } from "./NumberField";
import { OrientationField } from "./OrientationField";
import { Vector2Field } from "./Vector2Field";
import { Vector3Field } from "./Vector3Field";

export type NodeFields =
	| NumberField
	| BooleanField
	| Vector2Field
	| Vector3Field
	| OrientationField
	| ColorField
	| LineGraphField
	| ColorRampField;
