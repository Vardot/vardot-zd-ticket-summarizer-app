const client = ZAFClient.init();
const TEMPLATE_INITIAL_PROMPT = `Summarize the following customer service interaction.
Detect the customer's sentiment. And extract any key information such as technologies, products, and critical dates as tags.
Display the outcome in the following main headers as h5 HTML tags, and Key Information as HTML lists.
- Summary
- Customer Sentiment
- Key Information`;

async function updateSummary() {
  // Show the div#container and display loading text
  container.style.display = "block";
  container.innerHTML = "Loading the ticket summary...";

  // UI elements to work with
  const button = document.querySelector("#ticket_summarizer-get-summary");
  const label = document.querySelector(".exclude-agent-label");

  try {
    button.classList.add("is-disabled");
    label.classList.add("is-disabled");

    // Get summary
    const convo = await getTicketConvo();
    const prompt = await getPrompt(convo);
    const summary = await getSummary(prompt);
    const container = document.getElementById("container");

    // Re-enable button
    client.invoke("resize", { width: "100%", height: "400px" });
    button.classList.remove("is-disabled");
    label.classList.remove("is-disabled");

    container.innerHTML = summary;
  } catch (error) {
    container.innerHTML = `An error occured: ${error.responseJSON.error.message}`;

    // Re-enable button
    client.invoke("resize", { width: "100%", height: "400px" });
    button.classList.add("is-disabled");
    label.classList.add("is-disabled");
  }
}

async function getTicketConvo() {
  try {
    const ticketConvo = await client.get("ticket.conversation");
    let filteredConvo = ticketConvo["ticket.conversation"];

    // @todo, turn this into a setting to work from setting.excludeInternalConvo param
    if (true) {
      filteredConvo = filteredConvo.filter((conversation) => conversation.channel.name !== "internal");
    }

    // Check if either setting.excludeAgentsConvo is true or input#exclude-agent is checked
    const excludeAgentCheckbox = document.getElementById("exclude-agent");
    // @todo, turn this into a setting to work from setting.excludeInternalConvo param
    if (excludeAgentCheckbox.checked) {
      filteredConvo = filteredConvo.filter((conversation) => conversation.author.role === "end-user");
    }

    // Remove unwanted details in object to reduce OpenAI API tokens
    const cleanedConvo = cleanTicketConvoData(filteredConvo);
    return JSON.stringify(cleanedConvo);
  } catch (error) {
    console.log(`An error occured: ${JSON.stringify(error)}`);
  }
}

async function getPrompt(convo) {
  return `${TEMPLATE_INITIAL_PROMPT}

${convo}`;
}

function cleanTicketConvoData(rawData) {
  return rawData.map(conversation => {
    const { author, channel, ...remainingConversation } = conversation;
    const { id, avatar, ...remainingAuthor } = author;
    const { contentType, ...remainingMessage } = remainingConversation.message;

    return {
      ...remainingConversation,
      author: remainingAuthor,
      message: remainingMessage
    };
  });
}

async function getSummary(prompt) {
  try {
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
  } catch (error) {
    console.error(JSON.stringify(error));
    throw error;
  }
}


// Event listener for the button click
document.getElementById("ticket_summarizer-get-summary").addEventListener("click", async (event) => {
  await updateSummary();
});

client.on("app.registered", () => {
  client.invoke("resize", { width: "100%", height: "400px" });
  updateSummary();
});


client.on("ticket.conversation.changed", () => {
  const container = document.getElementById("container");
  container.innerHTML = "Conversation changed. Click to regenerate the summary with the new changes.";
});
