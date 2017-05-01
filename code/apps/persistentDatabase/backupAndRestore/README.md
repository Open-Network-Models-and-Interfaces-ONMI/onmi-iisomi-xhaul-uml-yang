# Backup and restore

This document discribes the usage of "backup and restore" of an Elasticsearch 
database with different indexes.

A node.js script is used for the required functionality. Please make sure that
node.js is installed. 

## Configuration

Open the config.json in an editor and modify the setting according to your 
needs. However, it is recommended to run the script on the same machine as 
Elasticsearch.

## Backup

Run the backup.js script. The script will create a new folder. The folder name
is the current time stamp (e.g. "2017-01-08T16:53:23.544Z"). The script will 
inquire all the data from the Elasticsearch instance and store the data as 
json files. Each document type will be a separate json file.

```
node backup.js
```

## Restore

To restore the backuped data, an existing backup folder (see section Backup 
above) must be selected. Rename your seleted folder to "restore".

The restore.js script will create all the data stored in the "restore" folder.

```
node retore.js
```
