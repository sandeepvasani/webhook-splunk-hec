# webhook-splunk-hec
Send webhook events to Splunk via [Http Event Collector (HEC)](https://docs.splunk.com/Documentation/Splunk/latest/Data/UsetheHTTPEventCollector)

## Installation

**Note:** Relies on node

Install Serverless

```
npm install -g serverless
```

Install other dependencies

```
npm install
```

Configure [Serverless here](https://serverless.com/framework/docs/providers/aws/guide/credentials/).  This is used to deploy the system to AWS with a single command.

## Deploying
The system can be deployed via the command line, with the following parameters:

- `app`: application name (zoom, gitlab, etc)
- `region`: an AWS region 
- `auth_token`: authorization token
- `splunk_url`: the url of your target splunk instance, including the relevant port number for HttpEventCollector
- `splunk_token`: the HEC token

Example:
```
serverless deploy --app=zoom --region=us-east-2 --auth_token=cchh-ddc-dff --splunk_url=https://input-prd-p-abcdefg.cloud.splunk.com:8088 --splunk_token=XXX
```

After the deploy has finished you should see something like:
  ```bash
  Service Information
  service: webhook-splunk-hec
  stage: dev
  region: us-east-1
  api keys:
    None
  endpoints:
    POST - https://abcdefg.execute-api.us-east-1.amazonaws.com/dev/webhook
  functions:
    logToSplunk: webhook-hec-dev-logToSplunk
  ```

## Configure Zoom to send data
Configure your webhook in your zoom settings. [Setting up a Webhook App](https://marketplace.zoom.us/docs/guides/getting-started/app-types/create-webhook-only-app)

**(1.)** Plugin your API POST endpoint for Event notification endpoint URL. (`https://abcdefg.execute-api.us-east-1.amazonaws.com/dev/webhook` in this example)

**(2.)** Choose the types of events you want the zoom webhook to fire on

**(3.)** Plugin your verification token for auth_token


## Configure Gitlab to send data
Configure your webhook in your gitlab settings. [Setting up a Webhook App](https://docs.gitlab.com/ee/user/project/integrations/webhooks.html)