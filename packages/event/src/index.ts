// packages/event/src/index.ts
import { BaseModule, BaseModuleOptions } from '@websaw/core';


// 定义一个接口来描述点击事件的数据结构
export interface ClickEvent {
    x: number;
    y: number;
    timestamp: number;
}


/**
 * 表示用于跟踪用户交互的点击事件模板。
 */
class RequestTemplateClick {
    eventId = '' // 事件ID
    eventType = '' // 事件类型
    title = '' // 事件名
    triggerPageUrl = '' // 当前页面URL
    x = -1 // 被点击元素与屏幕左边距离
    y = -1 // 被点击元素与屏幕上边距离
    params = {} // 事件参数
    elementPath = '' // 被点击元素的层级
    triggerTime = -1 // 事件发生时间

    /**
     * 创建 RequestTemplateClick 类的新实例。
     * @param config - 点击事件的配置对象。
     */
    constructor(config = {}) {
        Object.keys(config).forEach(key => {
            // if (isValidKey(key, config)) {
            //     this[key] = config[key] || null
            // }
            this[key] = config[key] || null
        })
    }
}

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
            // 获取被点击的元素到最外层元素组成的数组
            const path: HTMLElement[] = event.composedPath()
                ? (event.composedPath() as HTMLElement[])
                : event.target
                    ? getNodePath(event.target as HTMLElement)
                    : []
            // 检查被点击的元素以及其父级元素是否有这些属性(从内到外)
            const target = path.find(
                el =>
                    el.hasAttribute &&
                    (el.hasAttribute('data-warden-container') ||
                        el.hasAttribute('data-warden-event-id') ||
                        el.hasAttribute('data-warden-title'))
            )

            if (!target) return;


            const clickEvent: ClickEvent = {
                x: event.clientX,
                y: event.clientY,
                timestamp: Date.now(),
            };
            this.callback(target);
            this.eventBus.emit('clickEvent', target);  // Send the event through the event bus
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


/**
 * 获取目标元素到最外层元素组成的数组
 */
function getNodePath(
    node: HTMLElement,
    options = { includeSelf: true, order: 'asc' }
) {
    if (!node) return []
    const { includeSelf, order } = options
    let parent = includeSelf ? node : node.parentElement
    let result: HTMLElement[] = []
    while (parent) {
        result = order === 'asc' ? result.concat(parent) : [parent].concat(result)
        parent = parent.parentElement
    }
    return result
}
