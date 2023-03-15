# Nodejs MySQL Rest Api

Complete CRUD app with MySQL and Expressjs

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install
```

Create a `.env` file and add the following variables:

```bash
DB_HOST= # Database Host
DB_USER= # Database User
DB_PASS= # Database Password
DB_NAME= # Database Name
```

## Development Server

Start the development server on http://localhost:3001

```bash
# yarn
yarn dev

# npm
npm run dev
```

## Routes

```bash
GET     /        # Get all post
GET     /:id     # GEt Single post
POST    /        # Add  post
POST    /many    # Add multiple posts
PATCH   /        # Update one post
DELETE  /        # Delete one post
```
