// eventBus.ts

type EventHandler = (...args: any[]) => void;

interface EventHandlerWrapper {
    handler: EventHandler;
    once: boolean;
    priority: number;
}

export class EventBus {
    private events: Map<string, EventHandlerWrapper[]> = new Map();

    public on(event: string, handler: EventHandler, priority = 0): void {
        this.addEventHandler(event, handler, false, priority);
    }

    public once(event: string, handler: EventHandler, priority = 0): void {
        this.addEventHandler(event, handler, true, priority);
    }

    public off(event: string, handler: EventHandler): void {
        if (this.events.has(event)) {
            this.events.set(event, this.events.get(event)!.filter(h => h.handler !== handler));
        }
    }

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

    private addEventHandler(event: string, handler: EventHandler, once: boolean, priority: number): void {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event)!.push({ handler, once, priority });
        this.events.set(event, this.events.get(event)!.sort((a, b) => b.priority - a.priority));
    }
}
