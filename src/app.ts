import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import globalErrorHandler from './app/middlewares/globalErrorHandler';

import cookieParser from 'cookie-parser';
import { applicationRoutes } from './app/routes';

const app: Application = express();

app.use(cors({ origin: 'https://4u-frontend.vercel.app', credentials: true }));
app.use(cookieParser());

//parser
app.use(express.json());
app.use(
  express.urlencoded({ parameterLimit: 100000, limit: '50mb', extended: true })
);

// root route
app.get('/', (req: Request, res: Response) => {
  res.send('working successfully');
});

app.use('/api/v1', applicationRoutes);

//global error handler
app.use(globalErrorHandler);

//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
  next();
});

export default app;
