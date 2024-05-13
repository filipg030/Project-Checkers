import {
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    TextureLoader,
    DoubleSide
} from "three";
import textureWhite from './img/marble.jpg'
import textureBlack from './img/blackMarble.jpg'
import selected from './img/selected.jpg'


export default class Panel extends Mesh {

    constructor(scene, color) {
        super()
        this.scene = scene;
        this.color = color
        this.geometry = new BoxGeometry(50, 5, 50);
        if (this.color == "white") {
            this.material = new MeshBasicMaterial({
                map: new TextureLoader().load(textureWhite),
                side: DoubleSide,
                transparent: false,
                opacity: 1

            });
        }
        else {
            this.material = new MeshBasicMaterial({
                map: new TextureLoader().load(textureBlack),
                side: DoubleSide,
                transparent: false,
                opacity: 1

            });
        }
        this.scene.add(this)
    }
    updatePos(x, z) {
        this.position.set(x, 0, z)
    }
    highlight() {
        this.material = new MeshBasicMaterial({
            map: new TextureLoader().load(selected),
            side: DoubleSide,
            transparent: false,
            opacity: 1

        });
    }
    unhighlight() {
        this.material = new MeshBasicMaterial({
            map: new TextureLoader().load(textureBlack),
            side: DoubleSide,
            transparent: false,
            opacity: 1

        });
    }

}
