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


    }

    create(child) {
        this.width = this.scale.width
        this.height = this.scale.height
        this.bg = []

        this.wave = 0

        this.shop_towers = []
        this.towers = []

        this.slots = []

        this.enemies = []

        this.physics.add.collider(this.towers, this.enemies, this.hitEnemy, null, this);

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


        for (let i = 0; i < 10; ++i) {
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
        if (this.enemies[0]) {
            if (this.enemies[0].body.velocity.x > -800) {
                this.enemies[0].body.velocity.x -= 70;
            }
        }
    }


    setBgScale(img, height) {
        img.displayWidth = img.displayWidth * height / img.displayHeight
        img.displayHeight = height
    }

    generateShop(shop_towers) {
        for (let i = 0; i < 5; ++i) {
            shop_towers.push(this.add.existing(new Tower(this, 20 + (20 + 75) * i + 1, this.height - 154, 'green', 2, 2, 2)));
        }
    }

    clearShop(shop_towers) {
        for (let i = 0; i < shop_towers.length; ++i) {
            shop_towers[i].destroy()
        }
        shop_towers.length = 0
    }

    startWave() {
        this.wave++;
        this.startWaveButton.setVisible(false);
        this.clearShop(this.shop_towers)
        this.enemies.push(this.add.existing(new Enemy(this, 1200, 484, 'green', this.wave**2, 5*this.wave**2)))
        this.enemies[0].body.velocity.x = -800
    }

    endWave() {
        this.startWaveButton.setVisible(true);
        this.generateShop(this.shop_towers)

        for (let tower of this.towers) {
            tower.setAlpha(1)
            tower.body.enable = true
        }
    }

    hitEnemy(tower, enemy) {
        tower.hp -= enemy.dmg;
        enemy.hp -= tower.dmg;

        console.log(enemy.hp, enemy.dmg)

        if (tower.hp <= 0) {
            tower.setAlpha(0)
            tower.body.enable = false
        }

        if (enemy.hp <= 0) {
            this.enemies.shift()
            enemy.destroy()
            if (this.enemies.length === 0) {
                this.endWave()
            }
        }
    }


}

class Tower extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, hp, dmg, cost) {
        super(scene, x, y, texture);

        this.setOrigin(0, 0)
        scene.physics.world.enable(this);
        this.body.setAllowGravity(false);
        this.body.immovable = true
        this.setInteractive({draggable: true})
        this.hp = hp
        this.dmg = dmg
        this.cost = cost
        this.scene.add.existing(this);
    }
}

class Enemy extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, hp, dmg) {
        super(scene, x, y, texture);

        this.setOrigin(0, 0)
        scene.physics.world.enable(this);
        this.body.velocity.x = 0
        this.body.setAllowGravity(false);
        this.body.bounce.set(1, 0)
        this.hp = hp
        this.dmg = dmg
        this.scene.add.existing(this);
    }
}