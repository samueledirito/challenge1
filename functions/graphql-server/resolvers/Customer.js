const AWS = require('aws-sdk');
const { compose } = require('ramda');

const db = new AWS.DynamoDB.DocumentClient();

const customerFields = [
  'ID_UTENTE',
  'CODICE_CLIENTE',
  'EMAIL',
  'NOME',
  'COGNOME',
  'DATA_NASCITA',
  'CODICE_FISCALE',
  'STATO',
  'ATTIVO',
  'NUOVO',
  'RETE',
  'AGENTE',
  'CANONE_RAI',
];

const appendFilter = filter => (params) => {
  if (!filter) {
    return params;
  }

  if (filter.match(/:/g).length !== 1) {
    throw new Error('Query must be in field:value format');
  }

  const [field, value] = filter.split(':');

  if (!customerFields.includes(field)) {
    throw new Error('Field Unknown');
  }

  const filterBlock = {
    FilterExpression: `${field} = :${field}`,
    ExpressionAttributeValues: {
      [`:${field}`]: value,
    },
  };

  return { ...params, ...filterBlock };
};

const appendSize = size => (params) => {
  if (!size) {
    return params;
  }

  const sizeBlock = {
    Limit: size,
  };

  return { ...params, ...sizeBlock };
};

const scanWithLimit = async (params, page) => {
  const { Items, LastEvaluatedKey } = await db.scan(params).promise();

  const enforcedLimitNotReached = page > 0;
  if (enforcedLimitNotReached) {
    const updatedParams = { ...params, ExclusiveStartKey: LastEvaluatedKey };
    await scan(updatedParams, page - 1);
  }

  return Items;
};

const scan = async (params, page, size) => {
  const { Items } = await db.scan(params).promise();
  if (page && size) {
    const lowerBound = (page - 1) * size;
    const upperBound = lowerBound + size
    return Items.slice(lowerBound, upperBound);
  }
  if (size) {
    return Items.slice(0, size);
  }
  return Items;
}

const resolver = {
  customers: async (_, { filter, size, page }) => {

    const defaultParams = {
      TableName: 'customers',
    };

    const params = compose(
      // appendSize(size), ### UNCOMMENT THIS ROW TO TEST scanWithLimit METHOD
      appendFilter(filter),
    )(defaultParams);

    const query = await scan(params, page, size);
    return query;
  },
};

module.exports.resolver = resolver;
