import { QueueMessage, QueueRunnerStatus } from "../types";
import { minuteFromNow, currentTime } from "./utils";

class Queue {
    private queue: QueueMessage[];
    private queueNumber: number;
    private lastShift: number;
    private runner: QueueRunner;

    constructor(queueNumber: number) {
        this.queueNumber = queueNumber;
        this.queue = [];
        this.lastShift = 0; // Math.floor(Date.now() / 1000);
        this.runner = new QueueRunner(this);
    }

    pushMessage(message: string): void {
        const queueMessage: QueueMessage = {
            createTime: currentTime(),
            queueNumber: this.queueNumber,
            tries: 0,
            message,
        };
        this.queue.push(queueMessage);
        this.runner.run();
    }

    getMessage(): QueueMessage | undefined {
        this.lastShift = minuteFromNow();
        return this.queue.shift();
    }

    getLastShift(): number { return this.lastShift };

    getQueueNumber(): number { return this.queueNumber };
};



class QueueRunner {
    private status: QueueRunnerStatus;
    private queue: Queue;
    private secondInterval: number;

    constructor(queue: Queue, secondInterval: number = 60) {
        this.queue = queue;
        this.status = QueueRunnerStatus.idle;
        this.secondInterval = secondInterval;
    }

    public run(): void {
        if (this.status === QueueRunnerStatus.idle) {
            this.nextMessage();
            return;
        }

        console.log('verbose::New Run call, but QueueRunner already active, waiting for longPoll for next processor');
    }

    private processMessage(message: QueueMessage): void {
        console.log(`Message::${currentTime()}::Queue(${message.queueNumber})::Queued Time(${message.createTime})::${message.message}`);
    }

    /**
     * Starts a new Chain of Authority pattern.  When a queue
     * has messages to process, they are processed.  However if the
     * processing interval is not in range, the queueRunner waits.
     * After a message is processed, the queueRunner waits for the
     * specified interval and long polls the queue.
     * When no more messages are available, the queueRunner idles.
     */
    private nextMessage(): void {
        if (this.queue.getLastShift() > currentTime()) {
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
            const nextMessage = this.queue.getMessage();

            if (!nextMessage) {
                // Nothing to process, wait for next run request
                // Got to idle mode
                this.status = QueueRunnerStatus.idle;
                console.log('verbose::No messages to process, idling');
                return;
            }

            this.processMessage(nextMessage);
        }

        // Wait for the next interval
        this.longPoll();
    }

    private longPoll(): void {
        // Wait for the next interval
        try {
            console.log('verbose::Wating for next interval')
            setTimeout(() => this.nextMessage(), this.secondInterval);
        } catch (e) {
            console.error(`Unable to set timeout for Queue Runner!  Unknown issue! QueueNumber(${this.queue.getQueueNumber()});  Will try on next message received.`);
        }
    }
}


export const QueueFactory = (queueNumber: number) => {
    return new Queue(queueNumber);
};


