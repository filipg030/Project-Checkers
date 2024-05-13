import { PerspectiveCamera, Vector3 } from 'three';

export default class Camera {
    constructor(renderer) {
        const width = renderer.domElement.width;
        const height = renderer.domElement.height;

        this.threeCamera = new PerspectiveCamera(75, width / height, 0.1, 10000);
        this.threeCamera.position.set(200, 400, 200);
        this.threeCamera.lookAt(new Vector3(200, 0, 200))

        this.updateSize(renderer);

        window.addEventListener('resize', () => this.updateSize(renderer), false);
    }

    updateSize(renderer) {

        this.threeCamera.aspect = renderer.domElement.width / renderer.domElement.height;
        this.threeCamera.updateProjectionMatrix();
    }

    startGamePos(player) {
        if (player == 1) {
            this.threeCamera.position.set(500, 200, 200)
            this.threeCamera.lookAt(new Vector3(200, 0, 200))
        } else {
            this.threeCamera.position.set(-100, 200, 200)
            this.threeCamera.lookAt(new Vector3(200, 0, 200))
        }
    }

    getCurrPos() {
        return this.threeCamera.position.x
    }
}