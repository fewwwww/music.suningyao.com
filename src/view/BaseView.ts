import { Clock, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

export class BaseView {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;

  model: any;

  constructor(model: any, renderer: WebGLRenderer) {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    this.camera.position.z = 5;
    this.renderer = renderer;
    this.model = model;
  }

  //@ts-ignore
  update(clock: Clock): void {}

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
