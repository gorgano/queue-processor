export interface QueueMessage {
    message: string,
    queueNumber: number,
    createTime: number,
    tries: number,
};

// export interface Queue {
//     pushMessage: (message: QueueMessage) => void,
//     getMessage: () => QueueMessage | undefined,
//     getQueueNumber: () => number,
// };