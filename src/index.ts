import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import { getQueueFromPool } from './QueuePool';

const app = express();
app.use(bodyParser.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Send email endpoint
app.get('/status', async (req: Request, res: Response) => {
	// const status = getPoolStatus();
	res.status(202).json(({ message: "OK" }));
});

app.get('/receive-message', async (req: Request, res: Response) => {
	const inMessage = req.query.message;
	const inQueue = req.query.queue;
	console.log({ message: inMessage, queue: inQueue });

	// Check for needed values
	if (!inMessage) {
		console.error(`Error::Invalid request body! queue(${inQueue}) message(${inMessage})`);
		return res.status(400).json({ message: 'Invalid request body' });
	}
	// Sanitize
	const sanitizedMessage = String(inMessage);

	let queueName = 'main';
	if (inQueue) queueName = String(inQueue);

	const queue = getQueueFromPool(queueName);
	queue.pushMessage(sanitizedMessage);

	console.log('verbose::message entered into queue');
	res.sendStatus(200); // Would suggest a 202, as processing as not been done.
});

// Start server
app.listen(8080, () => {
	console.log('Server started on port 8080');
});