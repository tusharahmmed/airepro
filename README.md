# Music Library System

### Technology Stack:

- Used TypeScript as the programming language.
- Used Express.js as the web framework.
- Used prisma as the Object Relational Mapping (ORM) and DBMS for postgresql .
- Used Zod as for the schema validation
- Used JSON Web Token for authentication & authorization

### Live Link | Base Url: https://m36-music.vercel.app/

### Download Postman Collection : https://shorturl.at/CIK03

### Application Routes:

#### Auth

- api/v1/auth/signin (POST)
  Request body:

```json
{
  "email": "example@gmail.com",
  "password": "password@@"
}
```

Response Sample Pattern:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "User signin successfully!",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJkYWE3YjFhLTcxYjMtNDhjNi04MzE4LTNkZjc4NjQ2YmFmZiIsInJvbGUiOiJzdXBlcl9hZG1pbiIsImlhdCI6MTcwNTY2MzkzMSwiZXhwIjoxNzA1NzUwMzMxfQ.CMFYLiFuH39Ff_QeNCGhCGZ8xfrBhi3YS3ZpXAEP2S4"
  }
}
```

- api/v1/auth/signup (POST)

```json
{
  "name": "naem",
  "email": "name@gmail.com",
  "password": "passwod"
}
```

Response Sample Pattern:

```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGUzMzMwM2FhNDI1OTZlODVlZTk5NjIiLCJlbWFpbCI6InR1c2hhcmVlQGdtYWlsLmNvbSIsImlhdCI6MTY5MjYxMTMzMSwiZXhwIjoxNjkyNjk3NzMxfQ.SgbnKgJygB4x6-r_sc6br506a27FQSPY6br6XAXheaM",

}
```

- api/v1/auth/refresh-token (POST)

Response Sample Pattern:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Successfully generate refresh token",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJkYWE3YjFhLTcxYjMtNDhjNi04MzE4LTNkZjc4NjQ2YmFmZiIsInJvbGUiOiJzdXBlcl9hZG1pbiIsImlhdCI6MTcwNTY2NDAyNSwiZXhwIjoxNzA1NzUwNDI1fQ.SjzcK5HTHq0MTDTV7pbs-EVTbXkrB3Z7xeIJkd4mWio"
  }
}
```

## Super admin routes

### Users

- api/v1/users/ (POST)
- api/v1/users (GET)
- api/v1/users/:id (Single GET)
- api/v1/users/:id (PATCH)
- api/v1/users/:id (DELETE)

##### Sample Data: (User)

```json
{
  "id": "bdaa7b1a-71b3-48c6-8318-3df78646baff",
  "name": "Super Admin",
  "email": "super@gmail.com",
  "role": "super_admin",
  "createdAt": "2024-01-19T10:41:03.799Z",
  "updatedAt": "2024-01-19T10:41:03.799Z"
}
```

#### Pagination and Filtering routes of users

- api/v1/users?pag=1&limit=10
- api/v1/users?sortBy=createdAt&sortOrder=asc
- api/v1/users?searchTerm=Cha #which will applly for email and name filed

### Genre

- api/v1/genres (POST)

Request body:

```json
{
  "title": "Folk"
}
```

Response Sample Pattern:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "genre created successfully",
  "data": {
    "id": "6bc6d5e4-444f-4461-9fb7-b4060303c9d6",
    "title": "Folk",
    "createdAt": "2024-01-19T11:43:29.989Z",
    "updatedAt": "2024-01-19T11:43:29.989Z"
  }
}
```

- api/v1/genres (GET)

Response Sample Pattern:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "genre retrieved successfully",
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10
  },
  "data": [
    {
      "id": "6bc6d5e4-444f-4461-9fb7-b4060303c9d6",
      "title": "Folk",
      "createdAt": "2024-01-19T11:43:29.989Z",
      "updatedAt": "2024-01-19T11:43:29.989Z"
    }
  ]
}
```

- api/v1/genres/:id (DELETE)

### Artist

- api/v1/artists (POST)

Request body:

```json
{
  "title": "Shah Abdul Karim"
}
```

- api/v1/artists (GET)

- api/v1/artists/:id (DELETE)

### Album

- api/v1/albums (POST)

Request body:

```json
{
  "title": "Test Album",
  "releaseYear": "2366",
  "artists": ["4c4af2dd-32fb-4f78-bba8-ab572174c489"],
  "genres": ["c42d5829-7412-458f-80d1-614ecaa9b4f9"]
}
```

- api/v1/albums (GET)

##### Pagination and Filtering routes of albums

- api/v1/albums?pag=1&limit=10
- api/v1/albums?sortBy=createdAt&sortOrder=asc
- api/v1/albums?searchTerm=Cha

- api/v1/albums/:id (PATCH)
  Request body:

```json
{
  "title": "Test Album",
  "releaseYear": "2366",
  "artists": ["4c4af2dd-32fb-4f78-bba8-ab572174c489", "NEW ADDED ARTIST ID"],
  "genres": ["c42d5829-7412-458f-80d1-614ecaa9b4f9"]
}
```

- api/v1/albums/:id (GET)

- api/v1/albums/:id (DELETE)

### Song

- api/v1/songs (POST)

Request body:

```json
{
  "title": "song name",
  "duration": "8:10 Minutes",
  "albumId": "0e6d1509-1e2e-492d-9e86-31b12c1e39eb"
}
```

- api/v1/songs (GET)

##### Pagination and Filtering routes of songs

- api/v1/songs?pag=1&limit=10
- api/v1/songs?sortBy=createdAt&sortOrder=asc
- api/v1/songs?searchTerm=Cha

- api/v1/songs/:id (PATCH)
  Request body:

```json
{
  "title": "song name"
}
```

- api/v1/songs/:id (GET)

- api/v1/songs/:id (DELETE)

## User Routes

### Library

- api/v1/libraries (POST)

Request body:

```json
{
    "albumId": "812b506a-12dc-4293-b00f-73197ed5621e"
    // "songId": "9c0bafb3-20b5-4c71-b142-c42a9dba91fa"
}
one of these property
```

- api/v1/libraries (GET)

##### Pagination and Filtering routes of libraries

- api/v1/libraries?pag=1&limit=10
- api/v1/libraries?sortBy=createdAt&sortOrder=asc
- api/v1/libraries?searchTerm=Cha // searchTerm will apply album title or song title

- api/v1/libraries/:id (PATCH)
  Request body:

```json
{
  "title": "song name"
}
```

- api/v1/libraries/:id (GET)

- api/v1/libraries/:id (DELETE)

- api/v1/libraries/user/:userId (GET) -only for super admin to view user specific library

### Note:

You need to hit all the routes with an authorization token

Request header:

```json
{
  "authorization": "accessToken"
}
```
