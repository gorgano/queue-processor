import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import { QueueFactory } from './lib/queue';

const app = express();
app.use(bodyParser.json());

const internalQueue = QueueFactory(1);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Send email endpoint
app.get('/status', async (req: Request, res: Response) => {
	res.status(202).json(({ message: 'UP!' }));
});


app.get('/receive-message', async (req: Request, res: Response) => {
	const message = req.query.message;
	const queue = req.query.queue;
	console.log({ message, queue });

	// Check for needed values
	if (!message) {
		console.error(`Error::Invalid request body! queue(${queue}) message(${message})`);
		return res.status(400).json({ message: 'Invalid request body' });
	}

	// Sanitize
	const sanitizedMessage = String(message);

	internalQueue.pushMessage(sanitizedMessage);

	console.log('verbose::message entered into queue');
	res.sendStatus(202);
});

// Start server
app.listen(8080, () => {
	console.log('Server started on port 8080');
});