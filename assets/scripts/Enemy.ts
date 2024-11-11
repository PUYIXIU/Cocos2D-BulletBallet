// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import { colliderTag, CompPath } from "./utils";
import Animator from "./Animator";
@ccclass
export default class Enemy extends cc.Component {

    @property
    moveSpeed:number = 100


    @property(cc.SpriteAtlas)
    deathAnimateFrames: cc.SpriteAtlas = null

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

    onLoad(){
        this.scrollWidth = cc.view.getVisibleSize().width
        this.scrollHeight = cc.view.getVisibleSize().height
    }

    start () {
        this.node.on("death",this.death)
        this.shootController = setInterval(()=>{
            this.shoot()
        }, this.shootSpeed * 1000) 
    }

    update (dt) {
        this.node.y -= this.moveSpeed * dt
        if(this.node.y + this.node.height/2 < cc.find(CompPath["MainGameWindow"]).height - this.scrollHeight){
            clearInterval(this.shootController)
            this.node.destroy()
        }
    }
    onDestroy(): void {
        console.log('敌人被销毁')    
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
        const bullet = cc.instantiate(this.bulletPre)
        bullet.x = this.node.x
        bullet.y = this.node.y
        bullet.setParent(cc.find(CompPath.MainGameWindow))
    }

    // 敌人被子弹击中
    onCollisionEnter(other:cc.Collider, self:cc.Collider):void{
        if(!this.isDeath){
            if(other.tag == colliderTag["PLAYER_BULLET_SNOW"]){
                clearInterval(this.shootController)
                this.death(this.node)
                other.node.destroy()
            }
        }
    }
}

