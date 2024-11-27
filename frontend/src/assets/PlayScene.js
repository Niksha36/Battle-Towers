import {Scene} from 'phaser'
import store from "@/store";
import bg from "../assets/background/background.png"
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


export default class PlayScene extends Scene {

    constructor() {
        super({key: 'PlayScene'})
    }

    preload() {
        this.load.image('bg', bg)
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

        this.add.graphics()
            .fillStyle(0x6b6c6b, 1)
            .fillRect(0, 0, 150, 150) 
            .setAlpha(0.5)
            .generateTexture('gray', 90, 150);

    }

    create(child) {
        // GAME CONFIG
        this.width = this.scale.width
        this.height = this.scale.height

        this.bg = this.add.image(this.width / 2, this.height / 2, 'bg')
        this.setBgScale(this.bg, this.height)

        this.money = 11
        
        this.count_slots = 10
        this.count_shop_slots = 7
        this.count_tower_types = 5

        this.show_start = 250
        this.platform_start = 655
        this.step_sprite = 130
    
        this.wave = 0

        this.shop_towers = []
        this.towers = []
        this.slots = []
        this.enemies = []
        this.shop_plates = []

        this.physics.add.collider(this.towers, this.enemies, this.hitEnemy, null, this);

        // this.main_tower = this.physics.add.sprite(10, this.height - 324, "layer1").setOrigin(0, 0).setScale(0.2, 0.5).setImmovable(true).setInteractive({draggable: true});
        // this.main_tower.body.setAllowGravity(false)
        // this.main_tower.setBounce(0, 0.2);
        // this.main_tower.setCollideWorldBounds(true);
        // this.physics.add.collider(this.main_tower, this.platform);
        // this.main_tower.inputEnabled = true;


        for (let i = 1; i < this.count_slots; ++i) {
            this.slots.push(this.add.sprite(50 + this.step_sprite * (i),  this.platform_start - 150, 'gray').setOrigin(0, 0).setInteractive())
            this.slots[i-1].input.dropZone = true
            this.slots[i-1].dropZoneIndex = i;
        }

        this.towers.push(this.add.existing(new MainTower(this)))
        this.generateShop(this.shop_towers, this.shop_plates)

        this.input.on('dragstart', function (pointer, gameObject) {
            gameObject.bringToTop();
            gameObject.setTint(0xeeeeee);
        }, this);

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;

            if (gameObject) {
                gameObject.updatePosition(dragX, dragY)
            }
        });
        this.input.on('drop', (pointer, gameObject, dropZone) => {
            if (gameObject.cost > this.money) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
                gameObject.updatePosition(gameObject.x, gameObject.y)
                return;
            }
            
            this.money -= gameObject.cost; 
            this.moneyText.setText(this.money.toString());

            gameObject.x = dropZone.x + dropZone.displayWidth / 2 - gameObject.displayWidth / 2;;
            gameObject.y = dropZone.y;

            gameObject.updatePosition(gameObject.x, gameObject.y)
            dropZone.setTint(0x00ff00)
            dropZone.destroy();
            gameObject.shop_info_destroy()

            gameObject.input.enabled = false;
            this.towers[dropZone.dropZoneIndex] = gameObject
            this.shop_towers = this.shop_towers.filter(item => item !== gameObject);
        });

        this.input.on('dragend', (pointer, gameObject, dropped) => {
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
                gameObject.updatePosition(gameObject.x, gameObject.y)
            }
        });

        this.startWaveButton = this.add.text(this.width - 250, this.height - 100, 'Start Wave', {
            fontSize: '32px',
            fill: '#fff'
        })
            .setOrigin(0, 0)
            .setInteractive();
        
        this.add.sprite(146, 50, 'money');
        this.moneyText = this.add.text(100, 35, this.money.toString(), {
            fontSize: '32px',
            fill: '#fff'
        });

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
            this.enemies[0].updatePosition()
        }
    }

    setBgScale(img, height) {
        img.displayWidth = img.displayWidth * height / img.displayHeight
        img.displayHeight = height
    }

    generateShop(shop_towers, shop_plates) {
        for (let i = 0; i < this.count_shop_slots; ++i) {
            let x_pos = (this.step_sprite + 30) * i + 30
            let y_pos = this.height - this.show_start
            
            shop_plates.push(this.add.sprite(x_pos + 75, y_pos + 75, "shopPlate").setScale(1, 0.8));
            let shop_tower;
            switch(getRandomNumber(this.count_tower_types)) {
                case 0: 
                    shop_tower = new Chest(this, x_pos, y_pos)
                    break
                case 1:
                    shop_tower = new Cat(this, x_pos, y_pos)
                    break
                case 2:
                    shop_tower = new Milk(this, x_pos, y_pos)
                    break
                case 3:
                    shop_tower = new Guard(this, x_pos, y_pos)
                    break
                case 4:
                    shop_tower = new Thief(this, x_pos, y_pos)
                    break
            }

            shop_towers.push(this.add.existing(shop_tower))
        }
    }

    clearShop(shop_towers, shop_plates) {
        for (let i = 0; i < shop_towers.length; ++i) {
            shop_towers[i].destroy()
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
        for (let slot of this.slots) {
            if (slot) {
                slot.setAlpha(0)
            }
        }

        for (let i = 0; i < this.towers.length; i++) {
            if (this.towers[i]) {
                this.towers[i].buff(i);
            }
        }

        this.wave++;
        this.startWaveButton.setVisible(false);
        this.clearShop(this.shop_towers, this.shop_plates)
        for (let i = 0; i < 5; i++) {
            this.enemies.push(this.add.existing(new Enemy(this, this.width - 300 + 30*i, this.platform_start - 197, 'ghost', this.wave + 1, this.wave + 1)))
        }
        this.enemies[0].body.velocity.x = -800
    }

    endWave() {
        this.startWaveButton.setVisible(true);
        this.generateShop(this.shop_towers, this.shop_plates)

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

        for (let slot of this.slots) {
            if (slot) {
                slot.setAlpha(1)
            }
        }

        this.moneyText.setText(this.money.toString());
    }

    hitEnemy(tower, enemy) {
        tower.hp -= enemy.dmg;
        enemy.hp -= tower.dmg;

        tower.updateHPText();
        enemy.updateHPText();

        if (tower.hp <= 0) {
            if (tower.constructor.name == "MainTower") {
                console.log("GAME OVER")

            }
            tower.is_die = true
            tower.hide();
            tower.body.enable = false
        }

        if (enemy.hp <= 0) {
            this.enemies.shift()
            enemy.destroy()
            enemy.component_destroy();
            if (this.enemies.length === 0) {
                this.endWave()
            }
        }
    }


}

