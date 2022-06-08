# ONG POC

## Setting up

- `yarn install`
- set up AWS creds in your terminal
- `yarn sls deploy` to deploy it to AWS

## Populate some data

- `aws dynamodb batch-write-item --request-items file://sample-data.json`

## Running

- `yarn start`
- getting token info `curl --location --request GET 'http://localhost:3000/poc/token/36ac9124-9c17-446a-8f0c-be35eb9cc827'`
- getting fare info `curl --location --request PATCH 'http://localhost:3000/poc/token/8785ad30-4b43-4930-988a-f0785a99a8c2/getFare'`
