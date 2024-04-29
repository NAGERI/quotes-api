# Quotes API

This is a simple Quotes API, authors can create a quote.

It uses RBAC and depending on the role [ADMIN, USER] you can perform CRUD operations.

### Install Dependancies

```cmd
npm install
```

### Set up env variables in a `.env` file

```env
PORT=4000
DATABASE_NAME=""
DATABASE_PASSWORD=""
DATABASE_PORT=5432
DATABASE_USER=""
DATABASE_PASSWORD=""
NODE_ENV="development"
JWT_SECRET="Very-long-key-to-act-as-a-private-key-for-development$#"

DATABASE_URL=`postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:${DATABASE_PORT}/${DATABASE_NAME}?schema=public`
```

### Run Prisma migrations

```cmd
npm run prisma
```

### Run the server using

```cmd
 npm run start
```

### The API defination, using postman can be found [here](https://documenter.getpostman.com/view/8123192/2sA3Bq3Awi)
