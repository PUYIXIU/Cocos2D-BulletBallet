// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import { CompPath, changeSprite } from "./utils";

enum ButtonType {
    "Pause Button" = 0,
    "Quit Button" = 1,
    "Restart Button" = 2,
    "Start Button" = 3,
    "About Button" = 4,
    "Return Button" = 5,
}

@ccclass
export default class MenuButton extends cc.Component {

    @property({
        type:cc.Enum(ButtonType)
    })
    type = 0;


    start () {

        // })

        this.node.on(cc.Node.EventType.TOUCH_END, (event:cc.Event.EventTouch) => {
            switch(this.type){
                case 0: this.Pause(); break;
                case 1: this.Quit(); break;
                case 2: this.Restart(); break;
                case 3: this.GameStart(); break;
                case 4: this.ShowAbout(true); break;
                case 5: this.ShowAbout(false); break;
                default:break;
            }
        })
    }
    Pause(){
        console.log(CompPath)
    }
    Quit(){

    }
    Restart(){

    }
    GameStart(){

    }
    ShowAbout(isAbout:boolean){
        cc.find(CompPath.GameStartMenu).active = !isAbout
        cc.find(CompPath.AboutMenu).active = isAbout
    }
}
