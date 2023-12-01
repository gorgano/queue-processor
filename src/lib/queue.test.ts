import { assert } from 'console';
import { QueueMessage } from '../types';
import { QueueRunner, Queue, QueueFactory } from './queue';
import { currentTime } from './utils';
import { expect } from 'chai';

// class MockQueueRunner extends QueueRunner {
//     protected processMessage(message: QueueMessage): void {

//     }
// }

describe('QueueRunner', () => {
    it('should process NO MORE than 1 message per second', (done) => {
        const processTimes: number[] = [];
        const messages = ['1', '2', '3', '4', '5'];

        const mockProcessor = (message: QueueMessage) => {
            console.log('MESSAGE PROCESSED ' + processTimes.length);
            processTimes.push(currentTime());
        }

        const queue = QueueFactory('main', mockProcessor);

        messages.map(m => queue.pushMessage(m));

        const checkAllProcessed = () => {
            if (processTimes.length === messages.length) {
                try {
                    // expect(true).to.equal(false);
                    // Examine each send date (seconds)
                    // ensure the delta between any two notes is not LESS than 1
                    const deltas = processTimes.map((current, i, times) => {
                        let next = currentTime();
                        console.log(i);
                        if (i + 1 < times.length) next = times[i + 1];
                        console.log(next);
                        const delta = next - current;
                        return delta;
                    });
                    console.log(deltas);
                    const numberOverOne = deltas.filter(d => d > 1).length;
                    expect(numberOverOne).to.equal(messages.length);
                    done();
                } catch (e) {
                    done(e);
                }
                return;
            }

            // if not, wait one more second
            setTimeout(() => checkAllProcessed(), 1000);
        }
        setTimeout(
            () => {
                checkAllProcessed()
            },
            // Should take 5 seconds, wait
            10 * 1000);
    }).timeout(30000);
})