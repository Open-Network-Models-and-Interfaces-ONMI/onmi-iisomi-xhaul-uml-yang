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
For the 3. PoC Elasticsearch should simulate such database. ES was chosen, because it is open source and provides a sophisticated and well document REST interface. Please see [ES documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs.html). For production environments it provides clustering

In the 3. PoC the database should run in the same Apache Karaf OSGi Container as ODL. This simplifies the IP-Address discovery for applications.
* ODL internal application can use [localhost:9200](http://localhost:9200) to address the database
* External application on top of ODL can use the SDN-Controller IP address with port 9200.

## Installation

### Step 1: Add database to ODL Karaf
As a first step it is necessary to add an Elasticsearch OSGi bundle to the ODL Karaf.
ElasticSearch dose not provide such OSGi bundle, but we can use the bundle of the open source project [Apache Karaf Decanter](https://karaf.apache.org/manual/decanter/latest-1/).
```
opendaylight-user@root>feature:repo-add mvn:org.apache.karaf.decanter/apache-karaf-decanter/1.1.0/xml/features
```

### Step 2: Allow remote access to database
Elasticsearch binds to localhost only by default. In order to allow remote access to the database the configuration file must be modified. The configuration file is located in the $ODL_KARAF_HOME/etc folder: $ODL_KARAF_HOME/etc/elasticsearch.yml.

In case you do not find the configuration file in your karaf home directory, please continue with the next step 3 and modify the file later.

Please add the following line to the configuration file:
```
network.host: _site_
```

For further information about the configuration of elastic search please see [ES network settings](https://www.elastic.co/guide/en/elasticsearch/reference/2.0/modules-network.html).

### Step 3: Start the database
The database is started by a feature:install command:
```
opendaylight-user@root>feature:install elasticsearch
```
