// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { CompPath } from "./utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


    bgs: cc.Node[] = []
    scrollHeight:number = 0 

    @property
    scrollSpeed:number = 100

    onLoad(){
        this.scrollHeight = cc.view.getVisibleSize().height
        cc.director.getCollisionManager().enabled = true
    }

    start () {
        
    }

    
    update (dt) {
        this.backMove(dt)
    }

    // 背景移动
    backMove(dt){
        this.node.y -= this.scrollSpeed * dt
        if(this.node.y < -this.scrollHeight){
            this.node.y = 0
        }
    }


}
