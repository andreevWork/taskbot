# TasksKotBot
![Deploy](https://github.com/andreevWork/taskbot/workflows/Deploy/badge.svg)
[![GitHub tag](https://img.shields.io/github/tag/andreevWork/taskbot.svg)](https://github.com/andreevWork/taskbot/tags)

Home page - <a href="https://andreev-tasks-bot.herokuapp.com/">andreev-tasks-bot.herokuapp.com</a>

**Because bot hosts on free heroku plan it turns off after some time, so if you wanna test bot in telegram
just visit home page above, it will restart heroku app, and after it you can try bot in telegram**

-----

In total, I spent about 15h-20h during 5-6 days to write this project/tests/setting deploy/etc.

## Stack

- simple telegram api package - https://github.com/yagop/node-telegram-bot-api
- mongoDB as storage(free plan on mongodb.com) and mongoose as ODM https://mongoosejs.com/
- jest for integration auto testing - https://jestjs.io/
- prettier for code style - https://prettier.io/
- Github Actions for CD(kind of), deploy app only for versions commit(tags) and only if tests are green
- Deploy and hosts on heroku

## Local dev

- create a file `.env` and add such variables inside:
  - `TELEGRAM_BOT_TOKEN` - token for access to telegram API
  - `DB_URL` - url for connect to MongoDB cluster
  - `PORT` - local port for http server with bot`s description page
- use `npm start` script for start dev server
- use `npm test` for start jest tests  