# queue-processor
multi-queue fifo processor


# Requested Problem Space
Create a REST application that messages and processes them in the order they are recieved.
* Handle multiple queues based on an environment variable
* Each queue is rate limited to 1 message per second
* Should have a GET endpoint called `/receive-message` which accepts a request in the _query string parameters_ `queue` (string) and `message` (string)
    * Response should be 200 on accept
    * No processing before acceptance
    * Processing is prenting to console
    * "... for each queue, your application should only 'process' one message a second, no matter how quickly the messages are submitted to the HTTP endpoint."
* Should support multipe queues based on a parameter passed into the REST service
* Bonus points for writing some kind of test that verifies messages are only processed one per second.

# Assumptions
* Each queue can have a message processed at 1 second, meaning n queues could have n messages processed in 1 second.
* Queues are created ad-hock, based on the input to the REST end point
* Assume it is acceptable to process the next message 1 second AFTER the last message. EG "no more than 1 per second", leaving room for time "float"; possibly more than a second before the next message is procesed
* Assume the _first_ queue message may be processed _immediately_
* Assume any new message may be processed _immediately_ when no message has been processed in the last minute.
* Invalid schema request results in a server error

# Would Have Liked To
* Add more testing
* Add a proper logger service to be able to turn verbose mode/on off
* Add to the status route to dump the current queue status

# Running
```
npm install
npm run dev
```
In another terminal
```
curl "http://localhost:8080/receive-message?message=SomeMessageHere&queue=optional"
```

# Documentation
To access the API docs, use:
http://localhost:8080/api-docs/

# Testing
Only one test currently, demonstrating that the messages are rate limited.  Run with:
```
npm test
```