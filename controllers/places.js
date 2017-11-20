const rp = require('request-promise');

function getPlace(req, res) {
  console.log(req.query);
  rp(
    `https://maps.googleapis.com/maps/api/place/details/json?placeid=${
      req.query.place
    }&key=AIzaSyDuvV2-lIr6kqI6Y3LrnhItDlSERzaL_R4`
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
