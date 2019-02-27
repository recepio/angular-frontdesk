import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThrottledFuncService {
    private func: () => void;
    private wait: number;
    private previous: number = 0;
    private timeout: any = null;

    /**
     * Create a new throttled function
     *
     * @param func function to call
     * @param wait wait time in milliseconds
     */
    constructor(func: () => void, wait: number) {
        this.func = func;
        this.wait = wait;
    }

    /** Call the function */
    call(): void {
        const now: number = this.getTime();
        const remaining: number = this.wait - (now - this.previous);

        if (remaining <= 0) {
            clearTimeout(this.timeout);
            this.timeout = null;
            this.previous = now;
            this.func();
        } else if (this.timeout === null) {
            this.timeout = setTimeout(() => this.callLater(), remaining);
        }
    }

    private getTime(): number {
        return Date.now();
    }

    private callLater(): void {
        this.previous = this.getTime();
        this.timeout = null;
        this.func();
    }
}
