// packages/event/src/index.ts
import { BaseModule, BaseModuleOptions } from '@websaw/core';


// 定义一个接口来描述点击事件的数据结构
export interface ClickEvent {
    x: number;
    y: number;
    timestamp: number;
}

// ClickEventModule类，继承BaseModule，用于监听点击事件
/**
 * 表示用于处理单击事件的模块.
 * @extends BaseModule
 */
export class ClickEventModule extends BaseModule {
    private handleClick: (event: MouseEvent) => void;

    /**
     * 鼠标点击事件实例
     * @param options - The options for the module.
     * @param callback - 当单击事件发生时调用的回调函数。
     */
    constructor(options: BaseModuleOptions, private callback: (event: ClickEvent) => void) {
        super(options);

        // Define the click event handler function
        this.handleClick = (event: MouseEvent) => {
            const clickEvent: ClickEvent = {
                x: event.clientX,
                y: event.clientY,
                timestamp: Date.now(),
            };
            this.callback(clickEvent);
            this.eventBus.emit('clickEvent', clickEvent);  // Send the event through the event bus
        };
    }

    /**
     * 通过添加单击事件侦听器来初始化模块
     */
    public init(): void {
        super.init();
        document.addEventListener('click', this.handleClick);
        this.log('添加点击监听器');
    }

    /**
     * Destroys the module by removing the click event listener.
     */
    public destroy(): void {
        document.removeEventListener('click', this.handleClick);
        this.log('Click event listener removed');
        super.destroy();
    }
}

