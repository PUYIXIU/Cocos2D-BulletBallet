// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import { CompPath, changeSprite, globalVar } from "./utils";
import Animator from './Animator'
enum ButtonType {
    "Pause Button" = 0,
    "Quit Button" = 1,
    "Restart Button" = 2,
    "Start Button" = 3,
    "About Button" = 4,
    "Return Button" = 5,
    "Confirm Button" = 6,
    "Reset Button" = 7,
}

@ccclass
export default class MenuButton extends cc.Component {

    @property({
        type:cc.Enum(ButtonType)
    })
    type = 0

    update(){
        if(globalVar.topMenuShow){
            if(this.type == 0 || this.type == 1){
                this.node.getComponent(cc.Button).interactable = false     
            }
        }else{
            this.node.getComponent(cc.Button).interactable = true   
        }
    }

    start () {

        // })

        this.node.on(cc.Node.EventType.TOUCH_END, (event:cc.Event.EventTouch) => {
            switch(this.type){
                case 0: this.Pause(); break;
                case 1: this.Quit(); break;
                case 2: this.Restart(); break;
                case 3: this.GameStart(); break;
                case 4: this.ShowAbout(true); break;
                case 5: this.ShowAbout(false); break;
                case 6: this.ConfirmSetting(); break;
                case 7: this.ResetSetting(); break;
                default:break;
            }
        })
    }
    // 游戏暂停
    Pause(){
        globalVar.gamePause = true
        globalVar.topMenuShow = true
        cc.find(CompPath.PauseMenu).active = true
    }
    // 确定设置菜单
    ConfirmSetting(){
        cc.find(CompPath.PauseMenu).active = false
        globalVar.gamePause = false
        globalVar.topMenuShow = false
    }
    // 重置菜单的设置
    ResetSetting(){

    }
    Quit(){
        globalVar.gameOver = true
        globalVar.topMenuShow = true
        cc.find(CompPath.Player).getComponent(Animator).stop()
        cc.resources.load(['img/chara/master/Item','img/chara/master/Dead'], cc.SpriteFrame,(error:Error, assets:cc.SpriteFrame[])=>{
            this.schedule(()=>cc.find(CompPath.Player).getComponent(cc.Sprite).spriteFrame = assets[0],0,1,0.1)
            this.schedule(()=>cc.find(CompPath.Player).getComponent(cc.Sprite).spriteFrame = assets[1],0,1,0.5)
            this.schedule(()=>cc.find(CompPath.GameOverMenu).active = true,0,1,1.5)
        })
    }
    /** 游戏重开 */
    Restart(){
        
        // 重置金币数
        globalVar.coinValue = 0
        cc.find(CompPath.CoinValue).getComponent(cc.Label).string = globalVar.coinValue.toString().padStart(2, "0");
        
        // 重制爱心数
        globalVar.heartValue = globalVar.initHeart
        cc.find(CompPath.HeartValue).getComponent(cc.Label).string = globalVar.heartValue.toString().padStart(2, "0");

        // 重置时间
        globalVar.heartValue = globalVar.initTime
        cc.find(CompPath.LastTimeValue).getComponent(cc.Label).string = "00 : " + globalVar.lastTime.toString().padStart(2,'0')

        cc.find(CompPath.GameOverMenu).active = false
        cc.find(CompPath.GameWinMenu).active = false
        globalVar.gameOver = false
        globalVar.topMenuShow = false
        
        const clearType = [
            'Coin',
            'Enemy',
            'EnemyBullet',
            'PlayerBullet',
        ]
        // 清空当前屏幕
        cc.find(CompPath.MainGameWindow).children.forEach((node:any)=>{
            if(clearType.includes(node?._prefab?.root?.name)){
                node.destroy()
            }
        })
        cc.find(CompPath.Player).getComponent(Animator).play()
    }
    /**
     * 开始游戏
     */
    GameStart(){
        cc.find(CompPath.StartLayer).active = false
        globalVar.gameStart = true
        
    }
    ShowAbout(isAbout:boolean){
        cc.find(CompPath.GameStartMenu).active = !isAbout
        cc.find(CompPath.AboutMenu).active = isAbout
    }
}
