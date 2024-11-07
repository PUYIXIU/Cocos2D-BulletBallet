// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    animator:any = null

    @property(cc.SpriteAtlas)
    animateFrames: cc.SpriteAtlas = null

    @property
    animate_speed:number = 10

    
    start () {
        if(!this.animateFrames){
            console.log("动画帧未转载")
            return
        }
        console.log()
        const frames = this.animateFrames.getSpriteFrames()
        let index = 0
        
        this.animator = setInterval(()=>{
            index++
            index %= frames.length
            this.node.getComponent(cc.Sprite).spriteFrame = frames[index]
        }, 1000/this.animate_speed)
    }

    
    // update (dt) {}
}
