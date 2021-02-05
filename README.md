# Toolodex

## About  

This app allows a developer to save and categorize links to handy tools and resources across the internet, for later reference and easy access.  Users can create and re-order "toolboxes" at will, as well as share and "steal" tools from their friends.

## Contents

  1. [Requirements](#Requirements)
  1. [Usage](#Usage)
  1. [Features](#Features)
  1. [Examples of Use](#Examples-of-Use)
  1. [Roadmap](#Roadmap)
  1. [Development](#Development)
  1. [License](#License)

## Requirements

- Node.js
- Express 4.17.1
- Mongoose 5.10.5
- bcryptsjs 2.4.3
- dotenv 8.2.0
- ejs 3.1.5
- express-session 1.17.1
- method-override 3.0.0
- jQuery-UI 1.12.1
- MongoDB 4.2.8

## Usage

To clone and run this app, you'll need [Git](https://git-scm.com) installed on your computer, as well as [Node.js](https://nodejs.org/en/download/). From the command line:

1. Clone this repo: `$ git clone https://github.com/dtklumpp/toolodex`
1. Enter the repository: `$ cd toolodex`
1. Install dependencies with `$ npm install`
1. Run the application `$ npm start`
1. View the app in your browser at `http://localhost:4000`
1. Make an account to access features
1. You can also make a DEMO account with the "Demo Account" button

Note: if mongdb isn't running already, you will need to run:

- start the database: `$ mongod`

if this command fails, use:

- start the database v2: `$ brew services start mongodb/brew/mongodb-community@4.2`

In addition, you will need to create certain environmental variables in a .env file in the project root folder.  Defaults are as follows:

```
PORT=4000
SECRET=opensesame
MONGODB_URI=mongodb://localhost:27017/toolodex
```

The database is automatically seeded with a "Favorites" category for each user



## Features

- full REST / CRUD for Tools model
- full REST / CRUD for Categories model
- full REST / CRUD FOR Users model
- 90s Office Theme
- User Authentication / Login
- working Search Bar for Tools / Categories
- basic Authorization (e.g. cannot delete another User)
- basic Validation for data
- remove Tool from Category feature
- category pre-population & custom routes
- full USA State support + UAE
- auto-login after register an account
- alphabetical sort of Tools Index
- advanced shadowing
- Guest Sign-In feature
- many-to-many relation twixt Tools / Categories
- draggable Post-It notes
- reflexive Friends relation between Users
- sharing /stealing tools between Users
- bonus Map display for finding Friends
    
## Examples-of-Use

- [screenshots]


## Roadmap -- pending features

- save dragging re-ordering to the database in real-time
- custom model creation to track Events, Bugs, etc in same space
- custom checkboxes -- click the category itself to check/uncheck
- dynamic post-it sizes
- design: push-pins added to corkboard
- advanced security feature
- advanced Friend CRUD


## Development

To help with a bug or add functionality, do this:

- Fork this repo
- Make a branch (`git checkout -b new-feature`)
- Make modifications where necessary
- Add comments corresponding to your changes
- Commit (`git commit -m 'explanation'`)
- Push up (`git push origin new-feature`)
- Make a Pull Request 


## License

MIT ©

