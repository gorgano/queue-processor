import { IQueue, QueuePool } from "./types";
import { QueueFactory } from "./lib/queue";

const pool: QueuePool = {};

const createPoolIfNotExists = (queueName: string): void => {
    if (!pool[queueName]) {
        console.log('Creating Queue')
        const newPool = QueueFactory(queueName);
        pool[queueName] = newPool
    }
}

export const getQueueFromPool = (queueName: string): IQueue => {
    createPoolIfNotExists(queueName);
    const reqPool = pool[queueName];
    // Should not be possible; but ensures not returning undefined for typescript
    if (!reqPool) throw new Error('Queue does not exist.');
    return reqPool;
}

// export const getPoolStatus = (): QueuePool => {

// }

// TODO: Possilbly add something that forgets or cleans up the pool when a queue is empty.
// Since queues are created dynamically, could easily recreate when needed.