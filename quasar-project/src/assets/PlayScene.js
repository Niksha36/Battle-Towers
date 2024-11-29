import {Scene} from 'phaser'
import bg from "../assets/background/bg_ground1_spr_0.png"
import bgClouds from "../assets/background/bg_clouds1_spr_0.png"
import bgSky from "../assets/background/bg_sky1_spr_0.png"
import mainTower from "../assets/towers/towerS_0.png"
import milk from "../assets/towers/towerS_1.png"
import cat from "../assets/towers/towerS_2.png"
import guard from "../assets/towers/towerS_3.png"
import chest from "../assets/towers/towerS_4.png"
import thief from "../assets/towers/towerS_8.png"
import ghost from "../assets/towers/diss_ghost_0.png"
import hp from "../assets/sprites/spr_sword_1.png"
import dmg from "../assets/sprites/spr_sword_0.png"
import coin from "../assets/sprites/spr_coin_0.png"
import money from "../assets/sprites/spr_money_0.png"
import shop_plate from "../assets/sprites/plate_common_0.png"
import turnBtn from "../assets/sprites/btn_end_turn_1.png"
import slot from "../assets/sprites/pngwing_com_0.png"
import shopLine from "../assets/sprites/shop_line_spr_0.png"
import loseBackground from "../assets/background/lose_background.png"
import enemies_attack_sprite from "../assets/sprites/enemies_attack_sprite.png"
import tower_destroy_sprite from "../assets/sprites/tower_destroy_sprite.png"
import ghost_destroy_sprite from "../assets/sprites/ghoust_defeated_sprite.png"
import roundsFlag from "../assets/sprites/flag_with_rounds.png"

import stor from "../store.js"
import axios from "axios";


export default class PlayScene extends Scene {

    constructor() {
        super({key: 'PlayScene'})
    }

    preload() {
        this.load.image('bg', bg)
        this.load.image('bgSky', bgSky)
        this.load.image('bgClouds', bgClouds)
        this.load.image('mainTower', mainTower)
        this.load.image('milk', milk)
        this.load.image('cat', cat)
        this.load.image('guard', guard)
        this.load.image('chest', chest)
        this.load.image('thief', thief)
        this.load.image('ghost', ghost)
        this.load.image('hpIcon', hp)
        this.load.image('dmgIcon', dmg)
        this.load.image('coin', coin)
        this.load.image('money', money)
        this.load.image('shopPlate', shop_plate)
        this.load.image('turnBtn', turnBtn)
        this.load.image('slot', slot)
        this.load.image('shopLine', shopLine)
        this.load.image('loseBackground', loseBackground)
        this.load.image('roundsFlag', roundsFlag)
        this.load.spritesheet('enemyAttack', enemies_attack_sprite, {
            frameWidth: 192,
            frameHeight: 192,
        });
        this.load.spritesheet('tower_destroy', tower_destroy_sprite, {
            frameWidth: 224,
            frameHeight: 224,
        });
        this.load.spritesheet('ghost_destroy', ghost_destroy_sprite, {
            frameWidth: 179,
            frameHeight: 217,
        });
    }

