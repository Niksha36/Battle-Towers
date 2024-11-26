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
            .fillStyle(0x6b6c6b, 1)
            .fillRect(0, 0, 75, 100) 
            .generateTexture('gray', 75, 100);

        this.add.graphics()
            .fillStyle(0x00ff00, 1)
            .fillRect(0, 0, 75, 100)
            .generateTexture('green', 75, 100);
        
        this.add.graphics()
            .fillStyle(0xff0000, 1)
            .fillRect(0, 0, 75, 150) 
            .generateTexture('mainTower', 75, 100);

        this.add.graphics()
            .fillStyle(0xff9999, 1) 
            .fillRect(0, 0, 75, 150) 
            .generateTexture('chest', 75, 100);

        this.add.graphics()
            .fillStyle(0x1128dc, 1) 
            .fillRect(0, 0, 75, 150)
            .generateTexture('cat', 75, 100);
        
        this.add.graphics()
            .fillStyle(0x000000, 1) 
            .fillRect(0, 0, 75, 150)
            .generateTexture('milk', 75, 100);


    }

    create(child) {
        // GAME CONFIG
        this.width = this.scale.width
        this.height = this.scale.height
        
        this.count_slots = 10
        this.count_shop_slots = 7
        this.count_tower_types = 4
        
        this.bg = []
        this.shop_towers = []
        this.towers = []
        this.slots = []

        // USER CONFIG
        this.money = 11


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

        this.towers.push(this.add.existing(new MainTower(this)))
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
            this.shop_towers = this.shop_towers.filter(item => item !== gameObject);
        });

        this.input.on('dragend', function (pointer, gameObject, dropped) {
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }

        });

        this.startWaveButton = this.add.text(this.width - 250, this.height - 100, 'Start Wave', {
            fontSize: '32px',
            fill: '#fff'
        })
            .setOrigin(0, 0)
            .setInteractive();

        // Добавляем обработчик событий на кнопку
        this.startWaveButton.on('pointerdown', this.startWave, this);
        this.startWaveButton.on('pointerover', () => {
            this.startWaveButton.setStyle({fill: '#aaa'}); // Темный цвет при наведении
        });
        this.startWaveButton.on('pointerout', () => {
            this.startWaveButton.setStyle({fill: '#fff'}); // Возвращаем исходный цвет
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
    }


    setBgScale(img, height) {
        img.displayWidth = img.displayWidth * height / img.displayHeight
        img.displayHeight = height
    }

    generateShop(shop_towers) {
        for (let i = 0; i < this.count_shop_slots; ++i) {
            let x_pos = 0 + (20 + 75) * i + 1
            let y_pos =  this.height - 154
            switch(getRandomNumber(this.count_tower_types)) {
                case 0: 
                    shop_towers.push(this.add.existing(new Chest(this, x_pos, y_pos)));
                    break
                case 1: 
                    shop_towers.push(this.add.existing(new Tower(this, x_pos, y_pos , 'green', 2, 2, 2)));
                    break
                case 2:
                    shop_towers.push(this.add.existing(new Cat(this, x_pos, y_pos)));
                    break
                case 3:
                    shop_towers.push(this.add.existing(new Milk(this, x_pos, y_pos)));
                    break
            }
        }
    }

    clearShop(shop_towers) {
        for (let i = 0; i < shop_towers.length; ++i) {
            shop_towers[i].destroy()
        }
        shop_towers.length = 0
    }

    startWave() {
        this.startWaveButton.setVisible(false);
        this.clearShop(this.shop_towers)
        this.time.delayedCall(60, this.endWave, [], this);
    }

    endWave() {
        this.startWaveButton.setVisible(true);
        this.generateShop(this.shop_towers)

        for (let i = 0; i < this.towers.length; i++) {
            this.towers[i].buff(i);
        }
        console.log(this.money)
        console.log(this.towers)
    }


}

class Tower extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, hp, dmg, cost, draggable=true) {
        super(scene, x, y, texture);

        this.setOrigin(0, 0)
        this.setInteractive({draggable: draggable})

        this.hp = hp
        this.dmg = dmg
        this.cost = cost
        this.scene.add.existing(this);
    }

    buff(index) {}
}
class MainTower extends Tower {
    constructor(scene) {
        super(scene, 20, 484, "mainTower", 5, 1, 0, false);
    }

    buff(index) {
        this.scene.money += 6;
    }
}

class Chest extends Tower {
    constructor(scene, x, y) {
        super(scene, x, y, "chest", 2, 1, 5);
    }

    buff(index) {
        this.scene.money++; 
        if (this.scene.towers[index - 1].constructor.name == "MainTower") {
            this.scene.money++;
        }
    }
}

class Cat extends Tower {
    constructor(scene, x, y) {
        super(scene, x, y, "cat", 2, 2, 3);
    }
}

class Milk extends Tower {
    constructor(scene, x, y) {
        super(scene, x, y, "milk", 2, 2, 3);
    }

    buff(index) {
        if (index == this.scene.towers.length - 1) {
            return;
        }
        
        if (this.scene.towers[index + 1].constructor.name == "Cat") {
            this.scene.towers[index + 1].hp += 2
            this.scene.towers[index + 1].dmg += 2
        } else {
            this.scene.towers[index + 1].hp++;
        }
    
    }
}

function getRandomNumber(max) {
    return Math.floor(Math.random() * max)
  }