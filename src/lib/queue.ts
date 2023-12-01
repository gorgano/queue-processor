import { QueueMessage } from "../types";
import { minuteFromNow, currentTime } from "./utils";

// const Queue = (queueNumber: number): Queue => {
//     const queue: QueueMessage[] = [];
//     const _queueNumber = queueNumber;
//     const pushMessage = (message: QueueMessage): void => {
//         queue.push(message);
//     }
//     const getMessage = (): QueueMessage | undefined => {
//         return queue.shift();
//     }
//     const getQueueNumber = () => _queueNumber;
// };
class Queue {
    queue: QueueMessage[];
    queueNumber: number;
    lastShift: number;

    constructor(queueNumber: number) {
        this.queueNumber = queueNumber;
        this.queue = [];
        this.lastShift = 0; // Math.floor(Date.now() / 1000);
    }

    pushMessage(message: string): void {
        const queueMessage: QueueMessage = {
            createTime: currentTime(),
            queueNumber: this.queueNumber,
            tries: 0,
            message,
        };
        this.queue.push(message);
    }

    getMessage(): QueueMessage | undefined {
        this.lastShift = minuteFromNow();
        return this.queue.shift();
    }

    getLastShift(): number { return this.lastShift };

    getQueueNumber(): number { return this.queueNumber };
};

const processMessage = (message: QueueMessage): void =>
    console.log(`Message::${currentTime()}::Queue(${message.queueNumber})::Queued Time(${message.createTime})::${message.message}`);

/**
 * Starts a new Chain of Authority pattern.  When a queue
 * has messages to process, they are processed.  However if the
 * processing interval is not in range, the queueRunner waits.
 * After a message is processed, the queueRunner waits for the
 * specified interval and long polls the queue.
 * When no more messages are available, the queueRunner exits.
 * @param queue Queue to process messages for
 */
const queueRunner = (queue: Queue) => {
    if (queue.getLastShift() > currentTime()) {
        // Get a message and process it
        // ****
        // If doing anything that might go wrong, would wrap in a try
        // On failure, increment the message.tries, push back at the END of the 
        // current queue. 
        // Likely have logic to only process the message n times and then
        // do some fail over.  If using a standard AWS queue, we'd see it go
        // into a dead letter queue.
        // As console.log can't fail without other dramatic things, no handling
        // is performed here.
        // ****
        const nextMessage = queue.getMessage();
        processMessage(nextMessage);
    } else {
        // Wait for the next interval
        try{
            setin
        }
    }
};

export const QueueFactory = (queueNumber: number) => {
    return new Queue(queueNumber);
};


