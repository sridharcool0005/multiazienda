const Bar = require('../models/bar');
const Client = require('../models/client');

function barsIndex(req, res) {
  Bar.find({
    archiviato: false
  })
    .populate('indirizzo zona tipologiaAttivita clienti')
    .then(bars => {
      res.status(201).json(bars);
    })
    .catch(err => res.status(500).json(err));
}

function barsShow(req, res) {
  Bar.findById(req.params.id)
    .populate('indirizzo zona tipologiaAttivita clienti comments.createdBy')
    .then(bar => {
      res.status(201).json(bar);
    })
    .catch(err => res.status(500).json(err));
}

function barsCreate(req, res) {
  req.body.archiviato = false;
  req.body.tipologiaAttivita = req.body.tipologiaAttivita.id;
  req.body.zona = req.body.zona.id;
  Bar.create(req.body)
    .then(bar => {
      res.status(201).json(bar);
    })
    .catch(err => res.status(500).json(err));
}

function barsUpdate(req, res) {
  Bar.findById(req.params.id)
    .then(bar => {
      for (const field in req.body) {
        bar[field] = req.body[field];
      }
      if (req.body.tipologiaAttivita)
        bar.tipologiaAttivita = req.body.tipologiaAttivita.id;
      if (req.body.zona) bar.zona = req.body.zona.id;
      bar.indirizzo = req.body.indirizzo.id;

      if (req.body.clienti.length > 0) {
        const clientIds = [];
        for (var i = 0; i < req.body.clienti.length; i++) {
          clientIds.push(req.body.clienti[i].id);
        }
        bar.clienti = clientIds;
      }

      if (bar.comments.length > 0) {
        for (var j = 0; j < bar.comments.length; j++) {
          bar.comments[j].createdBy = req.body.comments[j].createdBy.id;
        }
      }

      return bar.save();
    })
    .then(bar => res.status(200).json(bar))
    .catch(err => res.status(500).json(err));
}

function barsDelete(req, res) {
  Bar.findById(req.params.id)
    .then(bar => {
      bar.remove();

      Client.find() //once you remove the bar, also remove the bar form the ones seen by the clients
        .then(clients => {
          for (var i = 0; i < clients.length; i++) {
            const singleClient = clients[i];

            for (var j = 0; j < singleClient.attivitaViste.length; j++) {
              const singleAtt = singleClient.attivitaViste[j];
              if (toString(singleAtt.bar) === toString(req.params.id))
                singleAtt.remove();
            }

            return singleClient.save();
          }
        });
    })
    .then(bar => res.status(200).json(bar))
    .catch(err => res.status(500).json(err));
}

module.exports = {
  show: barsShow,
  index: barsIndex,
  create: barsCreate,
  update: barsUpdate,
  delete: barsDelete
};
