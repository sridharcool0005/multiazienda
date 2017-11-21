const rp = require('request-promise');

function getPlace(req, res) {
  rp(
    `https://maps.googleapis.com/maps/api/place/details/json?placeid=${
      req.query.place
    }&key=AIzaSyDKT04EtfMXGsk56uPOYdi5v3dNG9hmVWw`
  )
    .then(data => {
      const result = JSON.parse(data);
      const url = { url: result.result.url };
      res.status(200).json(url);
    })
    .catch(err => {
      res.status(500).json(err);
    });
}

module.exports = {
  getPlace: getPlace
};

// AIzaSyDKT04EtfMXGsk56uPOYdi5v3dNG9hmVWw
// AIzaSyDuvV2-lIr6kqI6Y3LrnhItDlSERzaL_R4
