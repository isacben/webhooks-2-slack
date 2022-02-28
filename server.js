/**
 * Webhooks 2 Slack
 *
 * Listen to webhooks and forward to Slack.
 *
 * @file   This files defines the rest api endpoints.
 * @author Isaac Benitez.
 * @version 1.0.0
 * 
 * @requires express
 * @requires slack/web-api
 */

const express = require('express');
const { WebClient } = require('@slack/web-api');

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT);

const web = new WebClient(process.env.SLACK_TOKEN);

app.post('/wh', (req, res) => {

    (async () => {

        // https://api.slack.com/methods/chat.postMessage
        const mainMsg = await web.chat.postMessage({
          channel: 'webhooks',
          text: 'Webhook received!',
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: 'Webhook received: `' + JSON.stringify(req.body.type, null, 2) + '`'
              }
            }
          ]
        });

        const msgid = mainMsg.ts;

        const whMsg = await web.chat.postMessage({
            channel: 'webhooks',
            thread_ts: msgid,
            text: 'Webhook body',
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: '```' + JSON.stringify(req.body, null, 2) + '```'
                }
              }
            ]
          });

    })();

    res.status(200).send();
})