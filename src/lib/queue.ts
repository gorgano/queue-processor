import { inherits } from "util";
import { QueueMessage, QueueRunnerStatus } from "../types";
import { nextInterval, currentTime, timeoutIntervalSeconds } from "./utils";

class Queue {
    private queue: QueueMessage[];
    private queueNumber: number;
    private lastShift: number;
    private nextShift: number;
    private runner: QueueRunner | undefined;

    constructor(queueNumber: number) {
        this.queueNumber = queueNumber;
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
            queueNumber: this.queueNumber,
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

    getQueueCount():number {
        return this.queue.length;
    }

    getLastShift(): number { return this.lastShift; }
    getNextShift(): number { return this.nextShift; }

    getQueueNumber(): number { return this.queueNumber };
};



class QueueRunner {
    private status: QueueRunnerStatus;
    private queue: Queue;
    // private secondInterval: number;

    constructor(queue: Queue) {
        this.queue = queue;
        this.status = QueueRunnerStatus.idle;
        // this.secondInterval = secondInterval;
    }

    public run(): void {
        if (this.status === QueueRunnerStatus.idle) {
            process.nextTick(() => this.nextMessage());
            console.log('verbose::Scheduled next message after return...');
            return;
        }

        console.log('verbose::New Run call, but QueueRunner already active, waiting for longPoll for next processor');
    }

    private processMessage(message: QueueMessage): void {
        console.log(`Message::Current Time(${currentTime()})::Queue(${message.queueNumber})::Queued Time(${message.createTime})::${message.message}`);
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
        this.status = QueueRunnerStatus.running;

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
            console.log(`verbose::Wating for next interval ${timeoutIntervalSeconds} (seconds)...`);
            setTimeout(() => this.nextMessage(), timeoutIntervalSeconds * 1000);
        } catch (e) {
            console.error(`Unable to set timeout for Queue Runner!  Unknown issue! QueueNumber(${this.queue.getQueueNumber()});  Will try on next message received.`);
        }
    }
}


export const QueueFactory = (queueNumber: number) => {
    const queue = new Queue(queueNumber);
    const runner = new QueueRunner(queue);
    queue.init(runner);
    return queue;
};


