// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

import BulletSelectButton from './BulletSelectButton'
import Player from './Player'
import PlayerBullet from './PlayerBullet';
import { globalVar, CompPath } from './utils';
// 贩卖菜单
@ccclass
export default class SaleMenu extends cc.Component {

    // 贩卖的子弹
    bullet: BulletSelectButton

    // 卷轴贴图节点
    @property(cc.Node)
    Scroll: cc.Node = null;
    // 攻击力
    @property(cc.Node)
    Attack: cc.Node = null;
    // 速度
    @property(cc.Node)
    Speed: cc.Node = null;
    // 射速
    @property(cc.Node)
    RPK: cc.Node = null;
    // 购买按钮
    @property(cc.Node)
    BuyButton: cc.Node = null;
    // 购买提示
    @property(cc.Node)
    TipLabel: cc.Node = null;
    // 卷轴价钱
    @property(cc.Node)
    ScrollValue: cc.Node = null;
    // 现在金币数
    @property(cc.Node)
    CurrentCoin: cc.Node = null;

    // 是否可卖
    salable:boolean = false
    start () {
        // 点击购买按钮
        this.BuyButton.on(cc.Node.EventType.TOUCH_END,(event:cc.Event.EventTouch)=>{
            if(this.salable){
                this.buy()
            }
        })
    }

    buy(){
        this.bullet.sale()
        globalVar.coinValue -= this.bullet.bulletValue
        cc.find(CompPath.CoinValue).getComponent(cc.Label).string =
            globalVar.coinValue.toString().padStart(2, "0");
        cc.find(CompPath.Player).getComponent(Player).bulletPre = this.bullet.bulletPrefab
        cc.find(CompPath.Player).getComponent(Player).changeBullet()
        // 关闭弹窗
        globalVar.gamePause = false
        globalVar.topMenuShow = false
        cc.find(CompPath.SaleMenu).active = false
    }

    // 修改商品
    changeBullet(newBullet:BulletSelectButton){
        this.bullet = newBullet
        let bulletInfo = this.bullet.bulletPrefab.data.getComponent(PlayerBullet)
        // 修改商品信息
        this.Scroll.getComponent(cc.Sprite).spriteFrame = this.bullet.scrollSprite
        // 数值
        this.Attack.getComponent(cc.Label).string = bulletInfo.attack.toString().padStart(2,'0')
        this.Speed.getComponent(cc.Label).string = bulletInfo.speed.toString().padStart(3,'0')
        this.RPK.getComponent(cc.Label).string = bulletInfo.rpk.toString().padStart(3,'0')
        this.ScrollValue.getComponent(cc.Label).string = this.bullet.bulletValue.toString().padStart(2,'0')
        this.CurrentCoin.getComponent(cc.Label).string = globalVar.coinValue.toString().padStart(2,'0')

        // 检查是否钱够
        if(globalVar.coinValue < this.bullet.bulletValue){
            this.TipLabel.getComponent(cc.Label).string = "Sorry, You Cant Afford This"
            this.BuyButton.getComponent(cc.Button).interactable = false
            this.salable = false
        }else{
            this.TipLabel.getComponent(cc.Label).string = "Sure To Buy This Scroll?"
            this.BuyButton.getComponent(cc.Button).interactable = true
            this.salable = true
        }
    }
    // update (dt) {}
}
