# queue-processor
multi-queue fifo processor


# Requested Problem Space
Create a REST application that messages and processes them in the order they are recieved.
* Handle multiple queues based on an environment variable
* Each queue is rate limited to 1 message per second
* Should have a GET endpoint called `/receive-message` which accepts a request in the _query string_ `queue` (string) and `message` (string)
    * Response should be 200 on accept
    * No processing before acceptance
    * Processing is prenting to console
    * "... for each queue, your application should only 'process' one message a second, no matter how quickly the messages are submitted to the HTTP endpoint."
* Bonus points for writing some kind of test that verifies messages are only processed one per second.

# Assumptions
* Each queue can have a message processed at 1 second, meaning n queues could have n messages processed in 1 second.
* Assume it is acceptable to process the next message 1 second AFTER the last message. EG "no more than 1 per second", leaving room for time "float"; not exactly at 1 per second interval.
* Assume the _first_ queue message may be processed _immediately_
* Assume any new message may be processed _immediately_ when no message has been processed in the last minute.
* Invalid schema request results in a server error
