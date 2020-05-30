# Tech Mahindra - Test #
[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

## Abstract ##
This project made in Node.js and Express.js aims to provide a restful api for authentication and user search.

## I. Development Requirements ##

### A. Versions ###
 - Node.js [12.13.0](https://nodejs.org/en/download/)
 - MongoDB [4.2.1](https://docs.mongodb.com/manual/administration/install-community/)

### B. Run Application ###
```bash
$ yarn
$ yarn dev
```

### C. Run Documentation ###
```bash
$ cd documentation
$ yarn global add insomnia-documenter
$ npx insomnia-documenter -c config.json 
$ npx serve
```
... and open your browser in http://localhost:5000 

### D. Run Tests ###
```bash
$ yarn jest
```

### E. Run ESlint ###
```bash
$ npx eslint .
```

## II. Deployment Requirements ##

### A. Environment Variables ###
 We use the DOTENV library to manage environment variables. Edit the .env file that is in the root of the project.
 
| Variables | Description |
|-----------|-------------|
| PORT | Port where the app will start |
| MONGO_URL | Database address |
| APP_SECRET | Hash to generate JWT token |

## III. Todo ##
 - Implement more feature to system

## IV. License ##
[MIT](LICENSE)

