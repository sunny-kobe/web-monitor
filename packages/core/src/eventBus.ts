// eventBus.ts

// 定义事件处理器类型
type EventHandler = (...args: any[]) => void;

// 定义事件处理器包装器，包含处理器函数，一次性标志和优先级
interface EventHandlerWrapper {
    handler: EventHandler;
    once: boolean;
    priority: number;
}

/**
 * EventBus类，用于模块间事件通信
 * 表示一个事件总线，允许注册事件处理程序并触发事件。
 */
export class EventBus {
    /**
     * 存储事件名称和对应处理程序列表的映射。
     */
    private events: Map<string, EventHandlerWrapper[]> = new Map();

    /**
     * 注册一个普通事件的处理程序。
     * @param event - 事件的名称。
     * @param handler - 当事件触发时要调用的处理程序函数。
     * @param priority - 处理程序的优先级（默认值: 0）。
     */
    public on(event: string, handler: EventHandler, priority = 0): void {
        this.addEventHandler(event, handler, false, priority);
    }

    /**
     * 注册一个一次性事件的处理程序。
     * @param event - 事件的名称。
     * @param handler - 当事件触发时要调用的处理程序函数。
     * @param priority - 处理程序的优先级（默认值: 0）。
     */
    public once(event: string, handler: EventHandler, priority = 0): void {
        this.addEventHandler(event, handler, true, priority);
    }

    /**
     * 取消注册一个事件的处理程序。
     * @param event - 事件的名称。
     * @param handler - 要取消注册的处理程序函数。
     */
    public off(event: string, handler: EventHandler): void {
        if (this.events.has(event)) {
            this.events.set(event, this.events.get(event)!.filter(h => h.handler !== handler));
        }
    }

    /**
     * 触发一个事件并调用所有已注册的处理程序。
     * @param event - 事件的名称。
     * @param args - 要传递给处理程序的参数。
     */
    public emit(event: string, ...args: any[]): void {
        if (this.events.has(event)) {
            const handlers = this.events.get(event)!;
            handlers.sort((a, b) => b.priority - a.priority);
            handlers.forEach(handler => handler.handler(...args));
        }
    }

    /**
     * 添加一个事件处理程序。
     * @param event - 事件的名称。
     * @param handler - 处理程序函数。
     * @param once - 是否为一次性事件。
     * @param priority - 处理程序的优先级。
     */
    private addEventHandler(event: string, handler: EventHandler, once: boolean, priority: number): void {
        const eventHandlers = this.events.get(event) || [];
        eventHandlers.push({ handler, once, priority });
        this.events.set(event, eventHandlers);
    }

}
