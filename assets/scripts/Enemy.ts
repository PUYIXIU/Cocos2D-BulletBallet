// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import { colliderTag, CompPath, globalVar } from "./utils";
import Animator from "./Animator";
import Player from './Player'
import PlayerBullet from './PlayerBullet'
import AudioController from "./AudioController";

@ccclass
export default class Enemy extends cc.Component {

    // 移动速度
    @property
    moveSpeed:number = 100

    // 血量
    @property 
    heart:number = 30

    /** 子弹预制件 */
    @property(cc.Prefab)
    bulletPre:cc.Prefab = null;

    scrollWidth:number = 0
    scrollHeight:number = 0

    isDeath:boolean = false

    shootController = null

    /** 子弹射击速度 */
    @property
    shootSpeed:number = 1

    /** 被击中后的闪烁时间 */
    @property
    blinkTime: number = 0.5
    inBlink:boolean = false

    audio:AudioController = null
    onLoad(){
        this.scrollWidth = cc.view.getFrameSize().width
        this.scrollHeight = cc.view.getFrameSize().height
    }

    start () {
        this.audio = cc.find(CompPath.AudioController).getComponent(AudioController)
        this.node.on("death",this.death)
        this.shootController = setInterval(()=>{
            if(this.bulletPre){
                this.shoot()
            }
        }, this.shootSpeed * 1000) 
    }

    blink_dir = 1
    blinkStep = 5
    blinkController = null
    update (dt) {
        if(globalVar.gamePause) return
        this.node.y -= this.moveSpeed * dt
        // 由于敌人突破防线而降低的心心值
        if(this.node.y + this.node.height/2 < cc.find(CompPath["MainGameWindow"]).height - this.scrollHeight){
            clearInterval(this.shootController)
            this.node.destroy()
            // 并非游戏结束
            if(!globalVar.gameOver) cc.find(CompPath.Player).getComponent(Player).getHurt()
        }
        if(this.inBlink){
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
    }
    onDestroy(): void {
        clearInterval(this.shootController)
        // console.log('敌人被销毁')    
    }

    death(enemy: cc.Node){
        this.isDeath = true
        cc.resources.load('img/effect/smoke/smoke', cc.SpriteAtlas, (error:Error, assets:cc.SpriteAtlas)=>{
            if(error){
                console.error(error)
            }
            enemy.getComponent(Animator).setAnimationFrames(assets, 1).then(res=>{
                enemy.destroy()
            })
        })
    }

    // 敌人发射子弹
    shoot(){
        if(globalVar.gamePause) return
        const bullet = cc.instantiate(this.bulletPre)
        bullet.x = this.node.x
        bullet.y = this.node.y
        bullet.setParent(cc.find(CompPath.MainGameWindow))
    }


    // 敌人被子弹击中
    onCollisionEnter(other:cc.Collider | any, self:cc.Collider):void{
        if(!this.isDeath){
            if(other.tag == colliderTag["PLAYER_BULLET_SNOW"]){
                // 生命值降低
                this.heart -= other.node.getComponent(PlayerBullet).attack
                other.node.destroy()
                if(this.heart <= 0){
                    // 死亡
                    clearInterval(this.shootController)
                    this.death(this.node)
                    this.audio.killEnemy()
                }else{
                    // 闪烁表示受伤
                    // 清空之前的定时器
                    if(this.blinkController){
                        clearTimeout(this.blinkController)
                        this.blinkController = null
                    }
                    this.audio.hitEnemy()
                    this.inBlink = true
                    this.blinkController = setTimeout(()=>{
                        this.inBlink = false
                    },this.blinkTime*1000)
                }
            }
        }
    }
}

