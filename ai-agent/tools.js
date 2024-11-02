export async function getCurrentLocation(){
    return JSON.stringify({
        city: "Jaipur",
        state: "Rajasthan",
        country: "India"
    })
}

export async function getCurrentWeather(){
    return JSON.stringify({
        enum: 45,
        unit: "C"
    })
}

export const tools = [
    {
      "type": "function",
      "function": {
        "name": "getCurrentWeather",
        "description": "Get the current weather in a given location",
        "parameters": {
          "type": "object",
          "properties": {}
        },
      }
    },
    {
        "type": "function",
        "function": {
          "name": "getCurrentLocation",
          "description": "Get the current location",
          "parameters": {
            "type": "object",
            "properties": {}
          },
        }
      }
];