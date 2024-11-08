// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { globalVar } from "./utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MenuTitle extends cc.Component {

    @property
    rotateSpeed:number = 100;
    start () {
    }

    animate(dt){
        const rotateNodes = this.node.getChildByName("RotateIcons")?.children
        if(rotateNodes){
            rotateNodes.forEach((node,index)=>{
                let dir = index % 2 == 0? 1 : -1
                node.angle += dt * this.rotateSpeed * dir
            })
        }
    }
    update (dt) {
        this.animate(dt)
        // if(globalVar.gameStart){
        //     console.log("游戏开始")
        // }else{
        //     console.log("---")
        // }

    }
}
