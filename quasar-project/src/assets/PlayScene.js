import {Scene} from 'phaser'
import bg from "../assets/background/bg_ground1_spr_0.png"
import bgClouds from "../assets/background/bg_clouds1_spr_0.png"
import bgSky from "../assets/background/bg_sky1_spr_0.png"
import mainTower from "../assets/towers/towerS_0.png"
import milk from "../assets/towers/towerS_1.png"
import cat from "../assets/towers/towerS_2.png"
import guard from "../assets/towers/towerS_3.png"
import glass from "../assets/towers/towerS_5.png"
import obsidian from "../assets/towers/towerS_20.png"
import stairs from "../assets/towers/towerS_14.png"
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
import dustSpritesheet from "../assets/sprites/dust_spritesheet.png"
import roundsFlag from "../assets/sprites/flag_with_rounds.png"
import description from "../assets/sprites/description.png"
import towerInfoBg from "../assets/sprites/progressbar_green_bg_1.png"
import reroll_sprite from "../assets/sprites/reroll_sprite.png"
import explosion_sprite from "../assets/sprites/explosion_sprite_v1.png"
import setting_button from "../assets/sprites/spr_settings.png"
import shovel from "../assets/sprites/shovel.png"
import stor from "../store.js"
import axios from "axios";
import router from "src/router/index.js";

export default class PlayScene extends Scene {

    constructor() {
        super({key: 'PlayScene'})
        this.router = router;
        console.log('Router initialized:', this.router);
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
        this.load.image('stairs', stairs)
        this.load.image('towerInfoBg', towerInfoBg)
        this.load.image('obsidian', obsidian)
        this.load.image('hpIcon', hp)
        this.load.image('glass', glass)
        this.load.image('dmgIcon', dmg)
        this.load.image('coin', coin)
        this.load.image('money', money)
        this.load.image('shopPlate', shop_plate)
        this.load.image('turnBtn', turnBtn)
        this.load.image('slot', slot)
        this.load.image('shopLine', shopLine)
        this.load.image('loseBackground', loseBackground)
        this.load.image('roundsFlag', roundsFlag)
        this.load.image('description', description)
        this.load.image('setting_button', setting_button)
        this.load.image('shovel', shovel)
        this.load.spritesheet('enemyAttack', enemies_attack_sprite, {
            frameWidth: 192,
            frameHeight: 192,
        });
        this.load.spritesheet('tower_destroy', tower_destroy_sprite, {
            frameWidth: 224,
            frameHeight: 224,
        });
        this.load.spritesheet('towerFall', dustSpritesheet, {
            frameWidth: 324,
            frameHeight: 124,
        });
        this.load.spritesheet('ghost_destroy', ghost_destroy_sprite, {
            frameWidth: 179,
            frameHeight: 217,
        });
        this.load.spritesheet('reroll_button', reroll_sprite, {
            frameWidth: 96,
            frameHeight: 101
        });
        this.load.spritesheet('explosion', explosion_sprite, {
            frameWidth: 100,
            frameHeight: 100
        })
    }

    create(child) {
        // GAME CONFIG
        this.es = null

        this.deleteMode = false

        this.width = this.scale.width
        this.height = this.scale.height

        this.bgSky = this.add.image(this.width / 2, this.height / 2, 'bgSky')
        this.bgCluds = this.add.tileSprite(0, 0, this.width, 645, 'bgClouds').setOrigin(0, 0).setScrollFactor(1, 1);
        this.bg = this.add.sprite(this.width / 2, this.height / 2, 'bg')
        this.setBgScale(this.bg)
        this.setBgScale(this.bgSky)

        this.money = 11

        this.count_slots = 10
        this.count_shop_slots = 7
        this.count_tower_types = 8

        this.show_start = 225
        this.platform_start = 640
        this.step_sprite = 130

        this.wave = 0

        this.shop_towers = []
        this.towers = []
        this.slots = []
        this.enemies = []
        this.shop_plates = []

        this.platform = this.physics.add.staticGroup();
        this.platform.create(0, this.platform_start + 75, null).setScale(800, 0.01).setOrigin(0, 0).refreshBody();

        this.physics.add.collider(this.towers, this.platform, this.collidePlatform, null, this);
        this.physics.add.collider(this.towers, this.enemies, this.hitEnemy, null, this);


        for (let i = 1; i < this.count_slots; ++i) {
            this.slots.push(this.add.sprite(140 + this.step_sprite * i, this.platform_start, 'slot').setInteractive().setAlpha(0))
            this.slots[i - 1].input.dropZone = true
            this.slots[i - 1].dropZoneIndex = i - 1;
        }

        this.shopLine = this.add.sprite(0 - 1400, this.platform_start + 150, 'shopLine').setScale(0.8).setOrigin(0, 0)

        this.towers.push(this.add.existing(new MainTower(this)))
        this.generateShop(this.shop_towers, this.shop_plates)

        this.tweens.add({
            targets: [...this.shop_towers, this.shopLine, ...this.shop_plates, ...this.shop_towers.map(el => el.container)],
            x: '+=1400',
            duration: 1000,
            ease: 'Power2',
            onStart: () => {
                this.shop_towers.forEach((element) => {
                    element.disableInteractive()
                })
            },
            onComplete: () => {
                this.shop_towers.forEach((element) => {
                    element.setupInteractive();
                });
            },
        });

        this.towers[0].on('pointerover', (pointer, localX, localY, event) => {
            this.towers[0].showDescription(pointer.x, pointer.y)
        });

        this.towers[0].on('pointermove', (pointer, localX, localY, event) => {
            this.towers[0].showDescription(pointer.x, pointer.y)
        })

        this.towers[0].on('pointerout', () => {
            this.towers[0].hideDescription()
        });

        this.input.on('dragstart', function (pointer, gameObject) {
            gameObject.bringToTop();
            gameObject.setTint(0xeeeeee);
            gameObject.hideDescription()
            gameObject.toggleAbilityOfShowingDescription()
        }, this);

        this.input.on('drag', (pointer, gameObject, dragX, dragY, dropZone) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
            gameObject.updatePosition(gameObject.x, gameObject.y)
        });

