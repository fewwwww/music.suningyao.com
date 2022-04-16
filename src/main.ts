import * as THREE from 'three';
import gonsa from './audio/gonsa.flac';
import zara from './audio/zara.flac';
import right from './audio/right.flac';
import glowlikethat from './audio/glow-like-that.flac';
import eat from './audio/eat.flac';
import psycho from './audio/psycho.flac';
import tonight from './audio/tonight.flac';

// DOM
const playDOM = document.getElementById('play');
const audioDOM = document.getElementsByTagName('audio')[0];

// data model
let model = {
	activeView: 1,
	pointerPosition: new THREE.Vector2(0, 0),
	// all the audio music files
	audioSrc: [gonsa, right, zara, glowlikethat, eat, psycho, tonight],
};

let renderer: THREE.WebGLRenderer;

// landing view
let viewOne: ViewOne;
// main view
let viewTwo: ViewTwo;

// all the views
let views: BaseView[] = [];

import { ViewOne } from './view/ViewOne';
import { BaseView } from './view/BaseView';
import { ViewTwo } from './view/ViewTwo';

function main() {
	initPlay();
	initScene();
	initListeners();
}

// initiate player
function initPlay() {
	if (playDOM) {
		// invert the color of the whole page
		playDOM.onmouseover = function () {
			const htmlDOM = document.getElementsByTagName('html')[0];
			htmlDOM.style.filter = 'invert(1)';
		};
		// get back the color of the page
		playDOM.onmouseleave = function () {
			const htmlDOM = document.getElementsByTagName('html')[0];
			htmlDOM.style.filter = '';
		};
		// initiate the audio on clicking, hide the play button, change active view
		playDOM.onclick = function () {
			audioDOM.src = model.audioSrc[Math.floor(Math.random() * model.audioSrc.length)];
			audioDOM.load();
			audioDOM.play();
			audioDOM.style.display = 'none';
			playDOM.style.display = 'none';
			model.activeView = (model.activeView + 1) % views.length;
		};
	}
}

// initiate the scene, assemble the views
function initScene() {
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setClearColor(0x000000);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	document.body.appendChild(renderer.domElement);

	// viewOne
	viewOne = new ViewOne(model, renderer);
	views.push(viewOne);

	// viewTwo
	viewTwo = new ViewTwo(model, renderer);
	views.push(viewTwo);

	animate();
}

function initListeners() {
	window.addEventListener('resize', onWindowResize, false);

	window.addEventListener('pointermove', onPointerMove);
}

function onWindowResize() {
	viewOne.onWindowResize();
	viewTwo.onWindowResize();
}

function onPointerMove(event: any) {
	// move camera along with the pointer position
	model.pointerPosition.x = (event.clientX / window.innerWidth) * 2 - 1;
	model.pointerPosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
	views[model.activeView].camera.position.x = model.pointerPosition.x / 2;
	views[model.activeView].camera.position.y = model.pointerPosition.y / 2;
}

function animate() {
	requestAnimationFrame(() => {
		animate();
	});

	// switch view when updating the model
	switch (model.activeView) {
		case 0:
			viewOne.update();
			break;

		case 1:
			viewTwo.update();
			break;

		default:
			break;
	}

	renderer.render(views[model.activeView].scene, views[model.activeView].camera);
}

main();