    create(child) {
        // GAME CONFIG
        this.es = null

        this.width = this.scale.width
        this.height = this.scale.height

        this.bgSky = this.add.image(this.width / 2, this.height / 2, 'bgSky')
        this.bgCluds = this.add.tileSprite(this.width / 2, this.height / 3.5, 1920, 645, 'bgClouds').setScrollFactor(1, 1);
        this.bg = this.add.sprite(this.width / 2, this.height / 2, 'bg')
        this.setBgScale(this.bg)
        this.setBgScale(this.bgSky)

        this.money = 11

        this.count_slots = 10
        this.count_shop_slots = 7
        this.count_tower_types = 5

        this.show_start = 225
        this.platform_start = 585
        this.step_sprite = 130

        this.wave = 0

        this.shop_towers = []
        this.towers = []
        this.slots = []
        this.enemies = []
        this.shop_plates = []

        this.physics.add.collider(this.towers, this.enemies, this.hitEnemy, null, this);


        for (let i = 1; i < this.count_slots; ++i) {
            this.slots.push(this.add.sprite(100 + this.step_sprite * (i), this.platform_start, 'slot').setInteractive().setAlpha(0))
            this.slots[i - 1].input.dropZone = true
            this.slots[i - 1].dropZoneIndex = i;
        }

        this.shopLine = this.add.sprite(-1400, this.platform_start + 118, 'shopLine').setScale(0.8).setOrigin(0)

        this.towers.push(this.add.existing(new MainTower(this)))
        this.generateShop(this.shop_towers, this.shop_plates)

        this.tweens.add({
            targets: [...this.shop_towers, this.shopLine, ...this.shop_plates, ...this.shop_towers.map(el => el.hpIcon),
                ...this.shop_towers.map(el => el.dmgIcon),
                ...this.shop_towers.map(el => el.dmgIcon),
                ...this.shop_towers.map(el => el.coinIcon),
                ...this.shop_towers.map(el => el.hpText),
                ...this.shop_towers.map(el => el.dmgText),
                ...this.shop_towers.map(el => el.coinText),
                ...this.shop_towers.map(el => el.nameText)],
            x: '+=1400',
            duration: 1000,
            ease: 'Power2',
        });

        this.input.on('dragstart', function (pointer, gameObject) {

            gameObject.bringToTop();
            gameObject.setTint(0xeeeeee);
        }, this);

        this.input.on('drag', (pointer, gameObject, dragX, dragY, dropZone) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
            gameObject.updatePosition(gameObject.x, gameObject.y)
        });

        this.input.on('dragenter', (pointer, gameObject, dropZone) => {

            dropZone.setTexture(gameObject.texture)
            dropZone.setTint(0x00ff00);
            dropZone.setScale(0.5)

        });

        this.input.on('dragleave', (pointer, gameObject, dropZone) => {

            dropZone.setScale(1)
            dropZone.setTexture('slot')
            dropZone.clearTint();

        });
        this.input.on('drop', (pointer, gameObject, dropZone) => {
            dropZone.setScale(1)
            dropZone.setTexture('slot')
            dropZone.clearTint();
            for (let slot of this.slots) {
                if (slot) {
                    this.tweens.add({
                        targets: slot,
                        alpha: 0, // Конечная прозрачность (полностью видимый)
                        duration: 500, // Длительность анимации в миллисекундах
                        ease: 'Power2', // Тип easing
                        onComplete: () => {
                            console.log('Прозрачность увеличена!'); // Действие после завершения анимации
                        }
                    });
                }
            }

            this.money -= gameObject.cost;
            this.moneyText.setText(this.money.toString());

            gameObject.x = dropZone.x;
            gameObject.y = dropZone.y;

            gameObject.updatePosition(gameObject.x, gameObject.y)
            dropZone.setTint(0x00ff00)
            dropZone.destroy();
            gameObject.shop_info_destroy()

            gameObject.input.enabled = false;
            this.towers[dropZone.dropZoneIndex] = gameObject
            const index = this.shop_towers.indexOf(gameObject);
            this.shop_plates[index].destroy()
            this.shop_plates.splice(index, 1);
            this.shop_towers.splice(index, 1);

            for (let tower of this.shop_towers) {
                if (tower.cost > this.money) {
                    tower.input.enabled = false
                    tower.setTint(0x6c6c6c)

                }
            }
        });

