const Client = require('../models/client');
const Bar = require('../models/bar');

function clientsIndex(req, res) {
  Client.find({ archiviato: false })
    .populate('indirizzo zona tipologiaAttivita attivitaViste')
    .then(clients => {
      res.status(201).json(clients);
    })
    .catch(err => res.status(500).json(err));
}

function clientsShow(req, res) {
  Client.findById(req.params.id)
    .populate(
      'indirizzo zona tipologiaAttivita attivitaViste attivitaViste.bar comments.createdBy'
    )
    .then(client => {
      res.status(201).json(client);
    })
    .catch(err => res.status(500).json(err));
}

function clientsCreate(req, res) {
  req.body.archiviato = false;
  if (req.body.tipologiaAttivita) {
    const tipi = req.body.tipologiaAttivita;
    let tipiName = '';
    for (var i = 0; i < tipi.length; i++) {
      if (i !== tipi.length - 1) {
        tipiName += `${tipi[i].name}, `;
      } else {
        tipiName += `${tipi[i].name}`;
      }
    }
    req.body.typeString = tipiName;
  }

  if (req.body.zona) {
    const zone = req.body.zona;
    let zoneName = '';
    for (var j = 0; j < zone.length; j++) {
      zoneName += `${zone[j].name} `;
    }
    req.body.zoneString = zoneName;
  }

  Client.create(req.body)
    .then(client => {
      res.status(201).json(client);
    })
    .catch(err => res.status(500).json(err));
}

function clientsUpdate(req, res) {
  Client.findById(req.params.id)
    .then(client => {
      for (const field in req.body) {
        client[field] = req.body[field];
      }

      if (req.body.tipologiaAttivita) {
        const tipi = req.body.tipologiaAttivita;
        const tipiIds = [];
        let tipiName = '';
        for (var i = 0; i < tipi.length; i++) {
          tipiIds.push(tipi[i].id);
          if (i !== tipi.length - 1) {
            tipiName += `${tipi[i].name}, `;
          } else {
            tipiName += `${tipi[i].name}`;
          }
        }
        client.tipologiaAttivita = tipiIds;
        client.typeString = tipiName;
      }

      if (req.body.zona) {
        const zone = req.body.zona;
        const zoneIds = [];
        let zoneName = '';
        for (var j = 0; j < zone.length; j++) {
          zoneIds.push(zone[j].id);
          zoneName += `${zone[j].name} `;
        }
        client.zona = zoneIds;
        client.zoneString = zoneName;
      }

      if (req.body.indirizzo) client.indirizzo = req.body.indirizzo;

      if (client.attivitaViste.length > 0 && req.body.attivitaViste) {
        for (var k = 0; k < client.attivitaViste.length; k++) {
          client.attivitaViste[k].bar = req.body.attivitaViste[k].bar.id;
        }
      }

      if (client.comments.length > 0 && req.body.comments) {
        for (var l = 0; l < client.comments.length; l++) {
          client.comments[l].createdBy = req.body.comments[l].createdBy.id;
        }
      }

      return client;
    })
    .then(client => {
      return client.save();
    })
    .then(client => res.status(200).json(client))
    .catch(err => {
      console.log('error', err);
      res.status(500).json(err);
    });
}

function clientsDelete(req, res) {
  Client.findById(req.params.id)
    .then(client => {
      client.remove();

      Bar.find() //once you remove the bar, also remove the bar form the ones seen by the clients
        .then(bars => {
          for (var i = 0; i < bars.length; i++) {
            const singleBar = bars[i];

            for (var j = 0; j < singleBar.clienti.length; j++) {
              const singleClient = singleBar.clienti[j];
              if (toString(singleClient.bar) === toString(req.params.id))
                singleClient.remove();
            }

            return singleBar.save();
          }
        });
    })
    .then(bar => res.status(200).json(bar))
    .catch(err => res.status(500).json(err));
}

module.exports = {
  show: clientsShow,
  index: clientsIndex,
  create: clientsCreate,
  update: clientsUpdate,
  delete: clientsDelete
};
