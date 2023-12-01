export interface QueueMessage {
    message: string,
    queueName: string,
    createTime: number,
    tries: number,
};

export enum QueueRunnerStatus {
    running = 0,
    idle,
};

export interface IQueryRunner {
    run(): void;
}

export interface IQueue {
    init(runner: IQueryRunner): void;
    pushMessage(message: string): void;
    getMessage(): QueueMessage | undefined;
    getQueueCount(): number;
    getLastShift(): number;
    getNextShift(): number;
    getQueueName(): string;
}

export interface QueuePool {
    [Identifier: string]: IQueue;
}

// export interface QueueDetails {
//     queueName: string;
//     nextShift: number;
//     messageCount: number;
// }