// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import PlayerBullet from './PlayerBullet';
import {AudioPath} from './utils'

@ccclass
export default class AudioController extends cc.Component { 

    // bgm控制器
    @property(cc.Node)
    bgmController: cc.Node = null

    // 音效控制器
    @property(cc.Node)
    effectController: cc.Node = null
    
    // UI音效控制器
    @property(cc.Node)
    UIController: cc.Node = null
    
    // 捡拾物品控制器
    @property(cc.Node)
    pickupController: cc.Node = null
    
    // 射击控制器
    @property(cc.Node)
    shootController: cc.Node = null
    
    // 敌人控制器
    @property(cc.Node)
    enemyController: cc.Node = null
    
    // 玩家控制器
    @property(cc.Node)
    playerController: cc.Node = null
    start () {

    }

    playEffect(audioController:cc.Node, audioPath: string | cc.AudioClip){
        if(typeof(audioPath) == 'string'){
            cc.resources.load(audioPath,cc.AudioClip, (error:Error, assets:cc.AudioClip)=>{
                if(error){
                    console.error(error)
                    return
                }
                let controller = audioController.getComponent(cc.AudioSource)
                controller.clip = assets
                controller.play()
            })
        }else{
            let controller = audioController.getComponent(cc.AudioSource)
            controller.clip = audioPath
            controller.play()
        }
    }

    // 取消按钮被点击
    playCancelBtnClick(){
        this.playEffect(this.UIController, AudioPath.buttonHigh)
    }
   // 按钮被点击
   playBtnClick(){
       this.playEffect(this.UIController, AudioPath.buttonClick)
   }
   // 游戏结束
   playGameEnd(){
    this.playEffect(this.UIController, AudioPath.GameOver)
   }
   // 游戏胜利
   playGameWin(){
    this.playEffect(this.UIController, AudioPath.win)
   }

   // 玩家受伤
   playerHurt(){
    this.playEffect(this.playerController, AudioPath.hurt)
   }
   
   // 击中敌人
   hitEnemy(){
    this.playEffect(this.enemyController, AudioPath.hit)
   }

   // 敌人死亡
   killEnemy(){
    this.playEffect(this.enemyController, AudioPath.kill)
   }

   // 射击
   playShoot(audio: cc.AudioClip){
        this.playEffect(this.shootController ,audio)
   }
   // 金币
   playCoin(){
    this.playEffect(this.pickupController, AudioPath.coin)
   }
   // 爱心
   playHeart(){
    this.playEffect(this.pickupController, AudioPath.heart)
   }
   // 加速发射魔药
   playShootPotion(){
    this.playEffect(this.pickupController, AudioPath.shootPotion)
   }
   // 多发魔弹饭团
   playMultiShootPotion(){
    this.playEffect(this.pickupController, AudioPath.multiShootPotion)
   }
}
