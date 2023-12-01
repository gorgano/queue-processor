export interface QueueMessage {
    message: string,
    queueNumber: number,
    createTime: number,
    tries: number,
};

export enum QueueRunnerStatus {
    running=0,
    idle,
};
