import { Router } from 'express';
import {
  routesArrayDelete,
  routesArrayGet,
  routesArrayPost,
  routesArrayUpdate,
} from './routes/index.js';

import authMiddleware from '../middlewares/auth-middleware.js';
import roleMiddleware from '../middlewares/auth-role-middleware.js';
import validationMiddleware from '../middlewares/validation-middleware.js';

const router = new Router();

const required = (route, req, res, next) => {
  if (route.requiredRoles) {
    req.requiredRoles = route.requiredRoles;
  }

  if (route.table) {
    req.table = route.table;
  }

  next();
};

const middlewareBuilder = (route) => {
  const middlewares = [];

  if (route.needAuth) {
    middlewares.push(authMiddleware);
  }

  if (route.requiredRoles && route.requiredRoles.length > 0) {
    middlewares.push(roleMiddleware);
  }

  if (route.validate && route.validate.length > 0) {
    middlewares.push(validationMiddleware(route.validate));
  }

  return middlewares;
};

routesArrayGet.forEach((route) => {
  const middlewares = middlewareBuilder(route);

  router.get(
    route.path,
    (req, res, next) => {
      required(route, req, res, next);
    },
    ...middlewares,
    route.function
  );
});

routesArrayPost.forEach((route) => {
  const middlewares = middlewareBuilder(route);

  router.post(
    route.path,
    (req, res, next) => {
      required(route, req, res, next);
    },
    ...middlewares,
    route.function
  );
});

routesArrayDelete.forEach((route) => {
  const middlewares = middlewareBuilder(route);

  router.delete(
    route.path,
    (req, res, next) => {
      required(route, req, res, next);
    },
    ...middlewares,
    route.function
  );
});

routesArrayUpdate.forEach((route) => {
  const middlewares = middlewareBuilder(route);

  router.put(
    route.path,
    (req, res, next) => {
      required(route, req, res, next);
    },
    ...middlewares,
    route.function
  );
});

export default router;
