
// 全局变量
export const globalVar = {
    // 初始化的心心数
    initHeart:3,
    // 初始化的时间
    initTime:60,

    /* 有上层菜单显示 */
    topMenuShow:true,

    /* 游戏是否开启 */
    gameStart: false,

    /* 游戏是否结束 */
    gameOver:false,

    /* 游戏胜利 */
    gameWin:false,

    /* 游戏是否暂停 */
    gamePause:false,
    
    /* 金币数量 */
    coinValue: 0,
    /* 心心数量 */
    heartValue: 3,
    /* 倒计时时间 */
    lastTime: 0,
    /* 当前关卡 */
    currentLevel: 1,
    /* 关卡总数量 */
    totalLevel: 5
}

globalVar.lastTime = globalVar.initTime
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
    
    /* 背景容器 */
    Back: "Background",
    /* 滚动背景1 */
    BackScene1: "Background/Scene1",
    /* 滚动背景2 */
    BackScene2: "Background/Scene2",

    /* 金币数量 */
    CoinValue: "UI_Menu/TitleMenu/CoinValue/value",
    /* 心心数量 */
    HeartValue: "UI_Menu/TitleMenu/HeartValue/value",
    /* 剩余时间 */
    LastTimeValue: "UI_Menu/TitleMenu/LastTime/value",
    /* 当前关卡 */
    LevelNum: "UI_Menu/TitleMenu/LevelValue/LavelNum",


    /* 主游戏界面 */
    MainGameWindow: "MainGameWindow",

    /* 主标题界面 */
    TitleMenu: "UI_Menu/TitleMenu",

    /* 游戏结束界面 */
    GameOverMenu: "UI_Menu/GameOverMenu",
    /* 游戏胜利界面 */
    GameWinMenu: "UI_Menu/GameWinMenu",

    /* 游戏暂停菜单 */
    PauseMenu: "UI_Menu/PauseMenu",
    /* 贩卖物品菜单 */
    SaleMenu: "UI_Menu/SaleMenu",
    
    /* 玩家 */
    Player: "MainGameWindow/Player",

    /* 下一关按钮 */
    NextLevelBtn: "UI_Menu/GameWinMenu/MenuInner/NextLevelBtn",
    /* 再玩一遍 */
    OverBtn: "UI_Menu/GameWinMenu/MenuInner/OverBtn",
    /* 游戏胜利提示 */
    winTip: "UI_Menu/GameWinMenu/MenuInner/winTip",
    /* 胜利标题 */
    winTitle: "UI_Menu/GameWinMenu/MenuInner/winTitle",
    
    /* 胜利特效 */
    firework: "fireworkBox/firework",
    /* 胜利特效 */
    winFire: "fireworkBox/winFire",

    /* 卷轴列表 */
    scrollList: "UI_Menu/FooterMenu/DialogBoxFaceset/ScrollList",

    /* 音效控制器 */
    AudioController: "AudioController",
    /* 背景音乐控制器 */
    bgmController: "AudioController/BgmController",
    /* 音效控制器 */
    effectController: "AudioController/EffectController",
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

    /* 爱心 */
    "HEART":5,
    /* 发射子弹加速魔药 */
    "SHOOT_POTION":6,
    /* 散弹 */
    "MULTI_SHOOT_ITEM":7,
}

export const AudioPath = {
    /* 高音按钮 */
    buttonHigh:'audio/button-high',
    /* 按钮点击 */
    buttonClick:'audio/btn-click',

    /* 吃金币 */
    coin:'audio/Gold',
    /* 加速发射魔药 */
    shootPotion:'audio/shootPotion',
    /* 多发魔弹饭团 */
    multiShootPotion: 'audio/multiShootPotion',
    /* 爱心 */
    heart:'audio/heart',

    /* 发射火球 */
    fireball:'audio/Fireball',
    /* 发射石头 */
    stoneShoot: 'audio/stoneShoot',
    /* 发射冰弹 */
    iceShoot:'audio/iceShoot',
    /* 发射叶旋风 */
    plantShoot: 'audio/plantShoot',

    /* 游戏结束 */
    GameOver:'audio/GameOver',
    /* 游戏胜利 */
    win: 'audio/win',

    /* 击中敌人 */
    hit:'audio/enemy-hurt',
    /* 杀死敌人 */
    kill:'audio/enemy-kill',

    /* 玩家受伤 */
    hurt:'audio/player-hurt',


    /* 背景音乐 */
    backBgm: 'audio/back-bgm',
}