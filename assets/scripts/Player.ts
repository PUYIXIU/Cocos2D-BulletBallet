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

  /** 子弹预制件 */
  @property(cc.Prefab)
  bulletPre:cc.Prefab = null;

  /** 目标坐标 */
  targetPosition = {
    x: 0,
    y: 0,
  };
  /** 控制移动速度 */
  lastMoveTime: number = 0;
  
  /** 可移动的最大y值 */
  maxY:number = 0

  /** 可移动的x值范围 */
  minX:number = 0
  maxX:number = 0;
  
  isMoving: boolean = false;

  start() {
    this.targetPosition.x = this.node.x;
    this.targetPosition.y = this.node.y;

    this.maxY = this.node.getParent().height - cc.find(CompPath.TitleMenu).height - this.node.height

    let xPad = 15
    this.minX = xPad + this.node.width/2
    this.maxX = this.node.getParent().width + xPad - this.node.width

    this.moveByKeyboard();
    this.moveByTouch()
  }

  moveByTouch(){
    const touchWindow = cc.find(CompPath.MainGameWindow)
    const titleMenu = cc.find(CompPath.TitleMenu)
    const maxY = titleMenu.y - titleMenu.height/2
    touchWindow.on(cc.Node.EventType.TOUCH_START,(event:cc.Event.EventTouch)=>{
        this.isMoving = true
    })
    touchWindow.on(cc.Node.EventType.TOUCH_END,(event:cc.Event.EventTouch)=>{
        this.isMoving = false
    })
    touchWindow.on(cc.Node.EventType.TOUCH_CANCEL,(event:cc.Event.EventTouch)=>{
        this.isMoving = false
    })
    touchWindow.on(cc.Node.EventType.TOUCH_MOVE,(event:cc.Event.EventTouch)=>{
        if(this.isMoving){
            let ex = event.getLocationX(), ey = event.getLocationY()
            if(ex - touchWindow.y <=0 ) {
                return
            }else if(ey >= maxY){
                return
            }
            this.node.x = ex - 15
            this.node.y = ey - touchWindow.y
        }
    })
  }

  // 键盘移动
  moveByKeyboard() {
    cc.systemEvent.on(
      cc.SystemEvent.EventType.KEY_DOWN,
      (event: cc.Event.EventKeyboard) => {
        switch (event.keyCode) {
          case cc.macro.KEY.w:
          case cc.macro.KEY.up:
            // 判断node是否上方越界
            if(this.targetPosition.y + this.moveSpeed >= this.maxY){
                return
            }
            this.targetPosition.y += this.moveSpeed;
            this.lastMoveTime++;
            break;
          case cc.macro.KEY.s:
          case cc.macro.KEY.down:
            if(this.targetPosition.y - this.moveSpeed <= 0){
                return
            }
            this.targetPosition.y -= this.moveSpeed;
            this.lastMoveTime++;
            break;
          case cc.macro.KEY.a:
          case cc.macro.KEY.left:
            if(this.targetPosition.x - this.moveSpeed < this.minX){
                return
            }
            this.targetPosition.x -= this.moveSpeed;
            this.lastMoveTime++;
            break;
          case cc.macro.KEY.d:
          case cc.macro.KEY.right:
            if(this.targetPosition.x + this.moveSpeed > this.maxX){
                return
            }
            this.targetPosition.x += this.moveSpeed;
            this.lastMoveTime++;
            break;
          case cc.macro.KEY.space:
            this.shoot();
        }
      }
    );
  }

  /** 射击 */
  shoot() {
    const bullet = cc.instantiate(this.bulletPre)
    bullet.x = this.node.x
    bullet.y = this.node.y + this.node.height/2
    bullet.setParent(cc.find(CompPath.MainGameWindow))
  }

  onCollisionEnter(other: cc.Collider, self: cc.Collider): void {
    console.log(other, self);
    switch (other.tag) {
      case colliderTag["COIN"]:
        this.getCoin(other, self);
        break;
      case colliderTag["ENEMY_SPIRIT_BULLET"]:
        this.getShoot(other, self);
        break;
      case colliderTag["ENEMY_SPIRIT"]:
        this.getFight(other, self);
        break;
    }
  }

  update(dt) {
    let lastStep = this.lastMoveTime--;
    if (this.lastMoveTime < 0) {
      this.lastMoveTime = 0;
      lastStep = 0;
    }
    this.node.x +=
      (this.targetPosition.x - this.node.x) / (this.moveDuration + lastStep);
    this.node.y +=
      (this.targetPosition.y - this.node.y) / (this.moveDuration + lastStep);
  }

  /**
   * 获取金币
   */
  getCoin(other: cc.Collider, self: cc.Collider) {
    other.node.destroy();
    globalVar.coinValue++;
    cc.find(CompPath.CoinValue).getComponent(cc.Label).string =
      globalVar.coinValue.toString().padStart(2, "0");
  }

  /**
   * 被子弹击中
   */
  getShoot(other: cc.Collider, self: cc.Collider) {
    other.node.destroy();
    this.getHurt();
  }

  /**
   * 直接遭遇敌人
   * 1. 扣血
   * 2. 播放敌人爆炸东湖
   */
  getFight(other: cc.Collider, self: cc.Collider) {
    this.getHurt();
    other.node.emit("death", other.node);
  }

  /** 掉血 */
  getHurt() {
    globalVar.heartValue--;
    cc.find(CompPath.HeartValue).getComponent(cc.Label).string =
      globalVar.heartValue.toString().padStart(2, "0");
    // 角色死亡
    if (globalVar.heartValue == 0) {
      console.log("dead");
    }
  }
}
