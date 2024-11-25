// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import { CompPath, globalVar } from "./utils";

@ccclass
export default class CollectItems extends cc.Component {

    scrollWidth:number = 0
    scrollHeight:number = 0

    @property
    moveSpeed:number = 100
    onLoad(){
        this.scrollWidth = cc.view.getFrameSize().width
        this.scrollHeight = cc.view.getFrameSize().height
    }
    start () {

    }

    update (dt) {
        if(globalVar.gamePause) return
        this.node.y -= this.moveSpeed * dt
        if(this.node.y + this.node.height/2 < cc.find(CompPath["MainGameWindow"]).height - this.scrollHeight){
            this.node.destroy()
        }
    }
}
