import { IdPool } from "API/IdPool";
import { ColorField } from "./ColorField";
import { Event } from "API/Bindables/Event";

// BUG: last frame sometimes diff color (white?)

export interface ColorPoint {
	id: number;
	time: number;
	color: ColorField;
}

export class ColorRampField {
	idPool = new IdPool();

	FieldChanged = new Event();

	startPoint: ColorPoint = {
		id: this.idPool.GetNextId(),
		time: 0,
		color: new ColorField(0, 0, 1),
	};

	endPoint: ColorPoint = {
		id: this.idPool.GetNextId(),
		time: 1,
		color: new ColorField(0, 0, 0),
	};

	colorPoints: ColorPoint[] = [];

	GetPoints() {
		return this.colorPoints;
	}

	GetValue(t: number) {
		if (this.colorPoints.size() === 0) {
			return this.startPoint.color.GetColor().Lerp(this.endPoint.color.GetColor(), t);
		}

		let lastPoint = this.startPoint;
		for (const point of this.colorPoints) {
			if (t < point.time) {
				const alpha = (t - lastPoint.time) / (point.time - lastPoint.time);
				return lastPoint.color.GetColor().Lerp(point.color.GetColor(), alpha);
			}

			lastPoint = point;
		}

		const alpha = (t - lastPoint.time) / (this.endPoint.time - lastPoint.time);
		return lastPoint.color.GetColor().Lerp(this.endPoint.color.GetColor(), alpha);
	}

	AddRampPoint(time: number, color: Vector3) {
		const data = { id: this.idPool.GetNextId(), time, color: new ColorField(color.X, color.Y, color.Z) };
		this.colorPoints.push(data);
		this.colorPoints.sort((a, b) => a.time < b.time);
		return data;
	}

	UpdateRampPointTime(id: number, time: number) {
		const index = this.colorPoints.findIndex((point) => point.id === id);
		if (index !== -1) {
			this.colorPoints[index].time = time;
		}
		this.colorPoints.sort((a, b) => a.time < b.time);
	}

	RemoveRampPoint(id: number) {
		delete this.colorPoints[this.colorPoints.findIndex((point) => point.id === id)];
	}
}
