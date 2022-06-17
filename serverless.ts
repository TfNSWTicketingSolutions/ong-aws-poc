import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'ong',
  frameworkVersion: '>=3.18',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    region: 'ap-southeast-2',
    stage: 'poc',
    runtime: 'nodejs16.x',
    deploymentMethod: 'direct',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000'
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:GetItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:Query',
              'dynamodb:DeleteItem'
            ],
            Resource: [
              {
                'Fn::Sub': 'arn:aws:dynamodb:${AWS::Region}:${AWS::AccountId}:table/ong-tokens-${sls:stage}'
              },
              {
                'Fn::Sub': 'arn:aws:dynamodb:${AWS::Region}:${AWS::AccountId}:table/ong-taps-${sls:stage}'
              }
            ]
          }
        ]
      }
    }
  },
  functions: {
    getToken: {
      handler: './src/functions/getToken.handler',
      events: [
        {
          http: {
            method: 'get',
            path: '/token/{tokenId}'
          }
        }
      ]
    },
    getFare: {
      handler: './src/functions/getFare.handler',
      events: [
        {
          http: {
            method: 'patch',
            path: '/token/{tokenId}/getFare'
          }
        }
      ]
    }
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node16',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10
    }
  },
  resources: {
    Resources: {
      TokensTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'ong-tokens-${sls:stage}',
          AttributeDefinitions: [
            {
              AttributeName: 'tokenId',
              AttributeType: 'S'
            }
          ],
          KeySchema: [
            {
              AttributeName: 'tokenId',
              KeyType: 'HASH'
            }
          ],
          BillingMode: 'PAY_PER_REQUEST'
        }
      },
      TapsTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'ong-taps-${sls:stage}',
          AttributeDefinitions: [
            {
              AttributeName: 'tokenId',
              AttributeType: 'S'
            },
            {
              AttributeName: 'tapId',
              AttributeType: 'S'
            },
            {
              AttributeName: 'tapTime',
              AttributeType: 'N'
            }
          ],
          KeySchema: [
            {
              AttributeName: 'tapId',
              KeyType: 'HASH'
            }
          ],
          GlobalSecondaryIndexes: [
            {
              IndexName: 'tripsByToken',
              KeySchema: [
                { AttributeName: 'tokenId', KeyType: 'HASH' },
                { AttributeName: 'tapTime', KeyType: 'RANGE' }
              ],
              Projection: {
                ProjectionType: 'ALL'
              }
            }
          ],
          BillingMode: 'PAY_PER_REQUEST'
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
