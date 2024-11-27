// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

// 初始化游戏
@ccclass
export default class InitGame extends cc.Component {
    onLoad(){
        const baseUrl = "http://cocos-test.e-duck.xyz"
        fetch(`${baseUrl}/welcome?visit_id=2`)
        .then(res=>{return res.json()})
        .then(res=>{
            console.log(res.data)
        })
    }
    start () {
    }
}