        this.input.on('dragend', (pointer, gameObject, dropped) => {
            gameObject.clearTint();
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
                gameObject.updatePosition(gameObject.x, gameObject.y)
            }
        });


        this.startWaveButtonContainer = this.add.container(this.width - 250, this.height - 200);

        this.startWaveButton = this.add.sprite(0, 0, 'turnBtn').setOrigin(0, 0).setInteractive();
        this.startWaveButtonText = this.add.text(15, 15, 'Ход', {
            fontSize: '35px',
            fontFamily: 'Roboto',
            fontWeight: 700,
            textAlign: 'center',
            fill: '#E8CA8F'
        }).setOrigin(-0.98, 0.1);

        this.roundsFlag = this.add.sprite(0, 0, 'roundsFlag').setOrigin(1, 1);
        this.roundsFlagText = this.add.text(-this.roundsFlag.width / 2, -this.roundsFlag.height / 2, '1', {
            fontSize: '30px',
            fill: '#fff'
        }).setOrigin(0.5, 0.5);

        this.roundsFlagContainer = this.add.container(this.width - 85, this.height - 85);
        this.roundsFlagContainer.add([this.roundsFlag, this.roundsFlagText]);

        this.add.existing(this.roundsFlagContainer);
        this.startWaveButtonContainer.add([this.startWaveButton, this.startWaveButtonText])
        this.startWaveButton.on('pointerover', () => {
            this.startWaveButton.setTint(0xc1c1c1);
            this.startWaveButtonText.setTint(0xc1c1c1);
        });