class Tower extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, hp, dmg, cost, draggable=true) {
        super(scene, x, y, texture);

        this.setOrigin(0, 0)
        this.setInteractive({draggable: draggable})
        this.scaleX = 0.5
        this.scaleY = 0.5

        scene.physics.world.enable(this);
        this.body.setAllowGravity(false);
        this.body.immovable = true

        this.default_hp = hp
        this.default_dmg = dmg
        this.hp = hp
        this.dmg = dmg
        this.cost = cost
     
        this.hpIcon = scene.add.sprite(x + this.width/6 - 10, y + this.height/1.8, 'hpIcon');
        this.hpText = scene.add.text(x + this.width/6 + 10, y + this.height/1.8 - 5, hp.toString(), {
            fontSize: '16px',
            fill: '#fff'
        })

        this.dmgIcon = scene.add.sprite(x + this.width/6 + 50, y + this.height/1.8, 'dmgIcon');
        this.dmgText = scene.add.text(x + this.width/6 + 70, y + this.height/1.8 - 5, dmg.toString(), {
            fontSize: '16px',
            fill: '#fff'
        })

        this.coinIcon = scene.add.sprite(x + this.width/6, y, 'coin');
        this.coinText = scene.add.text(x + this.width/6 + 30, y - 8, cost.toString(), {
            fontSize: '16px',
            fill: '#fff'
        })

