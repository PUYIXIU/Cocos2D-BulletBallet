// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import { CompPath, changeSprite, globalVar } from "./utils";
import Animator from './Animator'
import Player from "./Player";
import BackScene from './Scene'
import BulletSelectButton from "./BulletSelectButton";
import AudioController from "./AudioController";
enum ButtonType {
    "Pause Button" = 0,
    "Quit Button" = 1,
    "Restart Button" = 2,
    "Start Button" = 3,
    "About Button" = 4,
    "Return Button" = 5,
    "Confirm Button" = 6,
    "Reset Button" = 7,
    "Cancle Buy" = 8,
    "Next Level" = 9,
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

        this.node.on(cc.Node.EventType.TOUCH_END, (event:cc.Event.EventTouch) => {
            if(![3,4,5,8,9,6,2].includes(this.type) && globalVar.topMenuShow){
                cc.find(CompPath.AudioController).getComponent(AudioController).playCancelBtnClick()
                return
            }
            cc.find(CompPath.AudioController).getComponent(AudioController).playBtnClick()
            // 播放按钮被点击音效
            switch(this.type){
                case 0: this.Pause(); break;
                case 1: this.Quit(); break;
                case 2: this.Restart(); break;
                case 3: this.GameStart(); break;
                case 4: this.ShowAbout(true); break;
                case 5: this.ShowAbout(false); break;
                case 6: this.ConfirmSetting(); break;
                case 7: this.ResetSetting(); break;
                case 8: this.CancelBuy(); break;
                case 9: this.NextLevel(); break;
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

    // 取消购买
    CancelBuy(){
        globalVar.gamePause = false
        globalVar.topMenuShow = false
        cc.find(CompPath.SaleMenu).active = false
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
    Restart(isNext:boolean = false){
        
        // 如果不是下一关，
        if(!isNext){
            // 重置金币数
            globalVar.coinValue = 0
            cc.find(CompPath.CoinValue).getComponent(cc.Label).string = globalVar.coinValue.toString().padStart(2, "0");
            // 重置怪物
            cc.resources.load('prefab/SlimeEnemy', cc.Prefab, (error:Error, assets:cc.Prefab) => {
                if(error){
                    console.error(error)
                    return
                }
                cc.find(CompPath.Back).getComponent(BackScene).enemyPre = assets
            })  
            // 重置关卡
            globalVar.currentLevel = 1
            cc.find(CompPath.LevelNum).getComponent(cc.Label).string = globalVar.currentLevel.toString().padStart(2, '0')
        
            // 重置卷轴购买状态，重置子弹
            let scrollList = cc.find(CompPath.scrollList)
            let bulletNodes = scrollList.children
            cc.find(CompPath.Player).getComponent(Player).bulletPre = bulletNodes[0].getComponent(BulletSelectButton).bulletPrefab
            cc.find(CompPath.Player).getComponent(Player).changeBullet()

            for(let i = 1; i < bulletNodes.length; i++){
                let bullet = bulletNodes[i].getComponent(BulletSelectButton)
                bullet.isSaled = false
                bullet.maskLayer.active = true
                bullet.scrollLayer.active = false
                bullet.node.color = bullet.maskColor
            }

        
        }        
        cc.find(CompPath.Player).getComponent(Player).clearStatus()

        // 重制爱心数
        globalVar.heartValue = globalVar.initHeart
        cc.find(CompPath.HeartValue).getComponent(cc.Label).string = globalVar.heartValue.toString().padStart(2, "0");

        // 重置时间
        globalVar.lastTime = globalVar.initTime
        cc.find(CompPath.LastTimeValue).getComponent(cc.Label).string = "00 : " + globalVar.lastTime.toString().padStart(2,'0')

        cc.find(CompPath.GameOverMenu).active = false
        cc.find(CompPath.GameWinMenu).active = false
        globalVar.gameOver = false
        globalVar.topMenuShow = false
        
        const clearType = [
            'Coin',
            'Heart',
            'MultiShootItem',
            'ShootPotion',
            'Enemy',
            'SlimeEnemy',
            'EnemyBullet',
            'ShurikenBullet',
            'PlayerBullet',
            'EnemySkull',
            'EnemyMole',
            'EnemyMoleBullet',
            'EnemyEye',
            'EnemyEyeBullet',
        ]
        // 清空当前屏幕
        cc.find(CompPath.MainGameWindow).children.forEach((node:any)=>{
            if(clearType.includes(node?._prefab?.root?.name)){
                node.destroy()
            }
        })
        cc.find(CompPath.Player).getComponent(Animator).play()
        
        // 重新开启倒计时
        cc.find(CompPath.Back).getComponent(BackScene).counter()
    }
    /**
     * 开始游戏
     */
    GameStart(){
        cc.find(CompPath.StartLayer).active = false
        globalVar.gameStart = true
        globalVar.topMenuShow = false
        let fireWare = cc.find("fireworkBox/StartAnime")
        let fireWareAni =  fireWare.getComponent(cc.Animation)
        fireWareAni.play('StartFire')
        
    }
    ShowAbout(isAbout:boolean){
        cc.find(CompPath.GameStartMenu).active = !isAbout
        cc.find(CompPath.AboutMenu).active = isAbout
    }
    // 下一关
    NextLevel(){
        this.Restart(true)
        globalVar.currentLevel ++ 
        cc.find(CompPath.LevelNum).getComponent(cc.Label).string = globalVar.currentLevel.toString().padStart(2, '0')
        
        let sceneNode = cc.find(CompPath.Back).getComponent(BackScene)

        switch(globalVar.currentLevel){
            case 2:
                // 第二关：灵魂怪物
                cc.resources.load('prefab/Enemy', cc.Prefab, (error:Error, assets:cc.Prefab) => {
                    if(error){
                        console.error(error)
                        return
                    }
                    sceneNode.enemyPre = assets
                })
                break;
            
            case 3:
                // 第三关：头骨怪物
                cc.resources.load('prefab/EnemySkull', cc.Prefab, (error:Error, assets:cc.Prefab) => {
                    if(error){
                        console.error(error)
                        return
                    }
                    sceneNode.enemyPre = assets
                })
                break;

            case 4:
                // 第4关：Mole加农炮怪物
                cc.resources.load('prefab/EnemyMole', cc.Prefab, (error:Error, assets:cc.Prefab) => {
                    if(error){
                        console.error(error)
                        return
                    }
                    sceneNode.enemyPre = assets
                })
                break;
                

            case 5:
                // 第5关：Eye眼睛怪物
                cc.resources.load('prefab/EnemyEye', cc.Prefab, (error:Error, assets:cc.Prefab) => {
                    if(error){
                        console.error(error)
                        return
                    }
                    sceneNode.enemyPre = assets
                })
                break;
        }
        let fireWare = cc.find("fireworkBox/StartAnime")
        let fireWareAni =  fireWare.getComponent(cc.Animation)
        fireWareAni.play('StartFire')

    }
}
