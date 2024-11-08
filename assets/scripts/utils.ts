// 全局变量
export const globalVar = {
    /* 游戏是否开启 */
    gameStart: false,
    /* 金币数量 */
    coinValue: 0,
    /* 心心数量 */
    heartValue: 3,
    /* 倒计时时间 */
    lastTime: 60,
}

export const CompPath = {
    /**
     * 暂停菜单
     */
    pauseMenu: 'pauseMenu',
    /**
     * 游戏结束菜单
     */
    gameOverMenu: 'GameOverMenu',
    
    /**
     * 游戏开始图层
     */
    StartLayer: "UI_Menu/StartLayer",
    /**
     * 游戏开始菜单
     */
    GameStartMenu: "UI_Menu/StartLayer/GameStartMenu",
    /* 关于菜单 */
    AboutMenu: "UI_Menu/StartLayer/AboutMenu",
    
    /* 滚动背景1 */
    BackScene1: "Background/Scene1",
    /* 滚动背景2 */
    BackScene2: "Background/Scene2",

    /* 金币数量 */
    CoinValue: "UI_Menu/TitileMenu/CoinValue/value",
    /* 心心数量 */
    HeartValue: "UI_Menu/TitileMenu/HeartValue/value",
    /* 剩余时间 */
    LastTimeValue: "UI_Menu/TitileMenu/LastTime/value",

    /* 主游戏界面 */
    MainGameWindow: "MainGameWindow",

    /* 主标题界面 */
    TitleMenu: "UI_Menu/TitleMenu",

}

/**
 * 替换node的sprite
 * @param node 
 * @param sprite 
 * @param spriteName 
*/
export function changeSprite(node:cc.Node, sprite:cc.SpriteFrame| cc.SpriteFrame[], spriteName?:string){
    let spriteValue = sprite
    if(Array.isArray(sprite)){
        if(!spriteName) {
            console.error("请指定贴图名称")
            return
        }
        spriteValue = sprite.find(item=>item.name == spriteName)
        if(!spriteValue){
            console.error("未找到指定名称的贴图")
            return
        }
    }
    this.node.getComponent(cc.Sprite).spriteFrame = spriteValue
}


export const colliderTag = {
    /* 玩家 */
    "PLAYER":0,
    
    /* 雪球子弹 */
    "PLAYER_BULLET_SNOW":1,

    /* 敌人_spirit */
    "ENEMY_SPIRIT":2,

    /* 敌人_spirit_bullet */
    "ENEMY_SPIRIT_BULLET":3,
    
    /* 金币 */
    "COIN":4,
}