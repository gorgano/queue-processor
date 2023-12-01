import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

const app = express();
app.use(bodyParser.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Send email endpoint
app.get('/status', async (req: Request, res: Response) => {
	res.status(202).json(({ message: 'UP!' }));
});


app.get('/receive-message', async (req: Request, res: Response) => {

});

// Start server
app.listen(8080, () => {
	console.log('Server started on port 8080');
});