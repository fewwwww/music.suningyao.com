import { Mesh, WebGLRenderer, Color, IcosahedronGeometry, MeshLambertMaterial, Vector3 } from 'three';
import { BaseView } from './BaseView';
import SimplexNoise from 'simplex-noise';

// DOM
const audioDOM = document.getElementsByTagName('audio')[0];
const htmlDOM = document.getElementsByTagName('html')[0];

// audio
let analyser: any;
let dataArray: Uint8Array;

// noise
const noise = new SimplexNoise();

function initAnalyze() {
	// dom may be null -- TS compiler
	if (htmlDOM) {
		// we need an event to get the audio context
		htmlDOM.onclick = function () {
			// web audio api stuffs
			const context = new AudioContext();
			let src = context.createMediaElementSource(audioDOM);
			analyser = context.createAnalyser();
			src.connect(analyser);
			analyser.connect(context.destination);
			analyser.fftSize = 512;
			let bufferLength = analyser.frequencyBinCount;
			dataArray = new Uint8Array(bufferLength);
			// remove the event listener
			htmlDOM.onclick = null;
		};
	}
}

function getAverage(array: Uint8Array) {
	return array.reduce((a, b) => a + b) / array.length;
}

function getMax(array: Uint8Array) {
	return array.reduce((a, b) => (a > b ? a : b));
}

export class ViewOne extends BaseView {
	ball: Mesh;

	// analyze when updating
	analyze() {
		analyser.getByteFrequencyData(dataArray);

		// first halt of array
		var lowerHalfArray = dataArray.slice(0, dataArray.length / 2 - 1);
		// second halt of array
		var upperHalfArray = dataArray.slice(dataArray.length / 2 - 1, dataArray.length - 1);

		// get two average of the two halts
		const lowerAvgFrequency = getAverage(lowerHalfArray) / lowerHalfArray.length;
		const upperMaxFrequency = getMax(upperHalfArray) / upperHalfArray.length;

		// update the ball style
		updateBall(this.ball, lowerAvgFrequency, upperMaxFrequency);
	}

	constructor(model: any, renderer: WebGLRenderer) {
		super(model, renderer);

		initAnalyze();

		this.scene.background = new Color(0xffffff);

		const icosahedronGeometry = new IcosahedronGeometry(1.5, 3);
		const lambertMaterial = new MeshLambertMaterial({
			color: 0x000000,
			wireframe: true,
		});
		this.ball = new Mesh(icosahedronGeometry, lambertMaterial);
		this.ball.position.set(0, 0, 0);
		this.scene.add(this.ball);
	}

	paused(): void {
		if (audioDOM.paused) {
			location.reload();
		}
	}

	update(): void {
		// update ball style
		this.analyze();
		// rotate the ball
		this.ball.rotateX(0.001);
		this.ball.rotateY(0.001);
		this.ball.rotateZ(0.001);
		// refresh the page when audio is played
		this.paused();
	}
}

function updateBall(ball: Mesh, lowFrequency: number, highFrequency: number) {
	const vertices = ball.geometry.attributes.position.array;
	// should be the same as radius of the ball
	const offset = 1.5;
	// amplitude of the update
	const amplitude = 3;
	// loop through the vertices in order of x, y, z, x, y, z, ...
	for (let i = 0; i < vertices.length; i = i + 3) {
		// clock cannot be imported
		const time = window.performance.now();
		// make
		const vertex = new Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
		// normalize the vector
		vertex.normalize();
		// the actual distance from the origin
		const distance =
			offset +
			lowFrequency +
			noise.noise3D(vertex.x + time * 0.00007, vertex.y + time * 0.00008, vertex.z + time * 0.00009) * amplitude * highFrequency;
		// scale the vertex by the distance * coefficient
		vertex.multiplyScalar(distance * 0.5);
		// sth wrong with the ts compiler...
		/* @ts-ignore */
		vertices[i] = vertex.x;
		/* @ts-ignore */
		vertices[i + 1] = vertex.y;
		/* @ts-ignore */
		vertices[i + 2] = vertex.z;
	}
	// need to update the geometry
	ball.geometry.attributes.position.needsUpdate = true;
}
