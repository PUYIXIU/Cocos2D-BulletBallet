// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import { CompPath, globalVar } from "./utils";

import SaleMenu from "./SaleMenu";
import Player from './Player'

@ccclass
export default class BulletSelectButton extends cc.Component {

    // 子弹价钱
    @property
    bulletValue:number = 0

    // 是否可用
    @property(cc.Boolean )
    isSaled: boolean = true

    // 子弹预制件
    @property(cc.Prefab)
    bulletPrefab: cc.Prefab = null
    // 商品卷轴贴图
    @property(cc.SpriteFrame)
    scrollSprite: cc.SpriteFrame = null

    // 未解锁的金币蒙版
    maskLayer: cc.Node = null

    // 解锁后的卷轴
    scrollLayer: cc.Node = null

    // 蒙版颜色
    maskColor:cc.Color = new cc.Color(97,97,97)
    // 原本的颜色
    noMaskColor:cc.Color = new cc.Color(255,255,255)
    
    start () {

        this.maskLayer = this.node.getChildByName('SaleLayer')
        this.scrollLayer = this.node.getChildByName('ScrollFire')

        // 子弹价钱赋值
        this.maskLayer
            .getChildByName('scrollValue')
            .getComponent(cc.Label).string = this.bulletValue + '';

        if(!this.isSaled){
            // 仍未解锁
            this.maskLayer.active = true
            this.scrollLayer.active = false
            this.node.color = this.maskColor
        }else{
            // 已经解锁
            this.maskLayer.active = false
            this.scrollLayer.active = true
            this.node.color = this.noMaskColor
        }

        this.node.on(cc.Node.EventType.TOUCH_END, (event:cc.Event)=>{
            this.handleClick()
        })
    }

    // 贩卖出去
    sale(){
        this.isSaled = true
        this.maskLayer.active = false
        this.scrollLayer.active = true
        this.node.color = this.noMaskColor
    }

    handleClick(){
        if(this.isSaled){
            // 已经解锁，换弹
            cc.find(CompPath.Player).getComponent(Player).bulletPre = this.bulletPrefab
            cc.find(CompPath.Player).getComponent(Player).changeBullet()
        }else{
            // 未解锁，暂停游戏，贩卖弹窗弹出
            globalVar.gamePause = true
            globalVar.topMenuShow = true
            cc.find(CompPath.SaleMenu).active = true
            // 贩卖弹窗换弹
            cc.find(CompPath.SaleMenu).getComponent(SaleMenu).changeBullet(this)
        }
    }
    // update (dt) {}
}
