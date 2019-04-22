const { ApolloServer, gql } = require('apollo-server-lambda');
const customersResolver = require('./resolvers/Customer').resolver;

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Customer {
    ID_UTENTE: String
    CODICE_CLIENTE: String
    EMAIL: String
    NOME: String
    COGNOME: String
    DATA_NASCITA: String
    CODICE_FISCALE: String
    STATO: String
    ATTIVO: String
    NUOVO: String
    RETE: String
    AGENTE: String
    CANONE_RAI: String
  }

  type Query {
    hello: String,
    customers(filter: String, size: Int, page: Int, sort: String): [Customer!]!,
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    ...customersResolver,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

exports.handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
});
