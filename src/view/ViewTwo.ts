import { Mesh, MeshPhongMaterial, WebGLRenderer, Color, BoxGeometry } from 'three';
import { BaseView } from './BaseView';

export class ViewTwo extends BaseView {
	// all the bars
	bars: Array<Mesh> = [];

	// add one bar
	addBar(x: number): void {
		const bar = new BoxGeometry(0, 50, 0);
		const material = new MeshPhongMaterial({ color: 0xffffff, wireframe: true });
		const tempBar = new Mesh(bar, material);
		tempBar.position.x = x;
		tempBar.position.y = -25;
		this.bars.push(tempBar);
		this.scene.add(tempBar);
	}

	constructor(model: any, renderer: WebGLRenderer) {
		super(model, renderer);

		this.scene.background = new Color(0xffffff);

		// generate bars
		let i = -20;
		while (i < 20) {
			this.addBar(i);
			i += 0.2;
		}
	}

	// move the bar up by scaling up
	up(bar: Mesh): void {
		bar.scale.y += 0.003;
	}

	// move the bar down by scaling down
	down(bar: Mesh): void {
		bar.scale.y -= 0.003;
	}

	// updating the bars size
	update(): void {
		this.bars.forEach((bar) => {
			if (Math.random() > 0.7) {
				// random number between 0 and 1
				// it is 0.501 because we need the bars lower in general after a lot of trials
				Math.random() > 0.501 ? this.up(bar) : this.down(bar);
			}
		});
	}
}
