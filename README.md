# TasksKotBot
![Deploy](https://github.com/andreevWork/taskbot/workflows/Deploy/badge.svg)
[![GitHub tag](https://img.shields.io/github/tag/andreevWork/taskbot.svg)](https://github.com/andreevWork/taskbot/tags)

Home page - <a href="https://andreev-tasks-bot.herokuapp.com/">andreev-tasks-bot.herokuapp.com</a>

## Local dev

- create a file `.env` and add such variables inside:
  - `TELEGRAM_BOT_TOKEN` - token for access to telegram API
  - `DB_URL` - url for connect to MongoDB cluster
  - `PORT` - local port for http server with bot`s description page
- use `npm start` script for start dev server
- use `npm test` for start jest tests  

## Description of used tech stack and decisions

TODO