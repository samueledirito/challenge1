const request = require('request')
const csv = require('csvtojson')

exports.saveToDynamo = async (event) => {
  const json = await csv({
    delimiter: ';'
  }).fromStream(request.get('http://challenges.tate.cloud/back2018/CLIENTI'))

  const response = {
    statusCode: 200,
    body: JSON.stringify(json),
  };
  return response;
};
