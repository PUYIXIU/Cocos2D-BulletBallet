// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { CompPath } from "./utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


    bgs: cc.Node[] = []
    scrollHeight:number = 0 

    @property
    scrollSpeed:number = 100

    @property(cc.Prefab)
    enemyPre:cc.Prefab = null

    minX:number = 0
    maxX:number = 0
    maxY:number = 0
    
    @property
    enemyCreateInterval:number = 1

    enemyCreator = null

    onLoad(){
        this.scrollHeight = cc.view.getVisibleSize().height
        cc.director.getCollisionManager().enabled = true
    }

    start () {
        let xPad = 15
        this.minX = xPad 
        this.maxX = cc.find(CompPath.MainGameWindow).width + xPad
        this.maxY = cc.view.getVisibleSize().height 
        this.createEnemy()

    }

    createEnemy(){
        this.enemyCreator = setInterval(()=>{
            const enemy = cc.instantiate(this.enemyPre)
            enemy.x = this.minX + Math.random() * (this.maxX - enemy.width - this.minX)  + enemy.width/2

            enemy.y = this.maxY
            enemy.setParent(cc.find(CompPath.MainGameWindow))
        },this.enemyCreateInterval * 1000)
    }

    update (dt) {
        this.backMove(dt)
    }

    // 背景移动
    backMove(dt){
        this.node.y -= this.scrollSpeed * dt
        if(this.node.y < -this.scrollHeight){
            this.node.y = 0
        }
    }


}
