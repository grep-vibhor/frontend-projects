import {OpenAI} from "openai";


// see we are not importing tools becasue we are making it here, as openai changed how tools array should look like so here we have the latest one
import { getCurrentLocation, getCurrentWeather} from "./tools_with_params.js";


const client = new OpenAI(
    {apiKey: process.env.OPENAI_API_KEY }
);


const tools = [
    {
        type: "function",
        function: {
          name: "getCurrentLocation",
          description: "Get the current location",
          parameters: {
            type: "object",
            properties: {}
          },
        },
      },
      {
        type: "function",
        function: {
          name: "getCurrentWeather",
          description: "Get weather for a specific location",
          parameters: {
            type: "object",
            properties: {
              location: {
                type: "string",
                description: "The city and state, e.g., San Francisco, CA",
              },
            },
            required: ["location"],
          },
        },
      },
]



async function createAssistant() {

    const assistant = client.beta.assistants.create({
        model: "gpt-4o",
        instructions: "You are a smart AI Agent. Use the provided functions to answer questions.",
        tools
    })

    return assistant
    
}



// Step 1: create assistant
// const assistant = await createAssistant()

// console.log(assistant)

const assistant_id = "asst_81BnsjhVifOOjPevU4MN5uBU"


// Step 2: create thread

async function createThread() {

    const thread = await client.beta.threads.create();
    return thread
    
}
// const thread = await createThread()
// console.log(thread)

const threadID = "thread_cTsACkK4Qlr42j7H85LKNTXY"


// Step 3: create message in the thread

async function createMessage(threadID, query) {

    const threadMessages = await client.beta.threads.messages.create(
        threadID, 
        query
    )
    return threadMessages    
}

const query =  { 
        role: "user", 
        content: "What is my current location" 
    }

// const message = await createMessage(threadID, query)
// console.log(message)

const messageId = "msg_RbCngj4K1VSAaXPmhQRXO5Q7"

// Our assistant cannot responsd yet, it needs a Run


// Step 4: Run the assistant's thread
async function runThread(assistant_id, threadID) {
    const run = await client.beta.threads.runs.create(
      threadID,
      { assistant_id }
    )

    return run
  }


// const run =  await runThread(assistant_id, threadID)

// console.log(run)

// Following would be run object
/*
{
  id: 'run_VaHDwoHy1xlEQKZgRyk0IA5p',
  object: 'thread.run',
  created_at: 1730570692,
  assistant_id: 'asst_81BnsjhVifOOjPevU4MN5uBU',
  thread_id: 'thread_cTsACkK4Qlr42j7H85LKNTXY',
  status: 'queued',
  started_at: null,
  expires_at: 1730571292,
  cancelled_at: null,
  failed_at: null,
  completed_at: null,
  required_action: null,
  last_error: null,
  model: 'gpt-4o',
  instructions: 'You are a smart AI Agent. Use the provided functions to answer questions.',
  tools: [
    { type: 'function', function: [Object] },
    { type: 'function', function: [Object] }
  ],
  tool_resources: {},
  metadata: {},
  temperature: 1,
  top_p: 1,
  max_completion_tokens: null,
  max_prompt_tokens: null,
  truncation_strategy: { type: 'auto', last_messages: null },
  incomplete_details: null,
  usage: null,
  response_format: 'auto',
  tool_choice: 'auto',
  parallel_tool_calls: true
}
*/
// you see initially run is pending but will be completed soon.



// Lets see run status
// Get the current run
/*

const currentRun = await client.beta.threads.runs.retrieve(
    threadID,
    "run_VaHDwoHy1xlEQKZgRyk0IA5p"
  );

console.log("Run status: " + currentRun.status);

*/


// and you'll see run status as Run status: requires_action

// Step 5: Handle requires_action run


const handleRequiresAction = async (run) => {
    // Check if there are tools that require outputs
    if (
      run.required_action &&
      run.required_action.submit_tool_outputs &&
      run.required_action.submit_tool_outputs.tool_calls
    ) {
      // Loop through each tool in the required action section
      const toolOutputs = run.required_action.submit_tool_outputs.tool_calls.map(
        (tool) => {
          if (tool.function.name === "getCurrentLocation") {
            return {
              tool_call_id: tool.id,
              output: "Jaipur",
            };
          } else if (tool.function.name === "getCurrentWeather") {
            return {
              tool_call_id: tool.id,
              output: "30",
            };
          }
        },
      );
  
      // Submit all tool outputs at once after collecting them in a list

      
      
      if (toolOutputs.length > 0) {
        run = await client.beta.threads.runs.submitToolOutputsAndPoll(
          thread.id,
          run.id,
          { tool_outputs: toolOutputs },
        );
        console.log("Tool outputs submitted successfully.");
      } else {
        console.log("No tool outputs to submit.");
      }
  
      // Check status after submitting tool outputs
      return handleRunStatus(run);
    }
  };


const handleRunStatus = async (run) => {
    // Check if the run is completed
    if (run.status === "completed") {
      let messages = await client.beta.threads.messages.list(thread.id);
      console.log(messages.data);
      return messages.data;
    } else if (run.status === "requires_action") {
      console.log(run.status);
      return await handleRequiresAction(run);
    } else {
      console.error("Run did not complete:", run);
    }
  };


// const currentRun = await client.beta.threads.runs.retrieve(
//     threadID,
//     "run_aTcd9KHDTK80kdNIfTFsHpbm"
//   )

// console.log(currentRun.required_action.submit_tool_outputs.tool_calls)

handleRunStatus(currentRun);

// **************  OR ***************
// Create and poll run BECAUSE previous run may expire


let run = await client.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id,
});

console.log(run)
  
handleRunStatus(run);