# Express Js and MongoDB Authentication App with JWT

#### (This app was made for practice and to be used for later reference)

## Getting started:

- Ensure Node is installed
- Download MongoDB Community Edition on Windows
- Clone the repo
- In myExpressApp folder create a config folder with dev.env file in it
- Set up environemnt variables: PORT:value, MONGODB_URL=value, JWT_SECRET=value
- Install dependencies: npm install
- Start up your local mongodb server and set path to data directory:
  - From powershell in windows: navigate to the bin folder inside the downloaded mongodb (community server i.e mongo as a windows service) folder and execute the mongod.exe file
  - Set up path to local database as such: --dbpath=/User/Asus/desktop/myData
  - [Follow this link for detailed procedure](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)
- Download, setup and connect to server using MongoDBCompass or Robo 3T (GUIs for db)
- To start local deveopment server:
  - npm run dev
