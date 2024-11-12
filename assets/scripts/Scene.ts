// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { CompPath, globalVar } from "./utils";

const {ccclass, property} = cc._decorator;
import Animator from './Animator'
@ccclass
export default class NewClass extends cc.Component {


    bgs: cc.Node[] = []
    scrollHeight:number = 0 

    @property
    scrollSpeed:number = 100


    minX:number = 0
    maxX:number = 0
    maxY:number = 0
    
    timeCounter = null

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
        this.createCoin()
        this.createHeart()
        this.createPotion()
        this.createMultiShootItem()
        this.counter()
    }

    // 倒计时
    counter(){
        cc.find(CompPath.LastTimeValue).getComponent(cc.Label).string = "00 : " + globalVar.lastTime.toString().padStart(2,'0')
        this.timeCounter = setInterval(()=>{
            if(globalVar.gamePause || !globalVar.gameStart) return
            if(globalVar.lastTime == 0){
                clearInterval(this.timeCounter)
                globalVar.gameOver = true
                globalVar.topMenuShow = true
                cc.find(CompPath.Player).getComponent(Animator).stop()
                cc.resources.load(['img/chara/master/frontJump','img/chara/master/Special2'], cc.SpriteFrame,(error:Error, assets:cc.SpriteFrame[])=>{
                    this.schedule(()=>cc.find(CompPath.Player).getComponent(cc.Sprite).spriteFrame = assets[0],0,1,0.1)
                    this.schedule(()=>cc.find(CompPath.Player).getComponent(cc.Sprite).spriteFrame = assets[1],0,1,0.5)
                    this.schedule(()=>cc.find(CompPath.GameWinMenu).active = true,0,1,1.5)
                })
                return
            }
            globalVar.lastTime --
            cc.find(CompPath.LastTimeValue).getComponent(cc.Label).string = "00 : " + globalVar.lastTime.toString().padStart(2,'0')
        },1000)
    }

    @property(cc.Prefab)
    enemyPre:cc.Prefab = null
    @property
    enemyCreateInterval:number = 1
    enemyCreator = null
    // 在随机位置创建敌人
    createEnemy(){
        this.enemyCreator = setInterval(()=>{
            // 游戏暂停中
            if(globalVar.gamePause || globalVar.gameOver || !globalVar.gameStart) return
            const enemy = cc.instantiate(this.enemyPre)
            enemy.x = this.minX + Math.random() * (this.maxX - enemy.width - this.minX)  + enemy.width/2
            enemy.y = this.maxY
            enemy.setParent(cc.find(CompPath.MainGameWindow))
        },this.enemyCreateInterval * 1000)
    }

    @property(cc.Prefab)
    coinPre:cc.Prefab = null
    @property
    coinCreateInterval:number = 2
    coinCreator = null
    // 在随机位置创建金币
    createCoin(){
        this.coinCreator = setInterval(()=>{
            // 游戏暂停中
            if(globalVar.gamePause || globalVar.gameOver || !globalVar.gameStart) return
            const coin = cc.instantiate(this.coinPre)
            coin.x = this.minX + Math.random() * (this.maxX - coin.width - this.minX)  + coin.width/2
            coin.y = this.maxY
            coin.setParent(cc.find(CompPath.MainGameWindow))
        },this.coinCreateInterval * 1000)
    }
    
    @property(cc.Prefab)
    heartPre:cc.Prefab = null
    @property
    heartCreateInterval:number = 8
    heartCreator = null
    // 在随机位置创建爱心
    createHeart(){
        this.heartCreator = setInterval(()=>{
            // 游戏暂停中
            if(globalVar.gamePause || globalVar.gameOver || !globalVar.gameStart) return
            const heart = cc.instantiate(this.heartPre)
            heart.x = this.minX + Math.random() * (this.maxX - heart.width - this.minX)  + heart.width/2
            heart.y = this.maxY
            heart.setParent(cc.find(CompPath.MainGameWindow))
        },this.heartCreateInterval * 1000)
    }

    @property(cc.Prefab)
    potionPre:cc.Prefab = null
    @property
    potionCreateInterval:number = 20
    potionCreator = null
    // 在随机位置创建加速设计魔药
    createPotion(){
        this.potionCreator = setInterval(()=>{
            // 游戏暂停中
            if(globalVar.gamePause || globalVar.gameOver || !globalVar.gameStart) return
            const potion = cc.instantiate(this.potionPre)
            potion.x = this.minX + Math.random() * (this.maxX - potion.width - this.minX)  + potion.width/2
            potion.y = this.maxY
            potion.setParent(cc.find(CompPath.MainGameWindow))
        },this.potionCreateInterval * 1000)
    }

    @property(cc.Prefab)
    multiShootItem:cc.Prefab = null
    @property
    multiShootItemInterval:number = 20
    multiShootItemCreator = null
    // 在随机位置创建加速设计魔药
    createMultiShootItem(){
        this.multiShootItemCreator = setInterval(()=>{
            // 游戏暂停中
            if(globalVar.gamePause || globalVar.gameOver || !globalVar.gameStart) return
            const item = cc.instantiate(this.multiShootItem)
            item.x = this.minX + Math.random() * (this.maxX - item.width - this.minX)  + item.width/2
            item.y = this.maxY
            item.setParent(cc.find(CompPath.MainGameWindow))
        },this.multiShootItemInterval * 1000)
    }
    update (dt) {
        // 游戏未暂停
        if(!globalVar.gamePause && !globalVar.gameOver){
            this.backMove(dt)
        }
    }

    // 背景移动
    backMove(dt){
        this.node.y -= this.scrollSpeed * dt
        if(this.node.y < -this.scrollHeight){
            this.node.y = 0
        }
    }


}
