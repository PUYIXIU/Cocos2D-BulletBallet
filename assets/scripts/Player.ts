// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { colliderTag, globalVar, CompPath } from "./utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  /** 移动速度 */
  @property
  moveSpeed: number = 100;

  /** 移动延迟 */
  @property
  moveDuration: number = 8;

  /** 目标坐标 */
  targetPosition = {
    x: 0,
    y: 0,
  };
  lastMoveTime:number = 0
  start() {
    this.targetPosition.x = this.node.x;
    this.targetPosition.y = this.node.y;
    this.move();
  }

  // 移动
  move() {
    cc.systemEvent.on(
      cc.SystemEvent.EventType.KEY_DOWN,
      (event: cc.Event.EventKeyboard) => {

        switch (event.keyCode) {
          case cc.macro.KEY.w:
          case cc.macro.KEY.up:
            this.targetPosition.y += this.moveSpeed;
            this.lastMoveTime ++
            break;
          case cc.macro.KEY.s:
          case cc.macro.KEY.down:
            this.targetPosition.y -= this.moveSpeed;
            this.lastMoveTime ++
            break;
          case cc.macro.KEY.a:
          case cc.macro.KEY.left:
            this.targetPosition.x -= this.moveSpeed;
            this.lastMoveTime ++
            break;
          case cc.macro.KEY.d:
          case cc.macro.KEY.right:
            this.targetPosition.x += this.moveSpeed;
            this.lastMoveTime ++
            break;
        }
      }
    );
  }

  /** 射击 */
  shoot() {}

  onCollisionEnter(other:cc.Collider, self:cc.Collider):void{
    console.log(other, self)
    switch(other.tag){
        case colliderTag['COIN']:
            this.getCoin(other, self);
            break;
        case colliderTag['ENEMY_SPIRIT_BULLET']:
            this.getShoot(other, self)
            break;
        case colliderTag['ENEMY_SPIRIT']:
            this.getFight(other, self)
            break;

    }
  }

  update (dt) {
    let lastStep = this.lastMoveTime--
    if(this.lastMoveTime<0) {
        this.lastMoveTime = 0
        lastStep = 0
    }
    this.node.x += (this.targetPosition.x - this.node.x) / (this.moveDuration+lastStep)
    this.node.y += (this.targetPosition.y - this.node.y) / (this.moveDuration+lastStep)
  }

  /**
   * 获取金币
   */
  getCoin(other:cc.Collider, self:cc.Collider){
    other.node.destroy()
    globalVar.coinValue ++;
    cc.find(CompPath.CoinValue).getComponent(cc.Label).string = globalVar.coinValue.toString().padStart(2,"0")
  }

  /**
   * 被子弹击中
   */
  getShoot(other:cc.Collider, self:cc.Collider){
    other.node.destroy()
    this.getHurt()
  }

  
  /**
   * 直接遭遇敌人
   * 1. 扣血
   * 2. 播放敌人爆炸东湖
   */
  getFight(other:cc.Collider, self:cc.Collider){
    this.getHurt()
    other.node.emit('death', other.node)

    
  }

  /** 掉血 */
  getHurt(){
    globalVar.heartValue --
    cc.find(CompPath.HeartValue).getComponent(cc.Label).string = globalVar.heartValue.toString().padStart(2,"0")
    // 角色死亡
    if(globalVar.heartValue == 0){
        console.log('dead')
    }
  }
}
