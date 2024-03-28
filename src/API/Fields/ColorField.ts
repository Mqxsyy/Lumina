import { Event } from "API/Bindables/Event";

export class ColorField {
	hue: number;
	saturation: number;
	value: number;

	FieldChanged = new Event();

	constructor(hue: number, saturation: number, value: number) {
		this.hue = hue;
		this.saturation = saturation;
		this.value = value;
	}

	GetColor() {
		return Color3.fromHSV(this.hue, this.saturation, this.value);
	}

	SetHue = (hue: number) => {
		this.hue = hue;
		this.FieldChanged.Fire();
	};

	SetSaturation = (saturation: number) => {
		this.saturation = saturation;
		this.FieldChanged.Fire();
	};

	SetValue = (value: number) => {
		this.value = value;
		this.FieldChanged.Fire();
	};
}
