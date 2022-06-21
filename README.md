# ONG POC

## Setting up

Assumptions - you have node 16 installed (preferably via nvm)

- `npm install`
- set up AWS creds in your terminal
- `npm run deploy` to deploy it to AWS

## Populate some data

- `aws dynamodb batch-write-item --request-items file://sample-data.json`

## Running

- `npm run start`
- getting token info `curl --location --request GET 'http://localhost:3000/poc/token/36ac9124-9c17-446a-8f0c-be35eb9cc827'`
- getting fare info `curl --location --request PATCH 'http://localhost:3000/poc/token/8785ad30-4b43-4930-988a-f0785a99a8c2/getFare'`

Project could be adapted to be called via APIGW or direct lambda invoke
