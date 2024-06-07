// baseModule.ts

import { Config } from './config';
import { EventBus } from './eventBus';

export interface BaseModuleOptions {
    config: Config;
    eventBus: EventBus;
}

export class BaseModule {
    protected config: Config;
    protected eventBus: EventBus;
    private isInitialized: boolean = false;

    constructor(options: BaseModuleOptions) {
        this.config = options.config;
        this.eventBus = options.eventBus;
    }

    public init(): void {
        if (this.isInitialized) {
            throw new Error('Module already initialized');
        }
        this.isInitialized = true;
        this.log('Module initialized');
    }

    public destroy(): void {
        this.isInitialized = false;
        this.log('Module destroyed');
    }

    protected log(message: string): void {
        if (this.config.get('debug')) {
            console.log(`[${this.constructor.name}] ${message}`);
        }
    }
}
