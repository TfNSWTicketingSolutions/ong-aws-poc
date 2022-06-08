const AWS = require("aws-sdk");
const ddbClient = new AWS.DynamoDB.DocumentClient();

import { formatError, formatResponse } from "../libs/http-lambda";

export const handler = async (event, _context) => {
  // event.body will contain the payload of a new tap
  let taps = [];
  try {
    taps = (
      await ddbClient
        .query({
          TableName: "ong-taps-poc",
          IndexName: "tripsByToken",
          KeyConditionExpression: "#tokenId = :tokenId",
          ExpressionAttributeNames: {
            "#tokenId": "tokenId",
          },
          ExpressionAttributeValues: {
            ":tokenId": event.pathParameters.tokenId,
          },
        })
        .promise()
    ).Items;

    let res;
    if (!taps.length || taps[taps.length - 1].type === "TAP_OFF") {
      res = { type: "TAP_ON", success: true };
    } else {
      res = {
        type: "TAP_OFF",
        fare: Math.floor(Math.random() * 700 + 300),
        success: true,
      };
    }

    return formatResponse(res);
  } catch (error) {
    return formatError(error);
  }
};
