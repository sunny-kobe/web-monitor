// packages/event/src/index.ts
import { BaseModule, BaseModuleOptions } from "@websaw/core";
import { isValidKey, getLocationHref, getTimestamp, getElByAttr, isSimpleEl, getNodeXPath, sendData } from '@websaw/utils'

// 定义一个接口来描述点击事件的数据结构
export interface ClickEvent {
    target: HTMLElement;
    timestamp: number;
}

/**
 * 表示用于跟踪用户交互的点击事件模板。
 */
class RequestTemplateClick {
    eventId = ""; // 事件ID
    eventType = ""; // 事件类型
    title = ""; // 事件名
    triggerPageUrl = ""; // 当前页面URL
    x = -1; // 被点击元素与屏幕左边距离
    y = -1; // 被点击元素与屏幕上边距离
    params = {}; // 事件参数
    elementPath = ""; // 被点击元素的层级
    triggerTime = -1; // 事件发生时间

    /**
     * 创建 RequestTemplateClick 类的新实例。
     * @param config - 点击事件的配置对象。
     */
    constructor(config = {}) {
        Object.assign(this, config);
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
                    : [];
            // 检查被点击的元素以及其父级元素是否有这些属性(从内到外)
            const target = path.find(
                (el) =>
                    el.hasAttribute &&
                    (el.hasAttribute("data-warden-container") ||
                        el.hasAttribute("data-warden-event-id") ||
                        el.hasAttribute("data-warden-title"))
            );

            if (!target) return;

            const clickEvent: ClickEvent = {
                target,
                timestamp: Date.now(),
            };

            const requestTemplateClick = new RequestTemplateClick({
                eventType: SEDNEVENTTYPES.CLICK,
                triggerTime: getTimestamp(),
                triggerPageUrl: getLocationHref(),
                title: extractTitleByTarget(target),
                eventId: extractDataByPath(path),
                params: extractParamsByPath(path),
                elementPath: getNodeXPath(target).slice(-128),
            });

            this.callback(target);
            this.eventBus.emit('clickEvent', clickEvent);
            sendData.emit(requestTemplateClick);
        };
    }

    /**
     * 通过添加单击事件侦听器来初始化模块
     */
    public init(): void {
        super.init();
        document.addEventListener("click", this.handleClick);
        this.log("添加点击监听器");
    }

    /**
     * Destroys the module by removing the click event listener.
     */
    public destroy(): void {
        document.removeEventListener("click", this.handleClick);
        this.log("Click event listener removed");
        super.destroy();
    }
}

/**
 * 获取目标元素到最外层元素组成的数组
 * @param node - 目标元素
 * @param options - 选项，包含是否包括自身和排序顺序
 * @returns 目标元素到最外层元素组成的数组
 */
function getNodePath(node: HTMLElement, options = { includeSelf: true, order: 'asc' }): HTMLElement[] {
    const { includeSelf, order } = options;
    let parent = includeSelf ? node : node.parentElement;
    const result: HTMLElement[] = [];
    while (parent) {
        result[order === 'asc' ? 'push' : 'unshift'](parent);
        parent = parent.parentElement;
    }
    return result;
}

/**
 * 获取元素的 title 属性
 * @param target - 目标元素
 * @returns title 值
 */
function extractTitleByTarget(target: HTMLElement): string {
    const selfTitle = getNodeTitle(target);
    if (selfTitle) return selfTitle;

    // 向上找其父节点
    let container = target.parentElement;

    while (container && container !== document.body) {
        if (container.hasAttribute('data-warden-container')) break;
        container = container.parentElement;
    }
    return getNodeTitle(container) || handleLeafNode(target) || handleNoLeafNode(target) || '';
}

/**
 * 获取元素的 data-warden-title 属性或者 title 属性
 * @param node - 目标元素
 * @returns title 值
 */
function getNodeTitle(node: HTMLElement | null): string {
    if (node) {
        return node.getAttribute('data-warden-title') || node.title || '';
    }
    return '';
}

/**
 * 获取 title - 叶子元素的情况下，取其特殊值
 * @param target - 目标元素
 * @returns title 值
 */
function handleLeafNode(target: HTMLElement): string | null {
    const { tagName, textContent } = target;
    if (tagName === 'IMG') return target.getAttribute('alt') || null;
    if (tagName.toLowerCase() === 'svg') {
        const useElement = Array.from(target.children).find(item => item.tagName === 'use');
        return useElement ? useElement.getAttribute('xlink:href') || null : null;
    }
    return textContent;
}

/**
 * 获取 title - 非叶子元素的情况
 * @param target - 目标元素
 * @returns title 值
 */
function handleNoLeafNode(target: HTMLElement): string | null {
    const { tagName, textContent } = target;
    if (tagName === 'A' || tagName === 'BUTTON') {
        const res = isSimpleEl(Array.from(target.children));
        return res ? textContent : target.getAttribute('href') || target.getAttribute('name') || null;
    }
    return textContent;
}

/**
 * 提取数据事件ID
 * @param list - 目标元素路径
 * @returns 事件ID
 */
function extractDataByPath(list: HTMLElement[] = []): string {
    const hasIdEl = getElByAttr(list, 'data-warden-event-id');
    if (hasIdEl) return hasIdEl.getAttribute('data-warden-event-id') || '';

    const hasTitleEl = getElByAttr(list, 'title');
    if (hasTitleEl) return hasTitleEl.getAttribute('title') || '';

    const container = getElByAttr(list, 'data-warden-container');
    if (container) {
        return container.getAttribute('data-warden-event-id') ||
            container.getAttribute('title') ||
            container.getAttribute('data-warden-container') || '';
    }

    return list[0]?.tagName.toLowerCase() || '';
}

/**
 * 提取数据参数
 * @param list - 目标元素路径
 * @returns 参数对象
 */
function extractParamsByPath(list: HTMLElement[] = []): Record<string, string | null> {
    const regex = /^data-warden-/;
    let targetIndex = -1;

    for (let index = 0; index < list.length; index++) {
        const el = list[index];
        const attributes = el?.attributes ? Array.from(el.attributes) : [];
        const target = attributes.find(item => regex.test(item.nodeName) || item.nodeName.includes('data-warden-container'));

        if (target) {
            targetIndex = index;
            break;
        }
    }

    if (targetIndex < 0) return {};

    const container = list[targetIndex];
    const attrList = Array.from(container.attributes) || [];
    const params: Record<string, string | null> = {};
    const defaultKey = ['container', 'title', 'event-id'];

    attrList.forEach(item => {
        if (!regex.test(item.nodeName) || defaultKey.includes(item.nodeName.replace(regex, ''))) return;
        params[item.nodeName.replace(regex, '')] = item.nodeValue;
    });

    return params;
}