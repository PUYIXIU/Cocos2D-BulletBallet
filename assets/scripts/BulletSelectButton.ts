// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class BulletSelectButton extends cc.Component {

    // 子弹价钱
    @property
    bulletValue:number = 0

    // 是否可用
    @property
    isValid:boolean = true

    // 子弹对应的Atlas
    @property(cc.SpriteAtlas)
    bulletFrames: cc.SpriteAtlas = null

    // 子弹对应伤害
    @property
    attack:number = 0
    
    
    start () {

    }

    // update (dt) {}
}
