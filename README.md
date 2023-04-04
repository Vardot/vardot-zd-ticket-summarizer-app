# Vardot Zendesk Ticket Summarizer App
Vardot Zendesk Ticket Summarizer App is a simple and efficient application developed by Mohammed Razem that integrates Zendesk with OpenAI GPT-3.5. The app leverages the power of GPT-3.5 to provide quick and accurate summarize a ticket for support agents, focusing on important details and improving their response time and overall customer satisfaction.

This app is based on Zendesk AI's guide, which can be found here: https://developer.zendesk.com/documentation/apps/build-an-app/using-ai-to-summarize-conversations-in-a-support-app/

## Features
- Seamless integration with Zendesk
- Utilizes OpenAI GPT-3.5 for generating reply suggestions
- Enhances support agent productivity and customer satisfaction

## Installation
1. Install Zendesk CLI (ZCLI). See https://developer.zendesk.com/documentation/apps/getting-started/using-zcli/#installing-and-updating-zcli
2. Download or clone the repository
3. Authenticate to Zendesk. See https://developer.zendesk.com/documentation/apps/getting-started/using-zcli/#authentication
4. Go to the repository filder, and run `zcli apps:create` to deploy the app. Or `zcli apps:update` to push an update to the existing app. See 

## Usage
Once installed, the Vardot Zendesk Ticket Summarizer App will appear in your Zendesk ticket sidebar. When viewing a support ticket, the app will automatically analyze the conversation and provide meaningful summary including:
- Summary
- Customer sentiment
- Key information

## License
This project is licensed under the MIT License.

## Credits
- Mohammed Razem
- Zendesk AI's Guide (https://developer.zendesk.com/documentation/apps/build-an-app/using-ai-to-summarize-conversations-in-a-support-app/)
