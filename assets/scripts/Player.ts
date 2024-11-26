// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { colliderTag, globalVar, CompPath, AudioPath } from "./utils";
import Animator from './Animator'
import PlayerBullet from "./PlayerBullet";
import AudioController from "./AudioController";
import Enemy from "./Enemy";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {
  /** 移动速度 */
  @property
  moveSpeed: number = 100;

  /** 移动延迟 */
  @property
  moveDuration: number = 8;

  /** 射击速度 */
  shootSpeed: number = 0;
  shootController = null
  shootMulti:number = 1

  /** 子弹预制件 */
  @property(cc.Prefab)
  bulletPre:cc.Prefab = null;

  /** 目标坐标 */
  targetPosition = {
    x: 0,
    y: 0,
  };
  
  /** 可移动的最大y值 */
  maxY:number = 0

  /** 可移动的x值范围 */
  minX:number = 0
  maxX:number = 0;
  
  isMoving: boolean = false;

  // 受伤后无敌时间
  @property
  hurtTime: number = 1
  hurtable: boolean = true

  emoji: cc.Node = null
  @property
  emojiStay: number = 2

  // 是否是散射
  isMultiShoot: boolean = false

  
  audio:AudioController = null
  start() {
    this.audio = cc.find(CompPath.AudioController).getComponent(AudioController)
    this.shootSpeed = this.bulletPre.data.getComponent(PlayerBullet).rpk
    this.emoji = this.node.getChildByName("Emoji")

    this.targetPosition.x = this.node.x;
    this.targetPosition.y = this.node.y;

    this.maxY = this.node.getParent().height - cc.find(CompPath.TitleMenu).height - this.node.height

    let xPad = 15
    this.minX = xPad + this.node.width/2
    this.maxX = this.node.getParent().width + xPad - this.node.width

    this.moveByTouch()

    this.shootController = setInterval(()=>{this.shoot()},this.bulletPre.data.getComponent(PlayerBullet).rpk*1000)
  }

  // 换弹
  changeBullet(){
    clearInterval(this.shootController)
    this.shootController = setInterval(()=>{this.shoot()},this.bulletPre.data.getComponent(PlayerBullet).rpk * this.shootMulti *1000)
  }

  moveByTouch(){
    const touchWindow = cc.find(CompPath.MainGameWindow)
    const titleMenu = cc.find(CompPath.TitleMenu)
    const maxY = titleMenu.y - titleMenu.height
    touchWindow.on(cc.Node.EventType.TOUCH_START,(event:cc.Event.EventTouch)=>{
      if(globalVar.gamePause) return
        this.isMoving = true
    })
    touchWindow.on(cc.Node.EventType.TOUCH_END,(event:cc.Event.EventTouch)=>{
      if(globalVar.gamePause) return
        this.isMoving = false
    })
    touchWindow.on(cc.Node.EventType.TOUCH_CANCEL,(event:cc.Event.EventTouch)=>{
      if(globalVar.gamePause) return
        this.isMoving = false
    })
    touchWindow.on(cc.Node.EventType.TOUCH_MOVE,(event:cc.Event.EventTouch)=>{
        if(globalVar.gamePause) return
        if(this.isMoving){
            let ex = event.getLocationX(), ey = event.getLocationY()
            if(ey - touchWindow.y <=0  || ey >= maxY) {
                return
            }else if(ex <= this.minX || ex >= (this.maxX + 15)){
                return
            }
            this.targetPosition.x = ex - 15
            this.targetPosition.y =ey - touchWindow.y
        }
    })
  }


  /** 射击 */
  shoot() {
    if(globalVar.gamePause || globalVar.gameOver || !globalVar.gameStart) return
    if(!this.isMultiShoot){
      const bullet = cc.instantiate(this.bulletPre)
      bullet.x = this.node.x
      bullet.y = this.node.y + this.node.height/2
      bullet.setParent(cc.find(CompPath.MainGameWindow))
    }else{
      let total = 3
      for(let i = 0; i< total; i++){
        const bullet = cc.instantiate(this.bulletPre)
        bullet.angle = (i - 1) * 15
        bullet.x = this.node.x
        bullet.y = this.node.y + this.node.height/2
        bullet.setParent(cc.find(CompPath.MainGameWindow))
      }
    }

    this.audio.playShoot(this.bulletPre.data.getComponent(PlayerBullet).shootAudio)
  }

  onCollisionEnter(other: cc.Collider, self: cc.Collider): void {
    if(globalVar.gameOver) return
    switch (other.tag) {
      case colliderTag["COIN"]:
        this.getCoin(other, self);
        break;
      case colliderTag["HEART"]:
        this.getHeart(other, self);
        break;
      case colliderTag["ENEMY_SPIRIT_BULLET"]:
        this.getShoot(other, self);
        break;
      case colliderTag["ENEMY_SPIRIT"]:
        this.getFight(other, self);
        break;
      case colliderTag["SHOOT_POTION"]:
        this.getShootPotion(other, self);
        break;
      case colliderTag["MULTI_SHOOT_ITEM"]:
        this.multiShoot(other, self);
        break;
    }
  }

 
  blink_dir = 1
  blinkStep = 5
  update(dt) {
    if(!this.hurtable){
      this.node.color = new cc.Color(184, 172, 223)
      this.node.opacity += (255 / this.blinkStep) * this.blink_dir
      if(this.node.opacity >=255 ){
        this.node.opacity = 255
        this.blink_dir = -1
      }
      if(this.node.opacity<= 0){
        this.node.opacity = 0
        this.blink_dir = 1
      }
    }else{
      this.node.color = new cc.Color(255, 255, 255)
      this.node.opacity = 255
    }
    if(globalVar.gameOver) return
    this.node.x +=
      (this.targetPosition.x - this.node.x) / this.moveDuration;
    this.node.y +=
      (this.targetPosition.y - this.node.y) / this.moveDuration;
  }

  /**
   * 获取金币
   */
  getCoin(other: cc.Collider, self: cc.Collider) {
    other.node.destroy();
    // 金币音效
    this.audio.playCoin()
    // 金币的上限是99
    if(globalVar.coinValue >= 99) return
    globalVar.coinValue++;
    // this.changeEmoji('img/ui/emoji/emote12')
    cc.find(CompPath.CoinValue).getComponent(cc.Label).string =
      globalVar.coinValue.toString().padStart(2, "0");
  }
  /**
   * 获取爱心
   */
  getHeart(other: cc.Collider, self: cc.Collider) {
    other.node.destroy();
    // 金币音效
    this.audio.playHeart()
    if(globalVar.heartValue>= 5) return
    globalVar.heartValue++;
    this.changeEmoji('img/ui/emoji/emote27')
    cc.find(CompPath.HeartValue).getComponent(cc.Label).string =
      globalVar.heartValue.toString().padStart(2, "0");
  }
  @property
  multiShootTime:number = 5
  multiShootInterval = null
  /**
   * 散射
   */
  multiShoot(other: cc.Collider, self: cc.Collider) {
    other.node.destroy();
    this.audio.playMultiShootPotion()
    if(this.isMultiShoot) return
    this.changeEmoji('img/ui/emoji/emote27')
    this.isMultiShoot = true
    
    // 存在散射时间限制
    this.multiShootInterval = setTimeout(()=>{
      this.isMultiShoot = false
      clearTimeout(this.multiShootInterval)
    },this.multiShootTime * 1000)
  }
  changeEmoji(path){
    cc.resources.load(path, cc.SpriteFrame,(error:Error,assets:cc.SpriteFrame)=>{
      if(error){
        console.error(error)
        return
      }
      this.emoji.active = true
      this.emoji.getComponent(cc.Sprite).spriteFrame = assets
      setTimeout(()=>{
        this.emoji.active = false
      }, this.emojiStay * 1000)
  
    })
  }
  /**
   * 获取发射子弹魔药
   */
  getShootPotion(other: cc.Collider, self: cc.Collider) {
    other.node.destroy();
    this.audio.playShootPotion()
    if(this.shootMulti <= 0.5) return
    this.shootMulti *- 0.9
    clearInterval(this.shootController)
    this.shootController = setInterval(()=>{this.shoot()},this.bulletPre.data.getComponent(PlayerBullet).rpk * this.shootMulti *1000)
    this.changeEmoji('img/ui/emoji/emote12')

  }

  /**
   * 被子弹击中
   */
  getShoot(other: cc.Collider, self: cc.Collider) {
    // 不处于无敌时间
    if(this.hurtable){
      other.node.destroy();
      this.getHurt();
      this.changeEmoji('img/ui/emoji/emote4')
      this.hurtable = false
      setTimeout(()=>{
        this.hurtable = true
      },this.hurtTime * 1000)
  }
  }

  /**
   * 直接遭遇敌人
   * 1. 扣血
   * 2. 播放敌人爆炸东湖
   */
  getFight(other: cc.Collider, self: cc.Collider) {
    let enemy = other.node.getComponent(Enemy)
    if(enemy.isDeath) return
    this.getHurt();
    other.node.emit("death", other.node);
  }

  /** 掉血 */
  getHurt() {
      // 不处于无敌时间
      globalVar.heartValue--;
      if(globalVar.heartValue < 0) globalVar.heartValue= 0
      cc.find(CompPath.HeartValue).getComponent(cc.Label).string = globalVar.heartValue.toString().padStart(2, "0");
      // 角色死亡，游戏结束
      if (globalVar.heartValue == 0) {
        this.audio.playGameEnd()
        globalVar.gameOver = true
        this.node.getComponent(Animator).stop()
        cc.resources.load('img/chara/master/Dead',cc.SpriteFrame,(error:Error, assets: cc.SpriteFrame)=>{
          if(error){
            console.error(error)
          }
          this.node.getComponent(cc.Sprite).spriteFrame = assets
          // 显示游戏结束画面
          setTimeout(()=>{
            cc.find(CompPath.GameOverMenu).active = true
          },1000)
        })
      }else{
        // 播放受伤音效
        this.audio.playerHurt()
      }
  }

  // 清空状态
  clearStatus(){
    this.isMultiShoot = false
    this.shootMulti = 1
  }

}
