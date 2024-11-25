// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import { CompPath } from "./utils";
const initSetting = {
    bgm: 0.5,
    effect: 0.3,
}

@ccclass
export default class PauseMenu extends cc.Component {

    // 设定参数
    setting = {
        ...initSetting
    }

    @property(cc.Slider)
    bgmSlider:cc.Slider = null

    @property(cc.Slider)
    effectSlider:cc.Slider = null

    @property(cc.Toggle)
    bgmToggle:cc.Toggle = null

    @property(cc.Toggle)
    effectToggle:cc.Toggle = null

    bgmController:cc.AudioSource = null

    effectControllers:cc.AudioSource[] = []
    start () {
        this.bgmController = cc.find(CompPath.bgmController).getComponent(cc.AudioSource)
        this.effectControllers = cc.find(CompPath.effectController).children.map(node=>node.getComponent(cc.AudioSource))
    }   

    // 关闭bgm音乐
    toggleBgm(){
        if(this.setting.bgm > 0){
            this.setting.bgm = 0
        }else{
            this.setting.bgm =  initSetting.bgm
        }
        this.bgmSlider.getComponent(cc.Slider).progress = this.setting.bgm
        this.bgmController.volume = this.setting.bgm
    }

    changeBgm(self: cc.Slider){
        this.setting.bgm = self.progress
        this.bgmController.volume = self.progress
        this.bgmToggle.getComponent(cc.Toggle).isChecked = (this.setting.bgm > 0)
    }

    // 关闭背景音效
    toggleEffect(){
        if(this.setting.effect > 0){
            this.setting.effect = 0
        }else{
            this.setting.effect =  initSetting.effect
        }
        this.effectSlider.getComponent(cc.Slider).progress = this.setting.effect
        this.effectControllers.forEach(controller=>{
            controller.volume = this.setting.effect
        })
    }
    changeEffect(self: cc.Slider){
        this.setting.effect = self.progress
        this.effectControllers.forEach(controller=>{
            controller.volume = self.progress
        }) 
        this.effectToggle.getComponent(cc.Toggle).isChecked = (this.setting.effect > 0)
    }

    reset(){
        this.setting = {...initSetting}

        this.effectToggle.getComponent(cc.Toggle).isChecked = true
        this.effectSlider.getComponent(cc.Slider).progress = this.setting.effect
        this.effectControllers.forEach(controller=>{
            controller.volume = this.setting.effect
        })
        
        this.bgmToggle.getComponent(cc.Toggle).isChecked = true
        this.bgmSlider.getComponent(cc.Slider).progress = this.setting.bgm
        this.bgmController.volume = this.setting.bgm

    }
}
