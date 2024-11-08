// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Animator extends cc.Component {

    animator:any = null

    @property(cc.SpriteAtlas)
    animateFrames: cc.SpriteAtlas = null

    @property
    animate_speed:number = 10

    @property
    autoPlay:boolean = true
    
    start () {
        if(this.autoPlay){
            this.play()
        }
    }

    play(time?:number):Promise<void>{
        
        if(!this.animateFrames){
            console.log("动画帧未转载")
            return
        }
        if(time){
            // debugger
        }
        const frames = this.animateFrames.getSpriteFrames()
        let index = 0
        return new Promise((resolve, reject)=>{
            let loopTime = 0
            this.animator = setInterval(()=>{
                if(!this.node) {
                    clearInterval(this.animator)
                    return
                }
                index++
                
                if(index == frames.length) loopTime ++
                if(time && loopTime>=time){
                    resolve()
                    clearInterval(this.animator)
                    return
                }

                index %= frames.length
                this.node.getComponent(cc.Sprite).spriteFrame = frames[index]
            }, 1000/this.animate_speed)
        })
    }

    // 修改动画帧
    setAnimationFrames(frames: cc.SpriteAtlas, time?:number):Promise<void>{
        clearInterval(this.animator)
        this.animateFrames = frames
        return this.play(time)
    }

}
