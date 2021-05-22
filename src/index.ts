import express, { Request, Response, NextFunction } from 'express';
import { Router } from 'express';
var router = Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Goose API' });
});

export default router;