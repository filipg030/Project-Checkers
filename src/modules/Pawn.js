import {
    Mesh,
    CylinderGeometry,
    MeshBasicMaterial,
    TextureLoader,
    DoubleSide
} from "three";
import textureWhite from './img/whiteCarbon.jpg'
import textureBlack from './img/blackCarbon.jpg'
import selected from './img/selected.jpg'

export default class Pawn extends Mesh {
    constructor(scene, color) {
        super()
        this.color = color
        this.scene = scene
        if (this.color == "white") {
            this.material = new MeshBasicMaterial({
                map: new TextureLoader().load(textureWhite),
                side: DoubleSide,
                transparent: false,
                opacity: 1

            });
            this.userData.player = { player: "white" }
        } else {
            this.material = new MeshBasicMaterial({
                map: new TextureLoader().load(textureBlack),
                side: DoubleSide,
                transparent: false,
                opacity: 1

            });
            this.userData.player = { player: "black" }
        }
        this.geometry = new CylinderGeometry(20, 20, 5, 50);
        this.scene.add(this)

    }

    updatePos(x, z) {
        this.position.set(x, 10, z)
    }

    select() {
        this.material = new MeshBasicMaterial({
            map: new TextureLoader().load(selected),
            side: DoubleSide,
            transparent: false,
            opacity: 1

        });

    }

    deselect() {
        if (this.color == "white") {
            this.material = new MeshBasicMaterial({
                map: new TextureLoader().load(textureWhite),
                side: DoubleSide,
                transparent: false,
                opacity: 1

            });
        } else {
            this.material = new MeshBasicMaterial({
                map: new TextureLoader().load(textureBlack),
                side: DoubleSide,
                transparent: false,
                opacity: 1

            });
        }
    }
}
