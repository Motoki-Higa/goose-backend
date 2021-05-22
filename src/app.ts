import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path, { resolve } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import 'dotenv/config';

import { default as mongodb } from 'mongodb';
let MongoClient = mongodb.MongoClient;

// ================ mongoDB atlas config ==================
// Add this code to solve TS error
if (!process.env.DB_CONNECTION) {
    process.exit(1);
}

// Connection URL & Database Name
const uri = process.env.DB_CONNECTION;
const dbName = process.env.DB_NAME;

MongoClient.connect(uri, { useUnifiedTopology: true }, async (err, client) => {
    const db = client.db(dbName);
    // store db in app.locals gloablly
    app.locals.db = db;
});
// =========================================================

// import routes
import indexRouter from './index';
import apiUsers from './api';

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');

// middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// define routes
app.use('/', indexRouter);
app.use('/api', apiUsers);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
    next(createError(404));
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

export default app;
