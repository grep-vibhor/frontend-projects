import {OpenAI} from "openai";


// see we are not importing tools becasue we are making it here, as openai changed how tools array should look like so here we have the latest one
import { getCurrentLocation, getCurrentWeather} from "./tools_with_params.js";


const client = new OpenAI(
    {apiKey: process.env.OPENAI_API_KEY }
);



const functions = [
    {
        function: getCurrentWeather,
        parameters: {
            type: "object",
            properties: {
                location: {
                    type: "string",
                    description: "The location from where to get the weather"
                }
            },
            required: ["location"]
        }
    },
    {
        function: getCurrentLocation,
        parameters: {
            type: "object",
            properties: {}
        }
    },
]

async function agent(query) {
    const messages =  [
        { 
         role: "system", 
         content: "You are a very smart AI agent. Give highly specific answers based on information provided from tools instead of giving generic answers." 
        },
        { 
            role: "user", 
            content: query 
        }
    ]

    const runner = client.beta.chat.completions.runFunctions({
        model: "chatgpt-4o-latest",
        messages,
        functions
    }).on("message", (message) => {console.log(message)}) // listen to message event and print message

    const finalResponse = await runner.finalContent()

    console.log(finalResponse)
}

agent("What is my current location ??")