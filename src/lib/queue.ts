import { inherits } from "util";
import { QueueMessage, QueueRunnerStatus, IQueue, IQueryRunner } from "../types";
import { nextInterval, currentTime, timeoutIntervalSeconds } from "./utils";

export class Queue implements IQueue {
    private queue: QueueMessage[];
    private queueName: string;
    private lastShift: number;
    private nextShift: number;
    private runner: QueueRunner | undefined;

    constructor(queueName: string) {
        this.queueName = queueName;
        this.queue = [];
        this.lastShift = 0;
        this.nextShift = 0;
    }

    init(runner: QueueRunner): void {
        this.runner = runner;
    }

    pushMessage(message: string): void {
        const queueMessage: QueueMessage = {
            createTime: currentTime(),
            queueName: this.queueName,
            tries: 0,
            message,
        };
        this.queue.push(queueMessage);

        if (!this.runner) {
            console.log('Error::No runner started, please initialize to start the Queue Runner')
            return;
        }

        this.runner.run();
    }

    getMessage(): QueueMessage | undefined {
        this.nextShift = nextInterval();
        this.lastShift = currentTime();
        return this.queue.shift();
    }

    getQueueCount(): number {
        return this.queue.length;
    }

    getLastShift(): number { return this.lastShift; }
    getNextShift(): number { return this.nextShift; }

    getQueueName(): string { return this.queueName };
};



export class QueueRunner implements IQueryRunner {
    private status: QueueRunnerStatus;
    private queue: IQueue;
    private injectedProcessor?: (message: QueueMessage) => void;

    constructor(queue: IQueue, processor?: (message: QueueMessage) => void) {
        this.queue = queue;
        this.status = QueueRunnerStatus.idle;
        this.injectedProcessor = processor;
    }

    public run(): void {
        if (this.status === QueueRunnerStatus.idle) {
            this.status = QueueRunnerStatus.running;
            process.nextTick(() => this.nextMessage());
            console.log('verbose::Scheduled next message after return...');
            return;
        }

        console.log('verbose::New Run call, but QueueRunner already active, waiting for longPoll for next processor');
    }

    protected processMessage(message: QueueMessage): void {
        if (this.injectedProcessor) {
            this.injectedProcessor(message);
            return;
        }
        console.log(`Message::Current Time(${currentTime()})::Queue(${message.queueName})::Queued Time(${message.createTime})::${message.message}`);
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
        console.log('verbose::Polling for nextMessage...');

        if (this.queue.getNextShift() < currentTime()) {
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
                // Go to idle mode
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
            console.log(`verbose::Wating for next interval ${timeoutIntervalSeconds / 2} (seconds)...`);
            setTimeout(() => this.nextMessage(), (timeoutIntervalSeconds / 2) * 1000);
        } catch (e) {
            console.error(`Unable to set timeout for Queue Runner!  Unknown issue! QueueName(${this.queue.getQueueName()});  Will try on next message received.`);
        }
    }
}


export const QueueFactory = (
    queueName: string,
    injectedProcessor?: (message: QueueMessage) => void,
) => {
    const queue = new Queue(queueName);
    const runner = new QueueRunner(queue, injectedProcessor);
    queue.init(runner);
    return queue;
};