        this.input.on('dragenter', (pointer, gameObject, dropZone) => {
            if (this.slots[dropZone.dropZoneIndex] !== 0) {
                dropZone.setTexture(gameObject.texture)
                dropZone.setTint(0x00ff00);
                dropZone.setScale(0.5)
            } else if (this.towers[dropZone.dropZoneIndex].constructor.name === gameObject.constructor.name) {
                dropZone.setTint(0x00ff00);
            }

        });

        this.input.on('dragleave', (pointer, gameObject, dropZone) => {
            if (this.slots[dropZone.dropZoneIndex] !== 0) {
                dropZone.setScale(1)
                dropZone.setTexture('slot')
            }
            dropZone.clearTint();
        });
        this.input.on('drop', (pointer, gameObject, dropZone) => {
            console.log(this.towers[dropZone.dropZoneIndex])
            if (this.slots[dropZone.dropZoneIndex] !== 0) {
                dropZone.setScale(1)
                dropZone.setTexture('slot')
                dropZone.clearTint();
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                gameObject.updatePosition(gameObject.x, gameObject.y)
                dropZone.setTint(0x00ff00)
                dropZone.destroy();
                let index = dropZone.dropZoneIndex
                this.towers[index] = gameObject
                this.towers[index].nameText.y -= 15
                this.towers[index].levelText.setAlpha(1)
                this.towers[index].expText.setAlpha(1)
                this.towers[index].infoBg.setAlpha(1)
                this.towers[index].body.setAllowGravity(true)
                this.towers[index].body.setImmovable(false)
                this.towers[index].y -= 800
                this.towers[index].input.draggable = false
                this.towers[index].input.dropZone = true
                this.towers[index].dropZoneIndex = dropZone.dropZoneIndex
                this.slots[index] = 0
                this.money -= gameObject.cost;
                this.moneyText.setText(this.money.toString());
                gameObject.shop_info_destroy()
                index = this.shop_towers.indexOf(gameObject);
                this.shop_plates[index].destroy()
                this.shop_plates.splice(index, 1);
                this.shop_towers.splice(index, 1);
            } else if (this.towers[dropZone.dropZoneIndex].constructor.name === gameObject.constructor.name) {
                dropZone.clearTint();
                let index = this.shop_towers.indexOf(gameObject);
                this.shop_towers[index].component_destroy()
                this.shop_towers[index].destroy()
                this.money -= gameObject.cost;
                this.moneyText.setText(this.money.toString());
                index = this.shop_towers.indexOf(gameObject);
                this.shop_plates[index].destroy()
                this.shop_plates.splice(index, 1);
                this.shop_towers.splice(index, 1);

                let tower = this.towers[dropZone.dropZoneIndex]
                tower.gainExp(5)

            } else {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
                gameObject.updatePosition(gameObject.x, gameObject.y)
            }


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
            gameObject.toggleAbilityOfShowingDescription()
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

        this.towerDeleteButton = this.add.sprite(250, 20, 'shovel', 0).setOrigin(0, 0).setScale(0.7, 0.7).setInteractive();
        this.towerDeleteButton.on("pointerdown", () => {
            if (!this.deleteMode) {
                this.towerDeleteButton.setTint(0xc1c1c1)
                console.log(1)

                this.towerDeleteButton.setFrame(1);


                this.deleteMode = true
                for (let i = 1; i < this.towers.length; i++) {
                    console.log(i)

                    this.towers[i]?.on("pointerdown", () => {
                        console.log(this.towers[i])
                        this.towers[i].component_destroy()
                        this.towers[i].destroy()
                        this.towers[i] = 0
                        this.slots[i] = this.add.sprite(140 + this.step_sprite * (i), this.platform_start, 'slot').setInteractive().setAlpha(0.4)
                        this.slots[i].input.dropZone = true
                        this.slots[i].dropZoneIndex = i

                        this.generateAnimation()
                        console.log("smth")
                    })
                }

                // for (let slot of this.slots) {
                //     this.tweens.add({
                //         targets: slot,
                //         alpha: 0, // Конечная прозрачность (полностью видимый)
                //         duration: 500, // Длительность анимации в миллисекундах TODO
                //         ease: 'Power2', // Тип easing
                //         onComplete: () => {
                //             console.log(1)
                //         }
                //     });
                // }
            } else {
                this.deleteMode = false
                this.towerDeleteButton.clearTint()


                this.towerDeleteButton.setFrame(0);

                for (let i = 1; i < this.towers.length; i++) {
                    this.towers[i]?.on("pointerdown", () => {

                    })
                }
            }

        })
        //setting button
        const settingButton = this.add.image(this.width - 20, 0, 'setting_button').setOrigin(1, 0).setInteractive();


        settingButton.on('pointerover', () => {
            settingButton.setTint(0xA5A5A5);
        });


        settingButton.on('pointerout', () => {
            settingButton.clearTint();
        });


        settingButton.on('pointerdown', () => {
            this.router.push('/menu');
        });


        // Create the rerollButton
        this.rerollButton = this.add.sprite(1270, 850, 'reroll_button', 0).setOrigin(0.5, 0.5).setInteractive();

        this.add.existing(this.rerollButton);

        this.children.bringToTop(this.rerollButton);
        this.rerollButton.on('pointerover', () => {
            this.rerollButton.setFrame(1);
        });

        this.rerollButton.on('pointerout', () => {
            this.rerollButton.setFrame(0);
        });
        this.rerollButton.on("pointerdown", () => {
            if (this.money > 1) {
                this.money -= 2
                this.rerollShop()
                this.moneyText.setText(this.money.toString());
            }
        })
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
        this.moneyIcon = this.add.sprite(0, 0, 'money').setOrigin(0, 0);
        this.moneyText = this.add.text(55, 27, this.money.toString(), {
            fontSize: '35px',
            fill: '#f1ff9b',
            textAlign: 'center',
            justifyItems: 'center'
        }).setOrigin(0, 0);

        // Добавляем обработчик событий на кнопку
        this.startWaveButton.on('pointerdown', this.startWave, this);


        //создаю анимацию удара врагов по башне
        this.anims.create({
            key: 'attack',
            frames: this.anims.generateFrameNumbers('enemyAttack', {start: 0, end: 10}),
            frameRate: 24,
            repeat: 0
        });

        //создаю анимацию удара врагов по башне
        this.anims.create({
            key: 'dust',
            frames: this.anims.generateFrameNumbers('towerFall', {start: 0, end: 10}),
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
        const explosionFrames = this.anims.generateFrameNumbers("explosion", {start: 0, end: 41});
        this.anims.create({
            key: 'towerExplosion',
            frames: explosionFrames,
            frameRate: 60,
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
            let x_pos = (this.step_sprite + 40) * i + 90 - 1400
            let y_pos = this.platform_start + 295

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
                case 5:
                    shop_tower = new Glass(this, x_pos, y_pos + 15)
                    break
                case 6:
                    shop_tower = new Stairs(this, x_pos, y_pos + 15)
                    break
                case 7:
                    shop_tower = new Obsidian(this, x_pos, y_pos + 15)
                    break
            }
            shop_towers.push(this.add.existing(shop_tower))
            for (let slot of this.slots) {
                if (slot) {
                    shop_tower.on('pointerover', (pointer, localX, localY, event) => {
                        this.tweens.add({
                            targets: slot,
                            alpha: 0.4, // Конечная прозрачность (полностью видимый)
                            duration: 500, // Длительность анимации в миллисекундах
                            ease: 'Power2', // Тип easing
                        });

                        shop_tower.showDescription(pointer.x, pointer.y)


                    });

                    shop_tower.on('pointermove', (pointer, localX, localY, event) => {
                        shop_tower.showDescription(pointer.x, pointer.y)
                    })

                    shop_tower.on('pointerout', () => {
                        this.tweens.add({
                            targets: slot,
                            alpha: 0, // Конечная прозрачность (полностью видимый)
                            duration: 300, // Длительность анимации в миллисекундах
                            ease: 'Power2', // Тип easing
                        });

                        shop_tower.hideDescription()
                    });
                }
            }
            this.children.bringToTop(this.shopLine);
        }
    }

    generateAnimation() {
        for (let i = 0; i < this.shop_towers.length; ++i) {
            let shop_tower = this.shop_towers[i]
            for (let slot of this.slots) {
                if (slot) {
                    shop_tower.on('pointerover', (pointer, localX, localY, event) => {
                        this.tweens.add({
                            targets: slot,
                            alpha: 0.4, // Конечная прозрачность (полностью видимый)
                            duration: 500, // Длительность анимации в миллисекундах
                            ease: 'Power2', // Тип easing
                        });

                        shop_tower.showDescription(pointer.x, pointer.y)


                    });

                    shop_tower.on('pointermove', (pointer, localX, localY, event) => {
                        shop_tower.showDescription(pointer.x, pointer.y)
                    })

                    shop_tower.on('pointerout', () => {
                        this.tweens.add({
                            targets: slot,
                            alpha: 0, // Конечная прозрачность (полностью видимый)
                            duration: 300, // Длительность анимации в миллисекундах
                            ease: 'Power2', // Тип easing
                        });

                        shop_tower.hideDescription()
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

    rerollShop() {
        this.clearShop(this.shop_towers, this.shop_plates)
        this.generateShop(this.shop_towers, this.shop_plates)
        this.tweens.add({
            targets: [...this.shop_towers, ...this.shop_plates, ...this.shop_towers.map(el => el.container)],
            x: '+=1400',
            duration: 1000,
            ease: 'Power2',
            onStart: () => {
                this.shop_towers.forEach((element) => {
                    element.disableInteractive()
                })
            },
            onComplete: () => {
                this.shop_towers.forEach((element) => {
                    element.setupInteractive();
                    for (let tower of this.shop_towers) {
                        console.log(this.shop_towers)
                        if (tower.input !== null) {
                            if (tower.cost > this.money) {
                                tower.input.enabled = false
                                tower.setTint(0x6c6c6c)
                            }
                        }
                    }
                });
            },
        });
    }

    startWave() {
        this.roundsFlagText.text = (parseInt(this.roundsFlagText.text) + 1).toString();
        for (let i = 0; i < this.towers.length; i++) {
            if (this.towers[i]) {
                this.towers[i].buff(i);
            }
        }

        this.tweens.add({
            targets: [...this.shop_towers, this.shopLine, ...this.shop_plates, ...this.shop_towers.map(el => el.container)],
            x: '-=1400',
            duration: 1000,
            ease: 'Power2',
            onStart: () => {

                this.shop_towers.forEach((element) => {
                    element.disableInteractive()
                })
            },
            onComplete: () => {
                this.clearShop(this.shop_towers, this.shop_plates)
                this.shop_towers.forEach((element) => {
                    element.setupInteractive();
                });
            },
        });

        this.wave++;
        this.startWaveButtonContainer.setVisible(false);
        this.roundsFlagContainer.setVisible(false)
        // this.clearShop(this.shop_towers, this.shop_plates)
        for (let i = 0; i < 5; i++) {
            this.enemies.push(this.add.existing(new Enemy(this, this.width + 50 * i, this.platform_start - 30, 'ghost', this.wave * 2, this.wave * 2)))
        }
        this.tweens.add({
            targets: [...this.enemies, ...this.enemies.map(el => el.hpText)
                , ...this.enemies.map(el => el.hpIcon)
                , ...this.enemies.map(el => el.dmgText)
                , ...this.enemies.map(el => el.dmgIcon)],
            x: '-=300',
            duration: 800,
            ease: 'Power2',
            onComplete: () => {
                this.enemies.forEach((enemy) => {
                    enemy.arrived = true
                })
            },
        });


    }

    endWave() {
        this.startWaveButtonContainer.setVisible(true);
        this.roundsFlagContainer.setVisible(true)
        this.generateShop(this.shop_towers, this.shop_plates)
        this.tweens.add({
            targets: [...this.shop_towers, this.shopLine, ...this.shop_plates, ...this.shop_towers.map(el => el.container)],
            x: '+=1400',
            duration: 1000,
            ease: 'Power2',
            onStart: () => {
                this.shop_towers.forEach((element) => {
                    element.disableInteractive()
                })
            },
            onComplete: () => {
                this.shop_towers.forEach((element) => {
                    element.setupInteractive();
                });
            },
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

    collidePlatform(tower, platform) {
        if (!tower.collided) {
            tower.collided = true
            tower.body.setAllowGravity(false)
            tower.body.setImmovable(true)
            const dustAnim = this.add.sprite(tower.x, platform.y, 'towerFall').setOrigin(0.5, 1);
            dustAnim.play('dust');
            dustAnim.on('animationcomplete', () => {
                dustAnim.destroy();
            });
        }
    }

    hitEnemy(tower, enemy) {
        const attackAnim = this.add.sprite(enemy.x - 100, enemy.y, 'enemyAttack');

        attackAnim.play('attack');
        attackAnim.on('animationcomplete', () => {
            attackAnim.destroy();
        });
        tower.hp -= enemy.dmg;
        enemy.hp -= tower.dmg;

        this.tweens.add({
            targets: this.enemies[0],
            angle: 20, // Конечная прозрачность (полностью видимый)
            duration: 500, // Длительность анимации в миллисекундах
            ease: 'Power2', // Тип easing
        });

        tower.updateHPText();
        enemy.updateHPText();


        if (tower.hp <= 0) {
            if (tower.constructor.name !== "MainTower") {
                const destroyAnim = this.add.sprite(tower.x, tower.y, 'tower_destroy');
                try {
                    destroyAnim.play('destroy');
                } catch (error) {
                    console.error('Error playing destroy animation:', error);
                }
                destroyAnim.on('animationcomplete', () => {
                    destroyAnim.destroy();
                });
            }
            if (tower.constructor.name === "Glass") {
                this.towers[0].dmg += Math.ceil(tower.dmg * 0.2 * tower.level)
                this.towers[0].updateDMGText()
            }
            if (tower.constructor.name === "MainTower") {
                const mainTowerAnim = this.add.sprite(tower.x, tower.y, 'explosion');
                mainTowerAnim.setScale(4);
                mainTowerAnim.on('animationcomplete', () => {
                    mainTowerAnim.destroy();
                });
                mainTowerAnim.play('towerExplosion');
                attackAnim.on('animationcomplete', () => {
                    attackAnim.destroy();
                });
                if (stor.state.username) {
                    try {
                        const response = this.get_user_record();
                        this.es = new EndScreen(
                            this,
                            900,
                            500,
                            "loseBackground",
                            this.wave,
                            response.record,
                        )
                    } catch (e) {
                        console.log(e)
                        this.es = new EndScreen(
                            this,
                            900,
                            500,
                            "loseBackground",
                            this.wave,
                            0,
                        )
                    }

                } else {
                    this.es = new EndScreen(
                        this,
                        900,
                        500,
                        "loseBackground",
                        this.wave,
                        0,
                    )
                }


                console.log(this.es)

                this.es?.on(
                    'pointerdown',
                    () => {
                        this.es.destroyComponents()
                        this.es.destroy()
                        this.removeScreen()

                        this.scene.restart()
                        console.log("data")
                    }
                )

                this.tweens.add({
                    targets: this.es.animation_targets,
                    alpha: 1,
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
            this.time.delayedCall(150, () => {
                const destroyAnim = this.add.sprite(enemy.x, enemy.y, 'ghost_destroy').setAngle(enemy.angle);
                this.physics.world.enable(destroyAnim);
                destroyAnim.body.velocity.x = enemy.body.velocity.x
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
            });
        }
    }

    async update_user_record() {
        try {
            return await axios.post("http://localhost:8000/update_user_record", {
                withCredentials: true,
                params: {
                    "username": stor.state.username,
                    "record": stor.state.record
                }
            })
        } catch (e) {
            console.log(e);
            return null;
        }

    }

    async get_user_record() {
        try {
            const response = await axios.get("http://localhost:8000/get_user_record", {
                withCredentials: true,
                params: {
                    "username": stor.state.username,
                }
            })
            return response;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    removeScreen() {
        this.es = null
    }


}

class Tower extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, hp, dmg, cost, description, draggable = true) {
        super(scene, x, y, texture);

        this.setDisplaySize(150, 150)

        scene.physics.world.enable(this);
        this.body.setAllowGravity(false);
        this.body.setGravityY(7000)
        this.body.immovable = true

        this.collided = false
        this.level = 1
        this.exp = 0
        this.neededExp = 10
        this.neededExpScale = 5
        this.dmgScale = dmg
        this.hpScale = hp
        this.default_hp = hp
        this.default_dmg = dmg
        this.hp = hp * this.level
        this.dmg = dmg * this.level
        this.cost = cost
        this.description = description
        this.draggable = draggable


        this.descriptionIcon = scene.add.sprite(x, y, 'description').setOrigin(0, 1)
        this.descriptionText = scene.add.text(x, y, this.description, {
            fontSize: '25px',
            fill: '#ffffff',
        })

        this.canShowDescription = true

        this.descriptionIcon.visible = false
        this.descriptionText.visible = false
// Add elements to the container
        this.container = scene.add.container(x, y);

        this.hpIcon = scene.add.sprite(0, 0, 'hpIcon').setOrigin(2, -2.49);
        this.hpText = scene.add.text(-33, 88, hp.toString(), {
            textAlign: 'center',
            fontSize: '25px',
            fill: '#fff'
        });

        this.dmgIcon = scene.add.sprite(0, 0, 'dmgIcon').setOrigin(0, -2.5);
        this.dmgText = scene.add.text(33, 88, dmg.toString(), {
            textAlign: 'center',
            fontSize: '25px',
            fill: '#fff'
        });

        this.coinIcon = scene.add.sprite(0, 0, 'coin').setDisplaySize(30, 30).setOrigin(2, 3.5);
        this.coinText = scene.add.text(0, 0, cost.toString(), {
            textAlign: 'center',
            fontSize: '25px',
            fill: '#fadb00'
        }).setOrigin(1.8, 4.1);

        this.nameText = scene.add.text(0, -140, '', {
            fontSize: '25px',
            fill: '#f1ff9b'
        }).setOrigin(0.5, 0.5);


        this.infoBg = scene.add.sprite(0, -130, 'towerInfoBg').setScale(1.3, 1.5).setAlpha(0)
        this.levelText = scene.add.text(0, -135, `Уровень ${this.level}`, {
            fontSize: '18px',
            fill: '#f1ff9b'
        }).setOrigin(0.5, 0.5).setAlpha(0);

        this.expText = scene.add.text(0, -120, `Опыт ${this.exp}/${this.neededExp}`, {
            fontSize: '18px',
            fill: '#f1ff9b'
        }).setOrigin(0.5, 0.5).setAlpha(0);

        this.container.add([this.infoBg, this.hpIcon, this.hpText, this.dmgIcon, this.dmgText, this.coinIcon, this.coinText, this.nameText, this.levelText, this.expText]);
        this.is_die = false
        this.scene.add.existing(this);
    }


    buff(index) {
    }

    gainExp(exp) {
        if (this.exp + exp >= this.neededExp) {
            this.level += 1
            this.exp += exp - this.neededExp
            this.neededExp += this.neededExpScale
            this.default_dmg += this.dmgScale
            this.default_hp += this.hpScale
            this.dmg += this.dmgScale
            this.hp += this.hpScale
            this.updateHPText()
            this.updateDMGText()
        } else {
            this.exp += exp
        }
        this.levelText.text = `Уровень ${this.level}`
        this.expText.text = `Опыт ${this.exp}/${this.neededExp}`

    }

    showDescription(x, y) {
        if (!this.canShowDescription) {
            return;
        }
        this.descriptionIcon.x = x
        this.descriptionText.x = x + 20
        this.descriptionIcon.y = y
        this.descriptionText.y = y - 110 + 20 * (3 - this.description.split("\n").length)
        this.descriptionIcon.visible = true
        this.descriptionText.visible = true

        this.scene.children.bringToTop(this.descriptionIcon);
        this.scene.children.bringToTop(this.descriptionText);
    }

    hideDescription() {
        this.descriptionText.visible = false
        this.descriptionIcon.visible = false
    }

    toggleAbilityOfShowingDescription() {
        this.canShowDescription = !this.canShowDescription
    }

    set_default_stats() {
        if (this.is_die) {
            this.collided = false
            this.body.setAllowGravity(true)
            this.body.setImmovable(false)
            this.y -= 800
        }
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
        this.levelText.destroy()
        this.expText.destroy()
        this.infoBg.destroy()
        this.hpText.destroy();
        this.hpIcon.destroy();
        this.dmgText.destroy();
        this.dmgIcon.destroy();
        this.nameText.destroy();
        this.descriptionText.destroy();
        this.descriptionIcon.destroy()
        this.shop_info_destroy()
    }

    shop_info_destroy() {
        this.coinIcon.destroy();
        this.coinText.destroy();

    }

    updatePosition(dragX, dragY) {
        this.container.setPosition(dragX, dragY);
    }

    hide() {
        this.setAlpha(0);
        this.container.setAlpha(0);
        this.nameText.setAlpha(0);
        this.descriptionIcon.setAlpha(0);
        this.descriptionText.setAlpha(0);
    }

    show() {
        this.container.setAlpha(1);
        this.nameText.setAlpha(1);
        this.descriptionIcon.setAlpha(1);
        this.descriptionText.setAlpha(1);
        this.setAlpha(1)
    }

    bringToTop() {
        this.scene.children.bringToTop(this.container);
        this.scene.children.bringToTop(this.descriptionIcon);
        this.scene.children.bringToTop(this.descriptionText);
        this.scene.children.bringToTop(this);
    }

    setupInteractive() {
        this.setInteractive({draggable: this.draggable})
    }


}

class MainTower extends Tower {
    constructor(scene) {
        super(scene, 140, scene.platform_start, "mainTower", 5, 1, 0,
            "это главная башня.",
            false
        );
        this.shop_info_destroy()
        this.nameText.text = "Ратуша"

        this.descriptionText = scene.add.text(100, scene.platform_start, this.description, {
            fontSize: '25px',
            fill: '#ffffff'
        }).setOrigin(-0.23, 3)

        this.descriptionText.visible = false
    }

    buff(index) {
        this.scene.money += 6;
    }

}

class Chest extends Tower {
    constructor(scene, x, y) {
        super(scene, x, y, "chest", 2, 1, 5,
            "это сундук."
        );
        this.nameText.text = "Сундук"

    }

    buff(index) {
        if (this.is_die) {
            this.is_die = false;
            return;
        }

        this.scene.money++;
        if (this.scene.towers[index - 1] && this.scene.towers[index - 1].constructor.name === "MainTower") {
            this.scene.money += this.level;
        }
    }
}

class Cat extends Tower {
    constructor(scene, x, y) {
        super(scene, x, y, "cat", 3, 2, 3,
            "это кот."
        );
        this.nameText.text = "Кот"

    }
}

class Milk extends Tower {
    constructor(scene, x, y) {
        super(scene, x, y, "milk", 2, 1, 3,
            "это молоко."
        );
        this.nameText.text = "Молоко"
    }

    buff(index) {
        for (let i = index; i < index + this.level; ++i) {
            if (i === this.scene.towers.length - 1 || this.scene.towers[i + 1] == null) {
                return;
            }
            if (this.scene.towers[i + 1].constructor.name === "Cat") {
                this.scene.towers[i + 1].default_hp += 2 * this.scene.towers[i + 1].level
                this.scene.towers[i + 1].default_dmg += 2 * this.scene.towers[i + 1].level
            } else {
                this.scene.towers[i + 1].default_hp += this.level;
            }
            this.scene.towers[i + 1].set_default_stats()
        }

    }
}

class Guard extends Tower {
    constructor(scene, x, y) {
        super(scene, x, y, "guard", 2, 1, 3,
            " это гуард."
        );
        this.nameText.text = "Страж"
    }

    buff() {
        if (this.is_die) {
            for (let tower of this.scene.towers) {
                if (tower && tower.constructor.name === "Obsidian") {
                    tower.default_hp += this.default_hp;
                    tower.default_dmg += this.default_dmg;
                    tower.hp += this.default_hp;
                    tower.dmg += this.default_dmg;
                    tower.updateDMGText();
                    tower.updateHPText();

                } else if (tower) {
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
        super(scene, x, y, "thief", 1, 2, 3,
            "это вор."
        );
        this.nameText.text = "Вор"
    }

    buff(index) {
        if (this.scene.towers[index - 1] != null &&
            this.scene.towers[index - 1].constructor.name === "Chest") {

            this.scene.towers[index - 1].dmg += 5 * this.level;
            this.scene.towers[index - 1].updateHPText();
            this.scene.towers[index - 1].updateDMGText();
            this.scene.money++;
        }
        if (index !== this.scene.towers.length - 1 &&
            this.scene.towers[index + 1] != null &&
            this.scene.towers[index + 1].constructor.name === "Chest") {

            this.scene.towers[index + 1].dmg += 5 * this.level
            this.scene.towers[index + 1].updateHPText();
            this.scene.towers[index + 1].updateDMGText();
            this.scene.money++;
        }
    }

}

class Glass extends Tower {
    constructor(scene, x, y) {
        super(scene, x, y, "glass", 1, 2, 3,
            "Если ломается\nпередает урон ГБ\nПосле волны увеличивает\n свой урон на 1"
        );
        this.nameText.text = "Стекло"
    }

    buff() {
        this.default_dmg += this.level
        this.updateDMGText();
    }
}

class Stairs extends Tower {
    constructor(scene, x, y) {
        super(scene, x, y, "stairs", 1, 2, 3,
            "Нужна только одна\n    для улучшения"
        );
        this.neededExp = 5
        this.neededExpScale = 0
        this.nameText.text = "Лестница"
        this.nameText.setFontSize('23px')
    }

}

class Obsidian extends Tower {
    constructor(scene, x, y) {
        super(scene, x, y, "obsidian", 1, 2, 5,
            "Сохраняет временные \n   бонусы"
        );
        this.nameText.text = "Обсидиан"
        this.nameText.setFontSize('23px')
    }

}


class Enemy extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, hp, dmg) {
        super(scene, x, y, texture);

        scene.physics.world.enable(this);
        this.body.velocity.x = 0
        this.body.setAllowGravity(false);
        this.body.bounce.set(1.5, 0)

        this.hp = hp
        this.dmg = dmg
        this.arrived = false

        this.hpIcon = scene.add.sprite(x - 60, y + 115, 'hpIcon');
        this.hpText = scene.add.text(this.hpIcon.x + 20, this.hpIcon.y - 15, hp.toString(), {
            textAlign: 'center',
            fontSize: '30px',
            fill: '#fff'
        })

        this.dmgIcon = scene.add.sprite(x + 15, y + 115, 'dmgIcon');
        this.dmgText = scene.add.text(this.dmgIcon.x + 20, this.dmgIcon.y - 13, dmg.toString(), {
            textAlign: 'center',
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
        this.hpIcon.setPosition(this.x - 60, this.y + 115);
        this.hpText.setPosition(this.hpIcon.x + 20, this.hpIcon.y - 13)

        this.dmgIcon.setPosition(this.x, this.y + 115)
        this.dmgText.setPosition(this.dmgIcon.x + 20, this.dmgIcon.y - 13);

        if (this.body.velocity.x === 0 && this.arrived) {
            this.scene.tweens.add({
                targets: this,
                angle: -20,
                duration: 800,
                ease: 'Power2',
            });
        }
        if (this.body.velocity.x > -800 && this.arrived) {
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

        this.animation_targets = [this]

        this.TEXTS = {
            not_authorised: {
                text: "Вы не авторизованы",
                style: {
                    fontSize: "30px",
                    fill: "#ffffff"
                }
            },

            waves_text: {
                text: "количество пройденных волн: " + (this.waves).toString(),
                style: {
                    fontSize: "30px",
                    fill: "#ffffff"
                }
            },

            record_text: {
                text: "ваш рекорд: " + stor.state.record.toString(),
                style: {
                    fontSize: "30px",
                    fill: "#ffffff"
                }
            },

            new_record: {
                text: "Это ваш новый рекорд",
                style: {
                    fontSize: "30px",
                    fill: "#ffffff"
                }
            },
            you_died: {
                text: "Поражение(скрытопулые вруинили)",
                style: {
                    fontSize: "30px",
                    fill: "#600000"
                }
            }

        }
        // if (stor.state.username)
        this.record_text = scene.add.text(
            this.x - 350,
            this.y,
            this.TEXTS.record_text.text,
            this.TEXTS.record_text.style
        )

        this.animation_targets.push(this.record_text)

        if (!stor.state.username) {
            this.not_authorised_text = scene.add.text(
                this.x - 150,
                this.y - 55,
                this.TEXTS.not_authorised.text,
                this.TEXTS.not_authorised.style
            )
            this.animation_targets.push(this.not_authorised_text)
        }

        if (this.isUserRecord() && stor.state.username) {
            this.new_record_text = scene.add.text(
                this.x + 60,
                this.y + 80,
                this.TEXTS.new_record.text,
                this.TEXTS.new_record.style
            );
            this.animation_targets.push(this.new_record_text)
        }

        this.waves_text = scene.add.text(
            this.x - 350,
            this.y + 30,
            this.TEXTS.waves_text.text,
            this.TEXTS.waves_text.style
        )
        this.animation_targets.push(this.waves_text)

        this.died_text = scene.add.text(
            this.x - 100,
            this.y - 150,
            this.TEXTS.you_died.text,
            this.TEXTS.you_died.style
        )
        this.animation_targets.push(this.died_text)


        scene.add.existing(this);
        this.bringToTop()

        this.setAlpha(0)
        this.not_authorised_text?.setAlpha(0)
        this.died_text.setAlpha(0)
        this.record_text?.setAlpha(0)
        this.new_record_text?.setAlpha(0)
        this.waves_text.setAlpha(0)
    }

    isUserRecord() {
        return this.waves >= this.playerRecord
    }

    destroyComponents() {
        this.record_text?.destroy()
        this.died_text.destroy()
    }

    bringToTop() {
        this.scene.children.bringToTop(this);
        this.scene.children.bringToTop(this.died_text);
        this.scene.children.bringToTop(this.record_text);
        this.scene.children.bringToTop(this.new_record_text);
        this.scene.children.bringToTop(this.not_authorised_text);
        this.scene.children.bringToTop(this.waves_text);
    }
}
