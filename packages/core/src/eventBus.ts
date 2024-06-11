// eventBus.ts

// 定义事件处理器类型
type EventHandler = (...args: any[]) => void;

// 定义事件处理器包装器，包含处理器函数，一次性标志和优先级
interface EventHandlerWrapper {
    handler: EventHandler;
    once: boolean;
    priority: number;
}

// EventBus类，用于模块间事件通信
export class EventBus {
    // 使用Map存储事件名称和对应的处理器列表
    private events: Map<string, EventHandlerWrapper[]> = new Map();

    // 普通事件监听方法，接收事件名称、处理器函数和优先级（默认0）
    public on(event: string, handler: EventHandler, priority = 0): void {
        this.addEventHandler(event, handler, false, priority);
    }

    // 一次性事件监听方法，接收事件名称、处理器函数和优先级（默认0）
    public once(event: string, handler: EventHandler, priority = 0): void {
        this.addEventHandler(event, handler, true, priority);
    }

    // 取消事件监听方法，接收事件名称和处理器函数
    public off(event: string, handler: EventHandler): void {
        if (this.events.has(event)) {
            this.events.set(event, this.events.get(event)!.filter(h => h.handler !== handler));
        }
    }

    // 触发事件方法，接收事件名称和可变参数
    public emit(event: string, ...args: any[]): void {
        if (this.events.has(event)) {
            this.events.get(event)!.forEach(wrapper => {
                wrapper.handler(...args);
                if (wrapper.once) {
                    this.off(event, wrapper.handler);
                }
            });
        }
    }

    // 添加事件处理器方法，接收事件名称、处理器函数、一次性标志和优先级
    private addEventHandler(event: string, handler: EventHandler, once: boolean, priority: number): void {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event)!.push({ handler, once, priority });
        this.events.set(event, this.events.get(event)!.sort((a, b) => b.priority - a.priority));
    }
}