// Add event listener for pointerout to reset tint
        this.startWaveButton.on('pointerout', () => {
            this.startWaveButton.clearTint();
            this.startWaveButtonText.clearTint();
        });
        this.add.sprite(146, 50, 'money');
        this.moneyText = this.add.text(100, 35, this.money.toString(), {
            fontSize: '32px',
            fill: '#fff'
        });

        // Добавляем обработчик событий на кнопку
        this.startWaveButton.on('pointerdown', this.startWave, this);


        //создаю анимацию удара врагов по башне
        this.anims.create({
            key: 'attack',
            frames: this.anims.generateFrameNumbers('enemyAttack', {start: 0, end: 10}),
            frameRate: 24,
            repeat: 0
        });

        const destroyFrames = this.anims.generateFrameNumbers('tower_destroy', {start: 0, end: 10});
        this.anims.create({
            key: 'destroy',
            frames: destroyFrames,
            frameRate: 24,
            repeat: 0
        });

        //анимация смерти тени
        const ghostDiesFrames = this.anims.generateFrameNumbers("ghost_destroy", {start: 0, end: 23});
        this.anims.create({
            key: 'ghostDies',
            frames: ghostDiesFrames,
            frameRate: 30,
            repeat: 0
        });
    }


    update() {
        this.bgCluds.tilePositionX -= 0.4
        if (this.enemies[0]) {
            this.enemies[0].updatePosition()
        }
    }

    setBgScale(img) {
        img.displayHeight = img.displayHeight * this.width / img.displayWidth
        img.displayWidth = this.width
    }

    generateShop(shop_towers, shop_plates) {
        for (let i = 0; i < this.count_shop_slots; ++i) {
            let x_pos = (this.step_sprite + 40) * i + 120 - 1400
            let y_pos = this.platform_start * 1.45

            shop_plates.push(this.add.sprite(x_pos, y_pos, "shopPlate").setScale(1.1, 0.95));
            let shop_tower;
            switch (getRandomNumber(this.count_tower_types)) {
                case 0:
                    shop_tower = new Chest(this, x_pos, y_pos + 15)
                    break
                case 1:
                    shop_tower = new Cat(this, x_pos, y_pos + 15)
                    break
                case 2:
                    shop_tower = new Milk(this, x_pos, y_pos + 15)
                    break
                case 3:
                    shop_tower = new Guard(this, x_pos, y_pos + 15)
                    break
                case 4:
                    shop_tower = new Thief(this, x_pos, y_pos + 15)
                    break
            }
            shop_towers.push(this.add.existing(shop_tower))
            for (let slot of this.slots) {
                if (slot) {
                    shop_tower.on('pointerover', () => {
                        this.tweens.add({
                            targets: slot,
                            alpha: 0.4, // Конечная прозрачность (полностью видимый)
                            duration: 500, // Длительность анимации в миллисекундах
                            ease: 'Power2', // Тип easing
                        });
                    });
                    shop_tower.on('pointerout', () => {
                        this.tweens.add({
                            targets: slot,
                            alpha: 0, // Конечная прозрачность (полностью видимый)
                            duration: 500, // Длительность анимации в миллисекундах
                            ease: 'Power2', // Тип easing
                        });
                    });
                }
            }
            this.children.bringToTop(this.shopLine);
        }
    }

    clearShop(shop_towers, shop_plates) {
        for (let i = 0; i < shop_towers.length; ++i) {
            shop_towers[i].destroy()
            shop_towers[i].nameText.destroy()
            shop_towers[i].component_destroy()
            shop_plates[i].destroy()
        }

        for (let i = 0; i < shop_plates.length; ++i) {
            shop_plates[i].destroy()
        }

        shop_towers.length = 0
        shop_plates.length = 0
    }

    startWave() {
        this.roundsFlagText.text = (parseInt(this.roundsFlagText.text) + 1).toString();
        for (let i = 0; i < this.towers.length; i++) {
            if (this.towers[i]) {
                this.towers[i].buff(i);
            }
        }

        this.tweens.add({
            targets: [...this.shop_towers, this.shopLine, ...this.shop_plates, ...this.shop_towers.map(el => el.hpIcon),
                ...this.shop_towers.map(el => el.dmgIcon),
                ...this.shop_towers.map(el => el.dmgIcon),
                ...this.shop_towers.map(el => el.coinIcon),
                ...this.shop_towers.map(el => el.hpText),
                ...this.shop_towers.map(el => el.dmgText),
                ...this.shop_towers.map(el => el.coinText),
                ...this.shop_towers.map(el => el.nameText)],
            x: '-=1400',
            duration: 1000,
            ease: 'Power2',
            onComplete: () => this.clearShop(this.shop_towers, this.shop_plates)
        });

        this.wave++;
        this.startWaveButtonContainer.setVisible(false);
        this.roundsFlagContainer.setVisible(false)
        // this.clearShop(this.shop_towers, this.shop_plates)
        for (let i = 0; i < 5; i++) {
            this.enemies.push(this.add.existing(new Enemy(this, this.width - 300 + 30 * i, this.platform_start - 20, 'ghost', this.wave + 1, this.wave + 1)))
        }
    }

    endWave() {
        this.startWaveButtonContainer.setVisible(true);
        this.roundsFlagContainer.setVisible(true)
        this.generateShop(this.shop_towers, this.shop_plates)
        this.tweens.add({
            targets: [...this.shop_towers, this.shopLine, ...this.shop_plates, ...this.shop_towers.map(el => el.hpIcon),
                ...this.shop_towers.map(el => el.dmgIcon),
                ...this.shop_towers.map(el => el.dmgIcon),
                ...this.shop_towers.map(el => el.coinIcon),
                ...this.shop_towers.map(el => el.hpText),
                ...this.shop_towers.map(el => el.dmgText),
                ...this.shop_towers.map(el => el.coinText),
                ...this.shop_towers.map(el => el.nameText)],
            x: '+=1400',
            duration: 1000,
            ease: 'Power2',
        });

        for (let tower of this.towers) {
            if (tower) {
                tower.set_default_stats()
            }
        }

        for (let tower of this.towers) {
            if (tower) {
                tower.show()
                tower.body.enable = true
            }
        }

        this.moneyText.setText(this.money.toString());
    }

    hitEnemy(tower, enemy) {
        const attackAnim = this.add.sprite(enemy.x - 100, enemy.y, 'enemyAttack');

        attackAnim.play('attack');
        attackAnim.on('animationcomplete', () => {
            attackAnim.destroy();
        });
        tower.hp -= enemy.dmg;
        enemy.hp -= tower.dmg;

        tower.updateHPText();
        enemy.updateHPText();


        if (tower.hp <= 0) {
            const destroyAnim = this.add.sprite(tower.x, tower.y, 'tower_destroy');
            try {
                destroyAnim.play('destroy');
            } catch (error) {
                console.error('Error playing destroy animation:', error);
            }
            destroyAnim.on('animationcomplete', () => {
                destroyAnim.destroy();
            });

            if (tower.constructor.name === "MainTower") {
                this.get_user_record().then(
                    r =>
                        this.es = new EndScreen(
                            this,
                            900,
                            500,
                            "loseBackground",
                            this.wave,
                            r.record
                        )
                )

                this.tweens.add({
                    targets: [this.es],
                    alpha: {
                        from: 1,
                        to: 0
                    },
                    duration: 2000,
                    ease: "Power2",
                    onComplete() {
                        console.log("ido")
                    }
                })
                stor.dispatch("updateRecord", this.wave)
                this.update_user_record()
            }
            tower.is_die = true
            tower.hide();
            tower.body.enable = false
        }

        if (enemy.hp <= 0) {
            const destroyAnim = this.add.sprite(enemy.x, enemy.y, 'ghost_destroy');
            try {
                destroyAnim.play('ghostDies');
            } catch (error) {
                console.error('Error playing destroy animation:', error);
            }
            destroyAnim.on('animationcomplete', () => {
                destroyAnim.destroy('ghostDies');
            });
            this.enemies.shift()
            enemy.destroy()
            enemy.component_destroy();
            if (this.enemies.length === 0) {
                this.endWave()
            }
        }
    }

    async update_user_record() {
        return await axios.post("http://localhost:8000/update_user_record", {
            withCredentials: true,
            params: {
                "username": stor.state.username,
                "record": stor.state.record
            }
        })
    }

    async get_user_record() {
        return await axios.get("http://localhost:8000/get_user_record", {
            withCredentials: true,
            params: {
                "username": stor.state.username,
            }
        })
    }

    removeScreen() {
        this.es = null
    }


}

