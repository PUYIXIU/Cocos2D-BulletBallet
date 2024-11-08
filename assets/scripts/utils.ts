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
    /**
     * 关于菜单
     */
    AboutMenu: "UI_Menu/StartLayer/AboutMenu",

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

