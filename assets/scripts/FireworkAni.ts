// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class FireworkAni extends cc.Component {


    start () {

    }

    // 动画开始
    AniStartPlay(){
        // 开启粒子特效
        this.node.getComponent(cc.ParticleSystem).enabled = true
        console.log("动画开始")

    }
    // 动画结束播放
    AniFinishPlay(){
        // 关闭粒子特效
        this.node.getComponent(cc.ParticleSystem).enabled = false
        console.log("动画结束")
    }
    
}