class Tower extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, hp, dmg, cost, draggable = true) {
        super(scene, x, y, texture);

        this.setInteractive({draggable: draggable})
        this.setDisplaySize(150, 150)

        scene.physics.world.enable(this);
        this.body.setAllowGravity(false);
        this.body.immovable = true

        this.default_hp = hp
        this.default_dmg = dmg
        this.hp = hp
        this.dmg = dmg
        this.cost = cost

        this.hpIcon = scene.add.sprite(x, y, 'hpIcon').setOrigin(2, -2.5);
        this.hpText = scene.add.text(x, y, hp.toString(), {
            fontSize: '25px',
            fill: '#fff'
        }).setOrigin(1.8, -3.5)

        this.dmgIcon = scene.add.sprite(x, y, 'dmgIcon').setOrigin(0, -2.5);
        this.dmgText = scene.add.text(x, y, dmg.toString(), {
            fontSize: '25px',
            fill: '#fff'
        }).setOrigin(-2, -3.5)

        this.coinIcon = scene.add.sprite(x, y, 'coin').setDisplaySize(30, 30).setOrigin(2, 3.5);
        this.coinText = scene.add.text(x, y, cost.toString(), {
            fontSize: '25px',
            fill: '#fadb00'
        }).setOrigin(1.8, 4.1)

        this.nameText = scene.add.text(x, y, '', {
            fontSize: '25px',
            fill: '#f1ff9b'
        }).setOrigin(0.5, 6) // "" дабы не отображалось название башни


