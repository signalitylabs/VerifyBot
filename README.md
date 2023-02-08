```
 __  __                        ___             ____            __      
/\ \/\ \                 __  /'___\           /\  _`\         /\ \__   
\ \ \ \ \     __   _ __ /\_\/\ \__/  __  __   \ \ \L\ \    ___\ \ ,_\  
 \ \ \ \ \  /'__`\/\`'__\/\ \ \ ,__\/\ \/\ \   \ \  _ <'  / __`\ \ \/  
  \ \ \_/ \/\  __/\ \ \/ \ \ \ \ \_/\ \ \_\ \   \ \ \L\ \/\ \L\ \ \ \_ 
   \ `\___/\ \____\\ \_\  \ \_\ \_\  \/`____ \   \ \____/\ \____/\ \__\
    `\/__/  \/____/ \/_/   \/_/\/_/   `/___/> \   \/___/  \/___/  \/__/
                                         /\___/                        
                                         \/__/                         
```

<h3 align=center>A <a href=https://github.com/discordjs/discord.js>discord.js v14</a> verification bot</h3>


<p align="center">
  <a href="#copyright-notice">Copyright Notice</a>
  •
  <a href="#features">Features</a>
  •
  <a href="#getting-started">Getting Started</a>
  •
  <a href="#developer-links">Resources</a>
  •
  <a href="https://discord.gg/EQnbYyYBmG">Discord Server</a>
</p>


<div align=center>

[![Discord](https://img.shields.io/discord/753770820358373487.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/EQnbYyYBmG)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=signalitylabs_VerifyPurchaseBot&metric=ncloc)](https://sonarcloud.io/dashboard?id=signalitylabs_Baylee-v1)

</div>



  ## What's Verify Bot?

  Verify Bot is a simple to configure bot that helps Spigot/BuiltByBit plugin developers verify their plugin's purchases through PayPal's API. This allows developers to easily provide support for verified plugin buyers.

  As a bonus, this plugin is also a framework for creating Discord bots. You can easily add additional slashcommands by duplicating either the about or verify command and making changes.

  ## Copyright Notice

  Verify Bot is the copyright and intellectual property of Adam "Centers" Parker. Verify Bot's source code ("bot") is released under the [BSD 3-Clause License license](LICENSE). This means any redistribution of this bot, in part or in whole, must retain the copyright notice found in [the license](LICENSE). 
  
  
  ## Features

  ### Commands
  - 📰 **About** `Quick plugin / server information`
  - 🔍 **Verify** `Verify PayPal purchase to unlock Discord role`

  ### Other Features
  - **Detailed logs** `Logs are saved to the logs folder`
  - **Caching** `PayPal transactions are cached for 10 minutes (configure in config.json) in the cache folder`


  ## Getting Started

  1. [Download, install, and setup Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
  2. Sign up for a [Discord developer account](https://discord.com/developers/applications/) to [create a bot](https://discord.com/developers/docs/intro) and generate a bot token.
  3. Setup all of the required environmental variables provided in the [environmental variables section](#environmental-variables).
  4. Edit config.json as seen in the [config settings area](#config-settings).
  5. Invite the bot to your Discord server
  ```https://discord.com/oauth2/authorize?client_id={BOT-ID}&scope=bot&permissions={PERMISSIONS}&redirect_uri={REDIRECT}```
  6. Start the bot up
  

  ## Environmental Variables
  [Using Visual Studio Code? Tap here to learn how set this up](https://stackoverflow.com/questions/29971572/how-do-i-add-environment-variables-to-launch-json-in-vscode).

  * **BOT_TOKEN** ```Discord token ID```
    - [discord.com/developers/applications/](https://discord.com/developers/applications/)
  * **BOT_CLIENT** ```Discord bot client ID```
    - Adds all of the current commands into a database and handles Money commands.
  * **PAYPAL_CLIENT** ```PayPal client API key```
  * **PAYPAL_SECRET** ```PayPal secret API key```
    - Create a Live PayPal API application (not sandbox) [developer.paypal.com/](https://developer.paypal.com/)
    - Give the API keys permission for "Transaction Search"


  ## Config Settings
  Edit `src/config.json`

  - **Bot** 
    - `General bot information that's only displayed in the /about command`
  - **PayPal**
    - <u>monthsToCheck</u> `How many months to go back when searching for a purchase. The higher the number, the longer it takes. Recommended to not go above 6 (but I'm not your mom)`
    - <u>cacheExpiresInMins</u> `The amount of time (in minutes) before the cache expires`
  - **Verify**
    - This is an array so you can add multiple in this section
    - <u>discordRoleID</u> `The Discord role to give a member when their purchase is verified`
    - <u>searchFor</u> `Name of the plugin to search PayPal for`

  
  ## Developer Links

  * [signality.io](https://signality.io/)
  * [github.com/signalitylabs](https://github.com/signalitylabs)
  * [github.com/thecenters](https://github.com/thecenters)

