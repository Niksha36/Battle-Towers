import {Scene} from 'phaser'
import store from "@/store";
import sky from "../assets/background/sky.png"
import mountains from '../assets/background/glacial_mountains.png'

export default class PlayScene extends Scene {

    constructor() {
        super({key: 'PlayScene'})
    }

    preload() {
            this.load.image('sky', sky)
            this.load.image('mountains', mountains)

            this.add.graphics()
                .fillStyle(0x6b6c6b, 1) // Зеленый цвет
                .fillRect(0, 0, 75, 100) // Параметры: x, y, ширина, высота
                .generateTexture('gray', 75, 100);

            this.add.graphics()
                .fillStyle(0x00ff00, 1) // Зеленый цвет
                .fillRect(0, 0, 75, 100) // Параметры: x, y, ширина, высота
                .generateTexture('green', 75, 100);
            
            this.add.graphics()
                .fillStyle(0xff0000, 1) // Зеленый цвет
                .fillRect(0, 0, 75, 150) // Параметры: x, y, ширина, высота
                .generateTexture('mainTower', 75, 100);

            this.add.graphics()
                .fillStyle(0xff9999, 1) // Зеленый цвет
                .fillRect(0, 0, 75, 150) // Параметры: x, y, ширина, высота
                .generateTexture('chest', 75, 100);


    }

    create(child) {
        // GAME CONFIG
        this.width = this.scale.width
        this.height = this.scale.height
        this.count_slots = 10
        this.count_shop_slots = 5
        this.bg = []

        this.shop_towers = []
        this.towers = []

        this.slots = []

        // USER CONFIG
        this.money = 0


        this.bg = this.add.image(this.width / 2, this.height / 2, 'mountains')
        this.setBgScale(this.bg, this.height)


        this.platform = this.physics.add.sprite(0, this.height - 216, "sky").setOrigin(0, 0).setScale(4, 1).setImmovable(true)
        this.platform.body.setAllowGravity(false)

        this.main_tower = this.physics.add.sprite(10, this.height - 324, "layer1").setOrigin(0, 0).setScale(0.2, 0.5).setImmovable(true).setInteractive({draggable: true});
        this.main_tower.body.setAllowGravity(false)
        this.main_tower.setBounce(0, 0.2);
        this.main_tower.setCollideWorldBounds(true);
        this.physics.add.collider(this.main_tower, this.platform);
        this.main_tower.inputEnabled = true;


        for (let i = 0; i < this.count_slots; ++i) {
            this.slots.push(this.add.sprite(20 + (20 + 75) * i, 484, 'gray').setOrigin(0, 0).setInteractive())
            this.slots[i].input.dropZone = true
        }

        this.generateShop(this.shop_towers)

        this.input.on('dragstart', function (pointer, gameObject) {
            this.children.bringToTop(gameObject);
            gameObject.setTint(0xeeeeee);
        }, this);

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
        this.input.on('drop', (pointer, gameObject, dropZone) => {
            gameObject.x = dropZone.x;
            gameObject.y = dropZone.y;
            dropZone.setTint(0x00ff00)
            dropZone.destroy();
            gameObject.input.enabled = false;
            this.towers.push(gameObject)
        });

        this.input.on('dragend', function (pointer, gameObject, dropped) {
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }

        });

        // this.enemy = this.physics.add.sprite(700, height - 324, "layer1").setOrigin(0, 0).setScale(0.2, 0.5)
        // this.enemy.setBounce(0.3, 0.1);
        // this.main_tower.setCollideWorldBounds(true);
        // this.physics.add.collider(this.enemy, this.platform);
        // this.physics.add.collider(this.enemy, this.main_tower, this.enemyHitTower);
        // this.enemy.body.velocity.x = -500



    }


    update() {
        // if (this.enemy.body.velocity.x > -500) {
        //     this.enemy.body.velocity.x -= 10;
        // }
        for (let i = 1; i < this.towers.length; i++) {
            if (this.towers[i]) {
                this.towers[i].buff(i);
            }
        }
        console.log(this.money)
    }


    setBgScale(img, height) {
        img.displayWidth = img.displayWidth * height / img.displayHeight
        img.displayHeight = height
    }

    generateShop(shop_towers) {
        shop_towers.push(this.add.existing(new MainTower(this, this.height - 154, 5, 10, 2)));
        this.towers.push(shop_towers[0])
        for (let i = 0; i < this.count_shop_slots; ++i) {
            if (i < 3) {
                shop_towers.push(this.add.existing(new Chest(this, 20 + (20 + 75) * i + 1, this.height - 154, 2, 2, 2)));
            } else {
                shop_towers.push(this.add.existing(new Tower(this, 20 + (20 + 75) * i + 1, this.height - 154, 'green', 2, 2, 2)));
            }
        }
    }

}

class Tower extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, hp, dmg, cost, draggable=true) {
        super(scene, x, y, texture);

        this.setOrigin(0, 0)
        this.setInteractive({draggable: draggable})

        this.shopPosition = {x: x, y: y}
        this.hp = hp
        this.dmg = dmg
        this.cost = cost
        this.scene.add.existing(this);
    }

    buff(index) {}
}
class MainTower extends Tower {
    constructor(scene, hp, dmg, cost) {
        super(scene, 20, 484, "mainTower", hp, dmg, cost, false);
    }
}

class Chest extends Tower {
    constructor(scene, x, y, hp, dmg, cost) {
        super(scene, x, y, "chest", hp, dmg, cost);
    }

    buff(index) {
        this.scene.money++; 
        if (this.scene.towers[index - 1].constructor.name == "MainTower") {
            this.scene.money++;
        }
    }
}



