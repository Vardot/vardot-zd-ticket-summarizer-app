const client = ZAFClient.init();

async function updateSummary() {
  const convo = await getTicketConvo();
  const prompt = await getPrompt(convo);
  const summary = await getSummary(prompt);
  const container = document.getElementById("container");

  container.innerHTML = summary;
}

async function getTicketConvo() {
  const ticketConvo = await client.get("ticket.conversation");
  return JSON.stringify(ticketConvo["ticket.conversation"]);
}

async function getPrompt(convo) {
  return `
Summarize the following customer service interaction.
Detect the customer's sentiment. And extract any key information such as technologies, products, and critical dates as tags.
Display the outcome in the following main headers as h5 HTML tags, and Key Information as HTML lists.
- Summary
- Customer sentiment
- Key Information

${convo}`;
}

async function getSummary(prompt) {
  const options = {
    url: "https://api.openai.com/v1/chat/completions",
    type: "POST",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer {{setting.openAiApiToken}}",
    },
    data: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    }),
    secure: true,
  };
  const response = await client.request(options);

  return response.choices[0].message.content.trim();
}

client.on("app.registered", () => {
  client.invoke("resize", { width: "100%", height: "400px" });
  updateSummary();
});

client.on("ticket.conversation.changed", () => {
  updateSummary();
});