        this.is_die = false
        this.scene.add.existing(this);
    }


    buff(index) {
    }

    set_default_stats() {
        this.hp = this.default_hp
        this.dmg = this.default_dmg
        this.is_die = false
        this.updateHPText()
        this.updateDMGText()
    }

    updateHPText() {
        this.hpText.setText(this.hp.toString());
    }

    updateDMGText() {
        this.dmgText.setText(this.dmg.toString());
    }

    component_destroy() {
        this.hpText.destroy();
        this.hpIcon.destroy();
        this.dmgText.destroy();
        this.dmgIcon.destroy();
        this.shop_info_destroy()
    }

    shop_info_destroy() {
        this.coinIcon.destroy();
        this.coinText.destroy();
        this.nameText.setOrigin(0.5, 4)
        this.nameText.setPosition(this.x, this.y);
    }

    updatePosition(dragX, dragY) {
        this.hpIcon.setPosition(dragX, dragY);
        this.hpText.setPosition(dragX, dragY)

        this.dmgIcon.setPosition(dragX, dragY)
        this.dmgText.setPosition(dragX, dragY);

        this.coinIcon.setPosition(dragX, dragY);
        this.coinText.setPosition(dragX, dragY);

    }

    hide() {
        this.setAlpha(0);
        this.nameText.setAlpha(0);
        this.hpText.setAlpha(0);
        this.hpIcon.setAlpha(0);
        this.dmgText.setAlpha(0);
        this.dmgIcon.setAlpha(0);
    }

    show() {
        this.setAlpha(1);
        this.hpText.setAlpha(1);
        this.hpIcon.setAlpha(1);
        this.dmgText.setAlpha(1);
        this.dmgIcon.setAlpha(1);
    }

    bringToTop() {
        this.scene.children.bringToTop(this.hpIcon);
        this.scene.children.bringToTop(this.hpText);
        this.scene.children.bringToTop(this.dmgIcon);
        this.scene.children.bringToTop(this.hpText);
        this.scene.children.bringToTop(this.coinIcon);
        this.scene.children.bringToTop(this.coinText);
        this.scene.children.bringToTop(this);
    }

}

class MainTower extends Tower {
    constructor(scene) {
        super(scene, 100, scene.platform_start, "mainTower", 5, 1, 0, false);
        this.shop_info_destroy()
        this.nameText = scene.add.text(scene, 100, scene.platform_start, "Королевская Башня", {
            fontSize: '25px',
            fill: '#f1ff9b'
        }).setOrigin(0.5, 6)
    }

    buff(index) {
        this.scene.money += 6;
    }
}

class Chest extends Tower {
    constructor(scene, x, y) {
        super(scene, x, y, "chest", 2, 1, 5);
        this.nameText = scene.add.text(x, y, "Сундук", {
            fontSize: '25px',
            fill: '#f1ff9b'
        }).setOrigin(0.5, 6)
    }

    buff(index) {
        if (this.is_die) {
            this.is_die = false;
            return;
        }

        this.scene.money++;
        if (this.scene.towers[index - 1] && this.scene.towers[index - 1].constructor.name === "MainTower") {
            this.scene.money++;
        }
    }
}

class Cat extends Tower {
    constructor(scene, x, y) {
        super(scene, x, y, "cat", 3, 2, 3);
        this.nameText = scene.add.text(x, y, "Кот", {
            fontSize: '25px',
            fill: '#f1ff9b'
        }).setOrigin(0.5, 6)

    }
}

class Milk extends Tower {
    constructor(scene, x, y) {
        super(scene, x, y, "milk", 2, 1, 3);
        this.nameText = scene.add.text(x, y, "Молоко", {
            fontSize: '25px',
            fill: '#f1ff9b'
        }).setOrigin(0.5, 6)
    }

    buff(index) {
        if (index === this.scene.towers.length - 1 || this.scene.towers[index + 1] == null) {
            return;
        }

        if (this.scene.towers[index + 1].constructor.name === "Cat") {
            this.scene.towers[index + 1].default_hp += 2
            this.scene.towers[index + 1].default_dmg += 2
        } else {
            this.scene.towers[index + 1].default_hp++;
        }

        this.scene.towers[index + 1].set_default_stats()
    }
}

class Guard extends Tower {
    constructor(scene, x, y) {
        super(scene, x, y, "guard", 2, 1, 3);
        this.nameText = scene.add.text(x, y, "Страж", {
            fontSize: '25px',
            fill: '#f1ff9b'
        }).setOrigin(0.5, 6)
    }

    buff() {
        if (this.is_die) {
            for (let tower of this.scene.towers) {
                if (tower) {
                    tower.hp += this.default_hp;
                    tower.dmg += this.default_dmg;
                    tower.updateDMGText();
                    tower.updateHPText();
                }
            }
            this.set_default_stats()
        }
    }

    preUpdate() {
        this.buff()
    }


}

