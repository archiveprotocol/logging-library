import { InternalAxiosRequestConfig } from 'axios';
export interface MyRequestConfig extends InternalAxiosRequestConfig {
    metadata: {
        startTime: Date;
        duration?: number;
        endTime?: Date;
    };
}
//# sourceMappingURL=axios.config.d.ts.map