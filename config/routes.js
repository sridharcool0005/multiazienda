const express = require('express');
const router = express.Router();

const auth = require('../controllers/authentications');
const bars = require('../controllers/bars');
const clients = require('../controllers/clients');
const attivitaViste = require('../controllers/attivitaviste');
const locations = require('../controllers/locations');
const types = require('../controllers/types');
const zones = require('../controllers/zones');
const users = require('../controllers/users');
const comments = require('../controllers/comments');
const archiveds = require('../controllers/archiveds');

router.route('/login').post(auth.login);

router.route('/users').get(users.index);

router
  .route('/users/:id')
  .get(users.show)
  .put(users.edit)
  .patch(users.edit);

router
  .route('/bars')
  .get(bars.index)
  .post(bars.create);

router.route('/bars/archived').get(archiveds.indexBar);

router
  .route('/bars/:id')
  .get(bars.show)
  .put(bars.update)
  .patch(bars.update)
  .delete(bars.delete);

router.route('/bars/:id/comments').post(comments.createBar);

router.route('/bars/:id/comments/:commentId').delete(comments.deleteBar);

router.route('/bars/:id/archived').put(archiveds.archiveBar);

router
  .route('/clients')
  .get(clients.index)
  .post(clients.create);

router.route('/clients/archived').get(archiveds.indexClient);

router
  .route('/clients/:id')
  .get(clients.show)
  .put(clients.update)
  .patch(clients.update)
  .delete(clients.delete);

router.route('/clients/:id/comments').post(comments.createClient);

router.route('/clients/:id/comments/:commentId').delete(comments.deleteClient);

router.route('/clients/:id/archived').put(archiveds.archiveClient);

router.route('/clients/:id/bars').post(attivitaViste.create);

router
  .route('/clients/:id/bars/:barId')
  .get(attivitaViste.show)
  .put(attivitaViste.update)
  .delete(attivitaViste.delete);

router.route('/clients/:id/bars/:barId/comments').post(comments.createActivity);

router
  .route('/clients/:id/bars/:barId/comments/:commentId')
  .delete(comments.deleteActivity);

router
  .route('/locations')
  .get(locations.index)
  .post(locations.create);

router
  .route('/locations/:id')
  .get(locations.show)
  .put(locations.update)
  .patch(locations.update)
  .delete(locations.delete);

router
  .route('/types')
  .get(types.index)
  .post(types.create);

router
  .route('/types/:id')
  .get(types.show)
  .put(types.update)
  .patch(types.update);

router
  .route('/zones')
  .get(zones.index)
  .post(zones.create);

router
  .route('/zones/:id')
  .get(zones.show)
  .put(zones.update)
  .patch(zones.update);

module.exports = router;
