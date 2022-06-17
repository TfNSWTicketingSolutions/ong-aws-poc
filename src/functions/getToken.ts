const AWS = require('aws-sdk');
const ddbClient = new AWS.DynamoDB.DocumentClient();

import { formatError, formatResponse } from '../libs/http-lambda';

export const handler = async (event, _context) => {
  try {
    const token = (
      await ddbClient
        .get({
          TableName: 'ong-tokens-poc',
          Key: { tokenId: event.pathParameters.tokenId }
        })
        .promise()
    ).Item;

    return formatResponse(token);
  } catch (error) {
    return formatError(error);
  }
};
