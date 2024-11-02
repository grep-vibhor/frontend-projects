import {OpenAI} from "openai";
// changed getCurrentWeather to accept arguments
// cahnegd getCurrentLocation to actually fetch location from IP
import { getCurrentLocation, getCurrentWeather, tools} from "./tools_with_params.js";



const availableFunctions = {
    "getCurrentWeather": getCurrentWeather,
    "getCurrentLocation": getCurrentLocation
 }


// Goal - build an agent that can answer any questions that might require knowledge about my current location and the current weather at my location.


const client = new OpenAI(
    {apiKey: process.env.OPENAI_API_KEY }
);



async function agent(query) {

    const messages =  [
        { 
         role: "system", 
         content: "You are a smart AI agent. Give highly specific answers based on information provided from tools instead of giving generic answers." 
        },
        { 
            role: "user", 
            content: query 
        }
    ]
    const MAX_ITERATIONS = 5
    
    
    for (let i = 0; i<=MAX_ITERATIONS; i++){

            console.log(`Iteration #${i + 1}`)

            const response = await client.chat.completions.create({
                        model: "gpt-3.5-turbo",
                        messages,
                        tools
            });

            /*
            This is how output of response.choice[0] looks like if there is no tool call
            {
                index: 0,
                message: {
                    role: 'assistant',
                    content: "I don't have emotions, but I'm here and ready to assist you. How can I help you today?",
                    refusal: null
                },
                logprobs: null,
                finish_reason: 'stop'
            }
            */
            const finishReason = response.choices[0].finish_reason // get the finishReason
            
            const message = response.choices[0].message // get the message

            messages.push(message)
            /*
            message looks like if tool call is not there:
                message: {
                    role: 'assistant',
                    content: "I don't have emotions, but I'm here and ready to assist you. How can I help you today?",
                    refusal: null
                },
            */

            if (finishReason === "stop") {
                console.log("Agent Completed...")
                console.log(message.content)
                return
            }
            
            /*
            This is how output of reponse.choice[0] looks like if there a tool call
            {
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": null,
                    "tool_calls": [
                        {
                            "id": "call_SDhXnJbvxSWwy1m1R1J43EmQ",
                            "type": "function",
                            "function": {
                                "name": "getLocation",
                                "arguments": "{}"
                            }
                        }
                    ]
                },
                "finish_reason": "tool_calls"
            }
            */

            /*
            message looks like if tool call is there:
            {
                role: 'assistant',
                content: null,
                tool_calls: [
                    {
                    id: 'call_KNFfGh5v51xMuRfQS9XYqkIv',
                    type: 'function',
                    function: [Object]
                    }
                ],
                refusal: null
                }
                */

            else if(finishReason === "tool_calls"){
                const tool_calls = message.tool_calls
                // loop over tool calls array
                // get the function name
               // access the actual function from the array of available functions
               // call that function
				// push the response of that function to messages again
                for (let tool_call of tool_calls) {
                    
                    const functionName = tool_call.function.name
                    const functionToCall = availableFunctions[functionName]
                    const functionArgs = JSON.parse(tool_call.function.arguments)
                    // just added arguments here
                    const functionResponse = await functionToCall(functionArgs)
                    
                    console.log(functionResponse)
                    messages.push({
                        tool_call_id: tool_call.id,
                        role: "tool",
                        name: functionName,
                        content: functionResponse
                    })
                }

            }
            
            
    }


  }



agent(`What is my current location and weather at my location`)


