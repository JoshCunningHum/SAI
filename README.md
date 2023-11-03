Discord controls just doesn't fit with me, so I made this:

<img src="./assets/logo.png" />

# SAI
 A discord bot that primarily focuses on browser control

## Development
This project consists of 2 packages:
- `client` - Nuxt application for the browser controller, deployed to [`tbc`]()
- `bot` - Node/Express.js application that is connected to `Discord API` using `discord.js`

### Getting started
1. Clone this repo
2. Run `npm install` in the root directory of the project
3. In the `bot` directory, create a `.env` file and input your Discord App details
```env
BOT_TOKEN=TOKEN_HERE
```
4. Run the whole app using `npm start` and visit `localhost:5137`
