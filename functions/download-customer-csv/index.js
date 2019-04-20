'use strict';

module.exports.saveToDynamo = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Will save customer csv to dynamo',
      input: event,
    }, null, 2),
  };
};
