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
        this.load.image('clouds_bg', clouds_bg)
        this.load.image('mountains', mountains)
        this.load.image('clouds_mg_3', clouds_mg_3)
        this.load.image('clouds_mg_2', clouds_mg_2)
        this.load.image('clouds_mg_1', clouds_mg_1)


    }

    create() {
        const width = this.scale.width
        const height = this.scale.height
        this.layer1 = this.add.image(width/2,  height/2, 'sky')
        this.layer2 = this.add.image(width/2,  height/2,'clouds_bg')
        this.layer3 = this.add.image(width/2,  height/2,'mountains')
        this.layer4 = this.add.image(width/2,  height/2,'clouds_mg_3')
        this.layer5 = this.add.image(width/2,  height/2,'clouds_mg_2')
        this.layer6 = this.add.image(width/2,  height/2,'clouds_mg_1')
        let bg = [this.layer1, this.layer2, this.layer3, this.layer4, this.layer5, this.layer6]
        console.log(bg)
        for (let i = 0; i < 6; ++i) {
            this.setBgScale(bg[i], height)
        }


    }


    update() {

    }
    setBgScale(img, height) {
        img.displayWidth = img.displayWidth * height / img.displayHeight
        img.displayHeight = height
    }
}
