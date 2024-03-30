import { IdPool } from "API/IdPool";
import { LerpNumber } from "API/Lib";

export interface GraphPoint {
	id: number;
	time: number;
	value: number;
}

export class LineGraphField {
	idPool = new IdPool();

	startPoint: GraphPoint = {
		id: this.idPool.GetNextId(),
		time: 0,
		value: 0,
	};

	endPoint: GraphPoint = {
		id: this.idPool.GetNextId(),
		time: 1,
		value: 1,
	};

	graphPoints: GraphPoint[] = [];

	GetPoints() {
		return this.graphPoints;
	}

	GetValue(t: number) {
		if (this.graphPoints.size() === 0) {
			return LerpNumber(this.startPoint.value, this.endPoint.value, t);
		}

		let lastPoint = this.startPoint;
		for (const point of this.graphPoints) {
			if (t < point.time) {
				return LerpNumber(lastPoint.value, point.value, (t - lastPoint.time) / (point.time - lastPoint.time));
			}

			lastPoint = point;
		}

		return LerpNumber(
			lastPoint.value,
			this.endPoint.value,
			(t - lastPoint.time) / (this.endPoint.time - lastPoint.time),
		);
	}

	AddGraphPoint(time: number, value: number) {
		const data = { id: this.idPool.GetNextId(), time, value };
		this.graphPoints.push(data);
		this.graphPoints.sort((a, b) => a.time < b.time);
		return data;
	}

	UpdateGraphPoint(id: number, time: number, value: number) {
		const index = this.graphPoints.findIndex((point) => point.id === id);
		if (index !== -1) {
			this.graphPoints[index].time = time;
			this.graphPoints[index].value = value;
		}
		this.graphPoints.sort((a, b) => a.time < b.time);
	}

	RemoveGraphPoint(id: number) {
		delete this.graphPoints[this.graphPoints.findIndex((point) => point.id === id)];
	}

	GetLargestValue() {
		let largest = this.startPoint.value;

		for (const point of this.graphPoints) {
			if (point.value > largest) {
				largest = point.value;
			}
		}

		if (this.endPoint.value > largest) {
			largest = this.endPoint.value;
		}

		return largest;
	}
}
