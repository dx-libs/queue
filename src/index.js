const Collection = require('dxlibs-collection');
const Semaphore = require('semaphore-async-await').default;

const Private = new WeakMap();

/** Libreria  Queue */
class Queue extends Collection {
    /**
     * Crea una nueva instancia de Queue
     */
    constructor(...items) {
        super(...items);

        Private.set(this, {
            limit: Infinity,
            parallel: 5,
            tasks: [],
            values: [],
            lock: new Semaphore(1)
        });
    }

    parallel(n) {
        const self = Private.get(this);
        if (n === undefined) return self.parallel;

        self.parallel = n;

        return this;
    }

    limit(n) {
        const self = Private.get(this);

        if (n === undefined) return self.limit;

        self.limit = n;

        return this;
    }

    timeout(ms) {
        const self = Private.get(this);

        if (ms === undefined) return self.timeout;

        self.timeout = ms;

        return this;
    }

    async run(n) {
        let iterate = true;
        const self = Private.get(this);
        self.parallel = n > 0 ? n : self.parallel;

        await self.lock.acquire();

        let count = 0;
        const values = [];
        const timeout = (self.timeout && (setTimeout(() => iterate = false, self.timeout))) || false;

        while (iterate && this.length > 0) {
            if (!self.limit || count === self.limit) break;

            const arr = this.splice(0, self.parallel);
            this.emit('items', arr, this);
            const exec = arr.map((item, i) => self.tasks[0](item, i));

            const result = await Promise.all(exec);

            values.push(...result);

            count++;

            this.emit('group', result, this);

            self.lock.release();
        }

        if (timeout !== false) clearTimeout(timeout);
        self.lock.release();

        if (timeout !== false && iterate === false) throw 'Timeout';

        return values;
    }

    task(fn) {
        const self = Private.get(this);

        self.tasks.push(fn);

        return this;
    }

}

module.exports = Queue;
