# Persistent database

Usually the SDN Controller itself has a in-memory-database which acts as a cache, because the data is stored in the network itself, in each network element.

However, some applications may require a persistent database. Such database stores all the information, which are not available in network elements, but might be necessary to control the network.

The following lists shows some examples of such data:
* planning data
 * planning status of nodes, links and paths
 * required configurations
 * site information (e.g. name, geographical location, postal address, owner, ...)
* logs and events
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

Please add the following line to have the plugins in /etc
```
path.plugins: etc/elasticsearch-plugins
```

HINT: For activation of new configuration do shutdown and restart Karaf.  
For further information about the configuration of elastic search please see [ES modules-network settings](https://www.elastic.co/guide/en/elasticsearch/reference/2.0/modules-network.html).

#### Step 3.2: Add head and delete-by-query plugin to access database content (ES Version 1.x 2.x)

Plugins are in the *plugins* directory of persistentDatabase. Unzip into the elasticsearch plugins directory.
```
mkdir $ODL_KARAF_HOME/etc/elasticsearch-plugins/
unzip ~/SDN-Projects/code/apps/persistentDatabase/plugins/head.zip -d $ODL_KARAF_HOME/etc/elasticsearch-plugins
unzip ~/SDN-Projects/code/apps/persistentDatabase/plugins/delete-by-query.zip -d $ODL_KARAF_HOME/etc/elasticsearch-plugins
```

HINT: Restart database to activate plugins.

### Step 4: database configuration

#### Step 4.1: index config, mwtn

Precondition: Karaf has to be started and the ElasticSearch is installed, activated and well configured.

Open a Terminal window and change to the *SDN-Project/code/apps/persistentDatabase/* directory. 

The right IP address has to be filled into the 'host' attribute in the *config.json* file.
It must be the IP address of the system, where OpenDaylight is running. 
(On ODL Server with configuration above "localhost" would be OK).
```
./installAll.sh
```

Verification: At ODL Server open Browser and use this URL: "http://localhost:9200/_plugin/head/".  
From a remote server use IP or DNS name instead. The "head"-plugin reports some cluster and content information.

#### Step 4.2: index sdnevents
        

Prereq:
  1. elasticdump: 	https://www.npmjs.com/package/elasticdump
     
     Short version to install if npm available:
  
         npm install elasticdump -g
        
  2. jq: https://stedolan.github.io/jq/manual/
  3. curl: (ubuntu repo)
  4. unzip: (ubuntu repo)
  

#### Step 4.2.1: Create V1 Mapping and alias for a new index

Prereq: 
  1. Elasticsearch is running
  2. index sdnevents is not existing and no alias with this name exists.

Initialize the index *sdnevents_v1* with correct mapping and set the alias to *sdnevents*.
Open a Terminal window and change to the *SDN-Project/code/apps/persistentDatabase/sdnecents/* directory.
Make sure that elasticsearch is running and the index is not existing for the first time of execution. 
Execute the script manageSdnevents.sh:
```
./manageSdnevents.sh
```
Check with head plugin if index has been created.
Here are the most important command for a manual approach:

```
curl -H "Content-Type: application/json" --data @sdneventsMapping.json http://localhost:9200/sdnevents_v1
curl -H "Content-Type: application/json" --data @sdneventsV1Alias.json http://localhost:9200/sdnevents_v1
```

#### Step 4.2.2: Migrate Mapping from Vn -> Vn+1

Prereq: 
  1. Elasticsearch is running
  2. index sdnevents_vN with alias sdnevents exists. 
    
This step is only indicated for specific maintenance reasons:  

  * if there are changes in the mapping
  * any other need to create a new index version.
  
Execute the script manageSdnevents.sh to create a new sdnevents_v(N+1) an copy all date to this new index and change the alias.

```
cd indexSdnevents
./manageSdnevents.sh
```

### Step 5: database maintenance/ reconfiguration

#### Step 5.1: Delete and renew index mwtn

ATTENTION: Custom configurations during runtime are deleted by this action. 

Prereq: 
  1. Elasticsearch is running
  2. head plugin installed 

Step 1 Delete index:
  * Open head plugin: 
  * In the Overview Tab select Actions->Delete... at index *mwtn*
  * Confirm according to the description
  
Step 2 Re-create:
  * Configuration info in *activeConfig* directory is used. 
  * execute initial mwtn script
  ```
  cd indexMwtn
  node initDatabase.js
  ```
Step 3 Verify
  * Use head plugin to verify if the index has been created.
  