        this.nameText = scene.add.text(x + this.width/6 + 70, y + this.height/1.8 - 5, this.constructor.name, {
            fontSize: '16px',
            fill: '#fff'
        })
        
        
        this.is_die = false
        this.scene.add.existing(this);
    }

    buff(index) {}

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
        this.nameText.destroy();
    }

    updatePosition(dragX, dragY) {
        this.hpText.x = dragX + this.width/6 + 10;
        this.hpIcon.x = dragX + this.width/6 - 10;
        this.hpText.y = dragY + this.height/1.8 - 5;
        this.hpIcon.y = dragY + this.height/1.8;
       
        this.dmgText.y = dragY + this.height/1.8 - 5;
        this.dmgIcon.y = dragY + this.height/1.8;
        this.dmgText.x = dragX + this.width/6 + 70;
        this.dmgIcon.x = dragX + this.width/6 + 50;
        
        this.coinIcon.x = dragX + this.width/6;
        this.coinText.x = dragX + this.width/6 + 30;
        this.coinIcon.y = dragY;
        this.coinText.y = dragY - 8;

    }

    hide() {
        this.setAlpha(0);
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
        super(scene, 20, scene.platform_start - 150, "mainTower", 5, 1, 0, false);
        this.shop_info_destroy()
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
        if (this.is_die) {
            this.is_die = false;
            return; 
        }

        this.scene.money++; 
        if (this.scene.towers[index - 1] && this.scene.towers[index - 1].constructor.name == "MainTower") {
            this.scene.money++;
        }
    }
}

class Cat extends Tower {
    constructor(scene, x, y) {
        super(scene, x, y, "cat", 3, 2, 3);
    }
}

class Milk extends Tower {
    constructor(scene, x, y) {
        super(scene, x, y, "milk", 2, 1, 3, true, true);
    }

    buff(index) {
        if (index == this.scene.towers.length - 1 || this.scene.towers[index + 1] == null) {
            return;
        }
        
        if (this.scene.towers[index + 1].constructor.name == "Cat") {
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
    }

    buff (index) {
        if (this.scene.towers[index - 1] != null &&
            this.scene.towers[index - 1].constructor.name == "Chest") {

            this.scene.towers[index - 1].dmg += 5;
            this.scene.towers[index - 1].updateHPText();
            this.scene.towers[index - 1].updateDMGText();
            this.scene.money++;
        }
        if (index != this.scene.towers.length - 1 && 
            this.scene.towers[index + 1] != null &&
            this.scene.towers[index + 1].constructor.name == "Chest") {
                
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

        this.setOrigin(0, 0)
        scene.physics.world.enable(this);
        this.body.velocity.x = 0
        this.body.setAllowGravity(false);
        this.body.bounce.set(1, 0)
        
        this.hp = hp
        this.dmg = dmg

        this.hpIcon = scene.add.sprite(x + this.width/6, y + this.height, 'hpIcon');
        this.hpText = scene.add.text(x + this.width/6 + 20, y + this.height - 5, hp.toString(), {
            fontSize: '16px',
            fill: '#fff'
        })

        this.dmgIcon = scene.add.sprite(x + this.width/6 + 60, y + this.height, 'dmgIcon');
        this.dmgText = scene.add.text(x + this.width/6 + 80, y + this.height - 5, dmg.toString(), {
            fontSize: '16px',
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
        this.hpIcon.x = this.x + this.width / 6;
        this.hpText.x = this.x + this.width / 6 + 20;
        this.dmgIcon.x = this.x + this.width / 6 + 60;
        this.dmgText.x = this.x + this.width / 6 + 80;

        this.hpIcon.y = this.y + this.height;
        this.hpText.y = this.y + this.height - 5;
        this.dmgIcon.y = this.y + this.height;
        this.dmgText.y = this.y + this.height - 5;

        if (this.body.velocity.x > -800) {
            this.body.velocity.x -= 70;
        }
    }
}

function getRandomNumber(max) {
    return Math.floor(Math.random() * max)
}
