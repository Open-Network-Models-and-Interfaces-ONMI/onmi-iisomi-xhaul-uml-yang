# Fill database

## Prerequisite

> node.js
> running elasticsearch

## Installation

```
npm install elasticsearch
```

## Usage


The following command will write the data from folder "./data" into the elasticsearch database.
```
node src/write.js
```

The following command clears the data in the elasticsearch database, by deleting the index.
```
node src/clear.js
```

The following command reads the data from the elasticsearch database and prints it on the screen.
```
node src/read.js
```