class Thief extends Tower {
    constructor(scene, x, y) {
        super(scene, x, y, "thief", 1, 2, 3);
        this.nameText = scene.add.text(x, y, "Вор", {
            fontSize: '25px',
            fill: '#f1ff9b'
        }).setOrigin(0.5, 6)
    }

    buff(index) {
        if (this.scene.towers[index - 1] != null &&
            this.scene.towers[index - 1].constructor.name === "Chest") {

            this.scene.towers[index - 1].dmg += 5;
            this.scene.towers[index - 1].updateHPText();
            this.scene.towers[index - 1].updateDMGText();
            this.scene.money++;
        }
        if (index !== this.scene.towers.length - 1 &&
            this.scene.towers[index + 1] != null &&
            this.scene.towers[index + 1].constructor.name === "Chest") {

            this.scene.towers[index + 1].dmg += 5
            this.scene.towers[index + 1].updateHPText();
            this.scene.towers[index + 1].updateDMGText();
            this.scene.money++;
        }
    }


}

class Enemy extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, hp, dmg) {
        super(scene, x, y, texture);

        scene.physics.world.enable(this);
        this.body.velocity.x = 0
        this.body.setAllowGravity(false);
        this.body.bounce.set(1, 0)

        this.hp = hp
        this.dmg = dmg

        this.hpIcon = scene.add.sprite(x - 50, y + 100, 'hpIcon');
        this.hpText = scene.add.text(this.hpIcon.x + 20, this.hpIcon.y - 13, hp.toString(), {
            fontSize: '30px',
            fill: '#fff'
        })

        this.dmgIcon = scene.add.sprite(x + 15, y + 100, 'dmgIcon');
        this.dmgText = scene.add.text(this.dmgIcon.x + 20, this.dmgIcon.y - 13, dmg.toString(), {
            fontSize: '30px',
            fill: '#fff'
        })


        this.scene.add.existing(this);
    }

    updateHPText() {
        this.hpText.setText(this.hp.toString());
    }

    updateDMGText() {
        this.dmgText.setText(this.dmg.toString());
    }

    component_destroy() {
        this.hpText.destroy();
        this.hpIcon.destroy();
        this.dmgText.destroy();
        this.dmgIcon.destroy();
    }

    updatePosition() {
        this.hpIcon.setPosition(this.x - 50, this.y + 100);
        this.hpText.setPosition(this.hpIcon.x + 20, this.hpIcon.y - 13)

        this.dmgIcon.setPosition(this.x, this.y + 100)
        this.dmgText.setPosition(this.dmgIcon.x + 20, this.dmgIcon.y - 13);

        if (this.body.velocity.x > -800) {
            this.body.velocity.x -= 50;
        }
    }
}

function getRandomNumber(max) {
    return Math.floor(Math.random() * max)
}

class EndScreen extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, waves, playerRecord) {
        super(scene, x, y, texture);
        this.height = this.texture.height
        this.width = this.texture.width
        this.waves = waves
        this.playerRecord = playerRecord
        this.setInteractive()

        this.TEXTS = {
            new_record:
                {
                    text: "Это ваш новый рекорд",
                    style: {
                        fontSize: "20px",
                        fill: "#000000"
                    }
                },
            you_died: {
                text: "Вы умерли",
                style: {
                    fontSize: "30px",
                    fill: "#000000"
                }
            }

        }

        if (this.isUserRecord()) {
            this.record_text = scene.add.text(
                this.x + this.width,
                this.y + this.height,
                this.TEXTS.new_record.text,
                this.TEXTS.new_record.style
            );
        }

        this.died_text = scene.add.text(
            this.x - 80,
            this.y - 150,
            this.TEXTS.you_died.text,
            this.TEXTS.you_died.style
        )

        scene.add.existing(this);
        this.bringToTop()


    }

    isUserRecord() {
        return this.waves >= this.playerRecord
    }

    show() {

    }

    destroy(fromScene) {
        super.destroy(fromScene)
    }

    bringToTop() {
        this.scene.children.bringToTop(this.died_text);
    }
}
