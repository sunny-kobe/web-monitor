// packages/core/src/index.ts
// import type { InitOptions } from '@websaw/type';

// function init(options: InitOptions) {
//     console.log(options);
// }


// export {
//     init
// };
// export type { InitOptions };
// export default { init };

import { Config, CoreConfig } from './config';
import { EventBus } from './eventBus';
import { BaseModule } from './baseModule';

export class CoreSDK {
    private config: Config;
    private eventBus: EventBus;
    private modules: BaseModule[] = [];

    constructor(coreConfig: CoreConfig) {
        this.config = new Config(coreConfig);
        this.eventBus = new EventBus();
        if (this.config.get('debug')) {
            console.log('CoreSDK initialized with config:', this.config);
        }
    }

    public registerModule(module: BaseModule): void {
        this.modules.push(module);
        module.init();
        this.log(`Module registered: ${module.constructor.name}`);
    }

    public unregisterModule(module: BaseModule): void {
        module.destroy();
        this.modules = this.modules.filter(m => m !== module);
        this.log(`Module unregistered: ${module.constructor.name}`);
    }

    public getConfig(): Config {
        return this.config;
    }

    public getEventBus(): EventBus {
        return this.eventBus;
    }

    public init(): void {
        this.modules.forEach(module => module.init());
        this.log('CoreSDK initialized all modules');
    }

    public destroy(): void {
        this.modules.forEach(module => module.destroy());
        this.log('CoreSDK destroyed all modules');
    }

    private log(message: string): void {
        if (this.config.get('debug')) {
            console.log(`[CoreSDK] ${message}`);
        }
    }
}

