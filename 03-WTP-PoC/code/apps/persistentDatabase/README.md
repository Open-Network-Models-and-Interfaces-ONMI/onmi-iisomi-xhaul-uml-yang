# Persistent database

Usually the SDN Controller itself has a in-memory-database which acts as a cache, because the data is stored in the network itself, in each network element.

However, some applications may require a persistent database. Such database stores all the information, which are not available in network elements, but might be necessary to control the network.

The following lists shows some examples of such data:
* planning data
 * planning status of nodes, links and paths
 * required configurations
 * site information (e.g. name, geographical location, postal address, owner, ...)
* logs
* statistics

## Elasticsearch
For the 3. PoC ElasticSearch (ES) is selected to be this database. ES was chosen, because it is open source and provides a sophisticated and well document REST interface. Please see [ES documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs.html). For production environments it provides clustering

In the 3. PoC the database should run in the same Apache Karaf OSGi Container as ODL. This simplifies the IP-Address discovery for applications.
* ODL internal application can use [localhost:9200](http://localhost:9200) to address the database
* External application on top of ODL can use the SDN-Controller IP address with port 9200.

## Installation of ES

### Step 1: Add repository to ODL Karaf
As a first step it is necessary to add an Elasticsearch OSGi bundle to the ODL Karaf.
ElasticSearch dose not provide such OSGi bundle, but we can use the bundle of the open source project [Apache Karaf Decanter](https://karaf.apache.org/manual/decanter/latest-1/).
Karaf is running. Enter into the Karaf command line the following command:
```
opendaylight-user@root>feature:repo-add mvn:org.apache.karaf.decanter/apache-karaf-decanter/1.1.0/xml/features
```

### Step 2: Start the database
The database is installed and started by a feature:install command:
```
opendaylight-user@root>feature:install elasticsearch
```

### Step 3: Configure database for remote access

Modification of the configuration file is $ODL_KARAF_HOME/etc/elasticsearch.yml .
The configuration file is available after ```feature:install elasticsearch``` in the Karaf command line (see Step 2). 

HINT1: In case you do not find the configuration file in your karaf home directory, please continue with step 2.  
HINT2: For activation of new ES YAML configurations do shutdown and restart Karaf. (shutdown + <yes>, ./bin/karaf).

#### Step 3.1: Remote access and database location

ElasticSearch binds to localhost by default. In order to allow remote access to the database the configuration file must be modified.
In the ElasticSearch default configuration there is only access over the localhost.

Please add the following line to the configuration file to have local (localhost) and remote access (IP, DNS-name):
```
network.host: 0.0.0.0
```

Please add the following line to shift the database to /etc:
```
path.data: etc
```

HINT: For activation of new configuration do shutdown and restart Karaf.  
For further information about the configuration of elastic search please see [ES modules-network settings](https://www.elastic.co/guide/en/elasticsearch/reference/2.0/modules-network.html).

#### Step 3.2: Add head plugin to access database content (ES Version 1.x 2.x)

Add the following line to the ES configuration file $ODL_KARAF_HOME/etc/elasticsearch.yml to configure ES to the right plugin path.
```
path.plugins: etc/elasticsearch-plugins
```
For activation of new yaml configuration do shutdown and restart Karaf.

Clone the plugin git-repository of head plugin and copy full content into folder within karaf for plugins.
```
cd ~
git clone https://github.com/mobz/elasticsearch-head
mkdir $ODL_KARAF_HOME/etc/elasticsearch-plugins/
cp -r elasticsearch-head/ $ODL_KARAF_HOME/etc/elasticsearch-plugins/
mv $ODL_KARAF_HOME/etc/elasticsearch-plugins/elasticsearch-head $ODL_KARAF_HOME/etc/elasticsearch-plugins/head
```

### Step 4: Fill the database
Karaf has to be started and the ElasticSearch is installed, activated and well configured.

Open a Terminal window and change to the *CENTENNIAL/03-WTP-PoC/code/apps/persistentDatabase/* directory. 

The right IP address has to be filled into the 'host' attribute in the *config.json* file.
It must be the IP address of the system, where OpenDaylight is running. 
(On ODL Server with configuration above "localhost" would be OK).
```
node initDatabase.js
```

Verification: At ODL Server open Browser and use this URL: "http://localhost:9200/_plugin/head/".  
From a remote server use IP or DNS name instead. The "head"-plugin reports some cluster and content information.
