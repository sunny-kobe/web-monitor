// packages/event/src/index.ts
import { BaseModule, BaseModuleOptions } from '@websaw/core';


// 定义一个接口来描述点击事件的数据结构
export interface ClickEvent {
    x: number;
    y: number;
    timestamp: number;
}

// ClickEventModule类，继承BaseModule，用于监听点击事件
export class ClickEventModule extends BaseModule {
    private handleClick: (event: MouseEvent) => void;

    constructor(options: BaseModuleOptions, private callback: (event: ClickEvent) => void) {
        super(options);

        // 定义鼠标点击事件的处理函数
        this.handleClick = (event: MouseEvent) => {
            const clickEvent: ClickEvent = {
                x: event.clientX,
                y: event.clientY,
                timestamp: Date.now(),
            };
            this.callback(clickEvent);
            this.eventBus.emit('clickEvent', clickEvent);  // 通过事件总线发送事件
        };
    }

    // 重写init方法，添加鼠标点击事件监听器
    public init(): void {
        super.init();
        document.addEventListener('click', this.handleClick);
        this.log('Click event listener added');
    }

    // 重写destroy方法，移除鼠标点击事件监听器
    public destroy(): void {
        document.removeEventListener('click', this.handleClick);
        this.log('Click event listener removed');
        super.destroy();
    }
}

