import {Scene} from 'phaser'
import store from "@/store";
import bg from "../assets/background/background.png"
import mainTower from "../assets/towers/towerS_0.png"
import milk from "../assets/towers/towerS_1.png"
import cat from "../assets/towers/towerS_2.png"
import guard from "../assets/towers/towerS_3.png"
import chest from "../assets/towers/towerS_4.png"
import ghost from "../assets/towers/diss_ghost_0.png"
import hp from "../assets/towers/spr_sword_1.png"
import dmg from "../assets/towers/spr_sword_0.png"


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
        this.load.image('ghost', ghost)
        this.load.image('hpIcon', hp)
        this.load.image('dmgIcon', dmg)

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
        
        this.count_slots = 10
        this.count_shop_slots = 7
        this.count_tower_types = 3

        this.show_start = 250
        this.platform_start = 655
        this.step_sprite = 130
        
        this.bg = []

        this.wave = 0

        this.shop_towers = []
        this.towers = []
        this.slots = []

        // USER CONFIG
        this.money = 11

        this.enemies = []

        this.physics.add.collider(this.towers, this.enemies, this.hitEnemy, null, this);

        this.bg = this.add.image(this.width / 2, this.height / 2, 'bg')
        this.setBgScale(this.bg, this.height)

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
        this.generateShop(this.shop_towers)

        this.input.on('dragstart', function (pointer, gameObject) {
            this.children.bringToTop(gameObject);
            gameObject.setTint(0xeeeeee);
        }, this);

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;

            if (gameObject) {
                this.setStatsPosition(gameObject, dragX, dragY)
            }
        });
        this.input.on('drop', (pointer, gameObject, dropZone) => {
            gameObject.x = dropZone.x + dropZone.displayWidth / 2 - gameObject.displayWidth / 2;;
            gameObject.y = dropZone.y;

            this.setStatsPosition(gameObject, gameObject.x, gameObject.y)
            if (gameObject.place_buff) {
                gameObject.buff(dropZone.dropZoneIndex);
            }

            dropZone.setTint(0x00ff00)
            dropZone.destroy();
            gameObject.input.enabled = false;
            this.towers[dropZone.dropZoneIndex] = gameObject
            this.shop_towers = this.shop_towers.filter(item => item !== gameObject);
        });

        this.input.on('dragend', (pointer, gameObject, dropped) => {
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
                this.setStatsPosition(gameObject, gameObject.x, gameObject.y)
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
    
    setStatsPosition(gameObject, dragX, dragY) {
        gameObject.hpText.x = dragX + gameObject.width/6 + 20;
        gameObject.hpText.y = dragY + gameObject.height/1.8 - 5;
        gameObject.hpIcon.x = dragX + gameObject.width/6;
        gameObject.hpIcon.y = dragY + gameObject.height/1.8;

        gameObject.dmgText.x = dragX + gameObject.width/6 + 80;
        gameObject.dmgText.y = dragY + gameObject.height/1.8 - 5;
        gameObject.dmgIcon.x = dragX + gameObject.width/6 + 60;
        gameObject.dmgIcon.y = dragY + gameObject.height/1.8;
    }

    setBgScale(img, height) {
        img.displayWidth = img.displayWidth * height / img.displayHeight
        img.displayHeight = height
    }

    generateShop(shop_towers) {
        for (let i = 0; i < this.count_shop_slots; ++i) {
            let x_pos = this.step_sprite * i + 1
            let y_pos =  this.height - this.show_start
            switch(getRandomNumber(this.count_tower_types)) {
                case 0: 
                    shop_towers.push(this.add.existing(new Chest(this, x_pos, y_pos)));
                    break
                case 1:
                    shop_towers.push(this.add.existing(new Cat(this, x_pos, y_pos)));
                    break
                case 2:
                    shop_towers.push(this.add.existing(new Milk(this, x_pos, y_pos)));
                    break
            }
        }
    }

    clearShop(shop_towers) {
        for (let i = 0; i < shop_towers.length; ++i) {
            shop_towers[i].destroy()
            shop_towers[i].component_destroy()
        }
        shop_towers.length = 0
    }

    startWave() {
        console.log(this.money)
        this.wave++;
        this.startWaveButton.setVisible(false);
        this.clearShop(this.shop_towers)
        this.enemies.push(this.add.existing(new Enemy(this, this.width, this.platform_start - 197, 'ghost', this.wave**2, this.wave**2)))
        this.enemies[0].body.velocity.x = -800

        for (let slot of this.slots) {
            if (slot) {
                slot.setAlpha(0)
            }
        }
    }

    endWave() {
        this.startWaveButton.setVisible(true);
        this.generateShop(this.shop_towers)

        for (let tower of this.towers) {
            if (tower) {
                tower.set_default_stats()
            }
        }

        for (let i = 0; i < this.towers.length; i++) {
            if (this.towers[i]) {
                this.towers[i].buff(i);
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

        console.log(this.money)
    }

    hitEnemy(tower, enemy) {
        tower.hp -= enemy.dmg;
        enemy.hp -= tower.dmg;

        tower.updateHPText();

        // enemy.updateHPText();

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
            if (this.enemies.length === 0) {
                this.endWave()
            }
        }
    }


}

class Tower extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, hp, dmg, cost, draggable=true, place_buff=false) {
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
        console.log(this.width)
     
        this.hpIcon = scene.add.sprite(x + this.width/6, y + this.height/1.8, 'hpIcon');
        this.hpText = scene.add.text(x + this.width/6 + 20, y + this.height/1.8 - 5, hp.toString(), {
            fontSize: '16px',
            fill: '#fff'
        })

        this.dmgIcon = scene.add.sprite(x + this.width/6 + 60, y + this.height/1.8, 'dmgIcon');
        this.dmgText = scene.add.text(x + this.width/6 + 80, y + this.height/1.8 - 5, dmg.toString(), {
            fontSize: '16px',
            fill: '#fff'
        })
        
        this.is_die = false
        this.place_buff = place_buff
        this.scene.add.existing(this);
    }

    buff(index) {}

    set_default_stats() {
        this.hp = this.default_hp
        this.dmg = this.default_dmg
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

}
class MainTower extends Tower {
    constructor(scene) {
        super(scene, 20, scene.platform_start - 150, "mainTower", 5, 1, 0, false);
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
        console.log(this.scene.towers)
        console.log(this.scene.towers[index-1])
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
        super(scene, x, y, "milk", 2, 2, 3, true, true);
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
        
        this.scene.towers[index + 1].updateHPText()
        this.scene.towers[index + 1].updateDMGText()
    }
}

function getRandomNumber(max) {
    return Math.floor(Math.random() * max)
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
