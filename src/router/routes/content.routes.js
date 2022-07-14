import { admin, mirror_owner } from '../../db/roles.js';
import { content } from '../../db/tables.js';
import contentController from '../../controllers/content.controller.js';
import { check } from 'express-validator';

const contentArrayGet = [
  {
    path: '/content/profiles',
    needAuth: true,
    table: content,
    requiredRoles: [admin, mirror_owner],
    function: contentController.getContentProfile,
    description: 'return all content profile from DB',
  },
  {
    path: '/content/user-click-tracking',
    needAuth: true,
    table: content,
    requiredRoles: [admin, mirror_owner],
    function: contentController.getContentUserClickTracking,
    description: 'return all content uct from DB',
  },
  { path: '/content/allContent', needAuth: false, table: content, function: contentController.getAllContent },
  { path: '/content/profile/:id', needAuth: false, table: content, function: contentController.getProfileContent},
];

const contentArrayPost = [
  {
    path: '/content/addNewContent', needAuth: false, table: content, validate: [
      check('name', '').isLength({ min: 1 }).withMessage('Incorrect name'),
      check('parents', 'Incorrect parents'),
    ], function: contentController.addNewContent,
  },
];

const contentArrayDelete = [
  { path: '/content/removeContent/:id', needAuth: false, table: content, function: contentController.deleteContent },
];

const contentArrayUpdate = [
  {
    path: '/content/changeContent/:id', needAuth: false, table: content, validate: [
      check('name', '').isLength({ min: 1 }).withMessage('Incorrect name'),
      check('parents', 'Incorrect parents'),
    ], function: contentController.changeContent,
  },
  {
    path: '/content/changeContents/:id', needAuth: false, table: content, validate: [
      check('profile.*.id', '').isLength({ min: 1 }).withMessage('Incorrect id'),
      check('profile.*.enabled', 'Incorrect status'),
    ], function: contentController.changeProfileContents,
  },
  {
    path: '/content/changeContent/:id', needAuth: false, table: content, validate: [
      check('enabled', 'Incorrect status'),
    ], function: contentController.changeProfileContent,
  },
];

export {
  contentArrayGet,
  contentArrayPost,
  contentArrayUpdate,
  contentArrayDelete,
};
