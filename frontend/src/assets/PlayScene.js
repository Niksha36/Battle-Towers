import {Scene} from 'phaser'
import store from "@/store";
import sky from "../assets/background/sky.png"
import clouds_bg from '../assets/background/clouds_bg.png'
import mountains from '../assets/background/glacial_mountains.png'
import clouds_mg_3 from '../assets/background/clouds_mg_3.png'
import clouds_mg_2 from '../assets/background/clouds_mg_2.png'
import clouds_mg_1 from '../assets/background/clouds_mg_1.png'

export default class PlayScene extends Scene {

    constructor() {
        super({key: 'PlayScene'})
    }

    preload() {
        this.load.image('sky', sky)
        this.load.image('mountains', mountains)
        this.load.image('layer1', clouds_bg)
        this.load.image('layer2', clouds_mg_3)
        this.load.image('layer3', clouds_mg_2)
        this.load.image('layer4', clouds_mg_1)


    }

    create() {

        const width = this.scale.width
        const height = this.scale.height
        this.layers = []
        this.bg = []

        this.bg.push(this.add.image(width / 2, height / 2, 'sky'))
        this.layers.push(this.add.tileSprite(width / 2, height / 2, 384, 216, 'layer1'))
        this.bg.push(this.add.image(width / 2, height / 2, 'mountains'))
        this.layers.push(this.add.tileSprite(width / 2, height / 2, 384, 216, 'layer2'))
        this.layers.push(this.add.tileSprite(width / 2, height / 2, 384, 216, 'layer3'))
        this.layers.push(this.add.tileSprite(width / 2, height / 2, 384, 216, 'layer4'))

        this.platform = this.physics.add.sprite(0, height - 216, "sky").setOrigin(0, 0).setScale(4, 1).setImmovable(true)
        this.platform.body.setAllowGravity(false)

        this.main_tower = this.physics.add.sprite(10, height - 324, "layer1").setOrigin(0, 0).setScale(0.2, 0.5).setImmovable(true)
        this.main_tower.body.setAllowGravity(false)
        this.main_tower.setBounce(0, 0.2);
        this.main_tower.setCollideWorldBounds(true);
        this.physics.add.collider(this.main_tower, this.platform);

        this.enemy = this.physics.add.sprite(700, height - 324, "layer1").setOrigin(0, 0).setScale(0.2, 0.5)
        this.enemy.setBounce(0.3, 0.1);
        this.main_tower.setCollideWorldBounds(true);
        this.physics.add.collider(this.enemy, this.platform);
        this.physics.add.collider(this.enemy, this.main_tower, this.enemyHitTower);
        this.enemy.body.velocity.x = -500

        for (let i = 0; i < 2; ++i) {
            this.setBgScale(this.bg[i], height)
        }
        for (let i = 0; i < 4; ++i) {
            this.setLayerScale(this.layers[i], width, height)
        }


    }


    update() {
        for (let i = 0; i < 4; ++i) {
            this.layers[i].tilePositionX += (i ** 2.5 + 1) / 60;

        }
        if (this.enemy.body.velocity.x > -500) {
            this.enemy.body.velocity.x -= 10;
        }
    }


    setBgScale(img, height) {
        img.displayWidth = img.displayWidth * height / img.displayHeight
        img.displayHeight = height
    }

    setLayerScale(layer, width, height) {
        layer.setScale(height / layer.height)
    }

    enemyHitTower(enemy, tower) {
        enemy.body.velocity.x = 500
        tower.x = 10
    }

}

class Tower extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, hp, dmg, cost) {
        super(scene, x, y, 'Texture');

        this.hp = hp
        this.dmg = dmg
        this.cost = cost
        this.scene.add.existing(this);
    }
}