// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import { CompPath, globalVar } from "./utils";

@ccclass
export default class PlayerBullet extends cc.Component {

    // 子弹射击声音
    @property(cc.AudioClip)
    shootAudio:cc.AudioClip = null

    // 子弹射速
    @property
    speed:number = 100;

    // 子弹伤害
    @property
    attack:number = 15;

    // 子弹射速
    @property
    rpk:number = 0.5;

    scrollWidth:number = 0
    scrollHeight:number = 0
    
    onLoad(){
        this.scrollWidth = cc.view.getFrameSize().width
        this.scrollHeight = cc.view.getFrameSize().height
    }


    start () {

    }

    update (dt) {
        if(globalVar.gamePause) return

        let radian = (this.node.angle + 90) * Math.PI / 180

        this.node.x += this.speed * Math.cos(radian)*dt
        this.node.y += this.speed * Math.sin(radian)*dt

        // this.node.y += this.speed * dt
        if(this.node.y - this.node.height/2 > cc.find(CompPath["MainGameWindow"]).height){
            this.node.destroy()
        }
    }
}
