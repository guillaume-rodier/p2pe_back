# P2PE_Back
# Back-end of P2PE

## Git branches convention
```
<type>/<name>
```
### Succinct description
#### `<type>`
Allowed values:
* bug       - Code changes linked to a known issue.
* feat      - New feature.
* hotfix    - Quick fixes to the codebase.

#### `<name>`
Always use dashes to seperate words, and keep it short.
## Git commit convention
```
[<type>|<module>@<feature>] <subject>
```

### Succinct description

#### `<type>`
Allowed values:
* N (new)
* I (improve)
* F (fix)

#### `<module>`
Module name affected by the change.

#### `<feature>`
Feature branch affected by the change.

#### `<subject>`
* Contains succinct description of the change.
* Can be followed by a message body explaining more precisely the change.
* Only Written in English.

Use the following command to launch the postgres database, docker is the password:
**docker run --rm   --name pg-docker -e POSTGRES_PASSWORD=docker -d -p 5432:5432 -v $HOME/docker/volumes/postgres:/var/lib/postgresql/data  postgres**

There is an example of the `db.js` file in order to communicate with it. (you can use any possible way to access it, psql -h localhost -U postgres -d postgres for example)


For now we have a docker volume in which the data is stored, it is located at **$HOME/docker/volumes/postgres** (watch out, you might need to create it)

Once the database is up and running, let's launch the node API !

Let's start by download the dependencies, in order to do so:

```
npm install    

```

And then you need to start the server with:

```
node index.js (You can also use nodemon in order to use the hot reload)
```
### `docker-compose:`
 
Run docker-compose up in the P2PE_Back folder.

pour lancer le docker compose: 
 - verifier que   host: 'postgres' dans le fichier db.js
 - veillez a supprimer le dossier node_module avant de lancer le docker
 - docker compose up  

Check the host value in config.js and set it to 'postgres', if necessary.

Incoming:
    -   Docker-compose for the entire stack: done 
    -   Code base guidelines
    -   Database sample data + integration guide.
