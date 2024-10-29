### Run with Docker

- Run the command:

```shell
docker compose build
docker compose up -d
# -d - to run in the background
# --build - to rebuild containers
```

Data connect to db in .env file

### Example .env file

```shell

MONGO_URI="mongodb://root:password@my-db:27017/database?authSource=admin"
# MONGO_URI="mongodb://root:password@localhost:27017/database?authSource=admin" # localhost for local running
MONGO_INITDB_ROOT_USERNAME=root # login database
MONGO_INITDB_ROOT_PASSWORD=password # password database


```

Also you can rename file " env.example " in main project folder 

For testing query:

http://localhost:3001  ( home page )

http://localhost:3001/crm  ( edit page )

Docker will run migration after build

For manual migrations:

```shell
node migration.js
```

CLI script for import data to database:

```shell
node import-CLI.js <path-ti-file>
```

Data should be in .json file and with structure

```shell
{
  "cars": [{}, {} ...],
  "categories": [{}, {} ...]
}
```
You can see data example in data.json file in root folder

Example running import command:
```shell
node import-CLI.js data.json
```
