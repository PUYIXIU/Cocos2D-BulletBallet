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


    scrollWidth:number = 0
    scrollHeight:number = 0

    onLoad(){
        this.scrollWidth = cc.view.getVisibleSize().width
        this.scrollHeight = cc.view.getVisibleSize().height
    }

    start () {
        this.node.on("death",this.death)
    }

    update (dt) {
        this.node.y -= this.moveSpeed * dt
        if(this.node.y + this.node.height/2 < cc.find(CompPath["MainGameWindow"]).height - this.scrollHeight){
            this.node.destroy()
        }
    }
    onDestroy(): void {
        console.log('敌人被销毁')    
    }

    death(enemy: cc.Node){
        cc.resources.load('img/effect/smoke/smoke', cc.SpriteAtlas, (error:Error, assets:cc.SpriteAtlas)=>{
            if(error){
                console.error(error)
            }
            enemy.getComponent(Animator).setAnimationFrames(assets, 1).then(res=>{
                enemy.destroy()
            })
        })
    }

    // 敌人被子弹击中
    onCollisionEnter(other:cc.Collider, self:cc.Collider):void{
        if(other.tag == colliderTag["PLAYER_BULLET_SNOW"]){
            this.death(this.node)
            other.node.destroy()
        }
    }
}
