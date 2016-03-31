Opendaylight: Steps to compile 
==============================

Pre-requisites : 
* maven 3.3.3
* git 2.1.4
* JDK 1.8.0

Compilation Steps :
-------------------

* Clone the repository from [here](https://github.com/OpenNetworkingFoundation/CENTENNIAL.git)
~~~~~~~
git clone https://github.com/OpenNetworkingFoundation/CENTENNIAL.git
~~~~~~~

* Setup Opendaylight profiles in the mvn settings as explained in the link [here](https://wiki.opendaylight.org/view/GettingStarted:Development_Environment_Setup)

* Go to folder CENTENNIAL/02-MWTN-PoC/code/odl

* Compile the source code 
~~~~~
mvn clean install -DskipTests=true
~~~~~

(Note 1: mvn will download all the required dependency jar files from Opendaylight nexus repository. So internet connectivity is mandatory)
(Note 2: If you are behind proxy, mvn settings - ~/.m2/settings.xml - should be updated with proxy details ) 

* Opendaylight distribution will be created in karaf folder 


Running Opendaylight: 
---------------------

* Go to folder karaf/target/assembly/bin

* Start Karaf 
~~~~~~
./karaf clean 
~~~~~~
* All the required features will be installed automatically 

* Wait for karaf to install features (about 30 seconds) . Monitor the log by typing log:tail and verify odl-mwt-models is installed 
~~~~
2016-03-25 18:11:07,426 | INFO  | oupCloseable-6-1 | NetconfDevice                    | 229 - org.opendaylight.controller.sal-netconf-connector - 1.2.4.Lithium-SR4 | RemoteDevice{controller-config}: Netconf connector initialized successfully
~~~~

By this time all the 22-MWTG models will be copied to cache/schema directory 

* To check if MWTG related features are installed type following command in karaf cli
~~~~~~
feature:list -i | grep 'odl-mwt'
~~~~~~

Integration with OpenYuma Mediator
----------------------------------
* Clone OpenYuma repository from [here](https://github.com/OpenClovis/OpenYuma.git)
~~~~~~
git clone https://github.com/OpenClovis/OpenYuma.git
~~~~~~
* Modify the yang models 
This step is necessary as there is yang model revision compatibility between Opendaylight and OpenYuma. While majority of these are resolved, there are still more to be rectified. Comment out yang revision 2013-07-15 from ietf-yang-types.yang in OpenYuma/netconf/modules/ietf folder as follows (ensure that you retain the revision declaration 2010-09-24 just below ) 
~~~~~
/* MWT : Commented to make compatible with ODL
   revision 2013-07-15 {
     description
      "This revision adds the following new data types:
     reference
      "RFC 6991: Common YANG Data Types";
 }
*/
revision 2010-09-24 {
.......
~~~~~
Similarly change the revisions in ietf-inet-types.yang available in 
~~~~~
/* MWT : Commented to make compatible with ODL
   revision 2013-07-15 {
     description
      "This revision adds the following new data types:
     reference
      "RFC 6991: Common YANG Data Types";
   }
*/
   revision 2010-09-24 {
~~~~~

* Instrument  OpenYuma code for discovery initiation 
A reference implementation using curl library is already shared in the mailing list. In case any clarification is required, pls revert back. High level steps are as follows 
..1. Create configuration file with following contents (for e.g /etc/yuma/mediator-config.xml)
~~~~~~~~
<mediator-config>
    <!--ODL controller details  -->
    <controller>
        <ip>x.x.x.x</ip>
        <port>xxxx</port>
        <username>admin</username>
        <password>admin</password>
    </controller>

    <!--Netconf server details  -->
    <netconf-server>
        <name>NEC80</name>
        <ip>y.y.y.y</ip>
        <port>yyyy</port>
        <username>nec</username>
        <password>nec123</password>
    </netconf-server>
</mediator-config>
~~~~~~~~
..2. Create a folder mwt under $OPENYUMA_HOME/netconf/src/
..3. Create a file C file (say odl-conn.c)
..4. Include headers for utilities  (Note that this will require libcurl library to compile
~~~~~~
#include <curl/curl.h>
#include <libxml/parser.h>
#include <libxml/tree.h>
~~~~~~
..5. Create Payload for REST call 
~~~~~~
static char *create_payload(void){
    xmlDocPtr doc = NULL;
    xmlNodePtr root_node = NULL;
    xmlChar *xmlbuff;
    int buffersize;

    doc = xmlNewDoc((const xmlChar *) "1.0");
    root_node = xmlNewNode(NULL, (const xmlChar *) "input");
    xmlNewNs (root_node, (const xmlChar *) "urn:opendaylight:params:xml:ns:yang:nediscovery:api", NULL);
    xmlNewChild(root_node, NULL, (const xmlChar *) "name", (const xmlChar *) ns->name);
    xmlNewChild(root_node, NULL, (const xmlChar *) "ip", (const xmlChar *) ns->ip);
    xmlNewChild(root_node, NULL, (const xmlChar *) "port", (const xmlChar *) ns->port);
    xmlNewChild(root_node, NULL, (const xmlChar *) "username", (const xmlChar *) ns->username);
    xmlNewChild(root_node, NULL, (const xmlChar *) "password", (const xmlChar *) ns->password);
    xmlDocSetRootElement(doc, root_node);

    xmlDocDumpFormatMemory(doc, &xmlbuff, &buffersize, 1);
    char *out = strdup((char*)xmlbuff);
    xmlFree(xmlbuff);
    xmlFreeDoc(doc);
    return out;
}
~~~~~~
..6. Setup HTTP headers 
~~~~~~
        struct curl_slist *headers = NULL;
        headers = curl_slist_append(headers, "Accept: application/xml");
        headers = curl_slist_append(headers, "Content-Type: application/xml");
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
        curl_easy_setopt(curl, CURLOPT_USERAGENT,  "Linux C  libcurl");
        curl_easy_setopt(curl, CURLOPT_TIMEOUT, 10);
~~~~~~
..7. Set URL + Basic Authentication and Send Request 
~~~~~~
char *rest_call = NULL;
        if(type == 0)
            asprintf(&rest_call, "http://%s:%s/restconf/operations/nediscovery-api:connect", cl->ip, cl->port);
        else if(type == 1)
            asprintf(&rest_call, "http://%s:%s/restconf/operations/nediscovery-api:disconnect", cl->ip, cl->port);
        curl_easy_setopt(curl, CURLOPT_URL, rest_call);

        char *userPass;
        asprintf(&userPass, "%s:%s", cl->username, cl->password);
        curl_easy_setopt(curl, CURLOPT_USERPWD, userPass);
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, payload);

        res = curl_easy_perform(curl);
        long http_code = 0;
        curl_easy_getinfo (curl, CURLINFO_RESPONSE_CODE, &http_code);
~~~~~~
..8. Include mwt folder in the yuma/netconf Makefile (netconf/src/Makefile) (line num 151) 
~~~~~~
	-o $@ $(OBJS) -L/usr/local/lib -L$(PREFIX)/lib $(LC) -L../../target/lib -lmwt  -lxml2
~~~~~~
..9. Modify netconf/src/agt/Makefile to include libmwt (line num 154) 
~~~~~~
	-o $@ $(OBJS) -L/usr/local/lib -L$(PREFIX)/lib $(LC) -L../../target/lib -lmwt  -lxml2
~~~~~~
..10. Instrument netconf/src/agt/agt_ncxserver.c (at line num 342) to invoke the odl connection code implemented above
~~~~~~
    /* MWT CODE START*/
    const char *file = MEDIATOR_CONFIG_XML;
    const char *error = mwt_connect(file);
    if(error){
        log_info("\nConnect request to ODL failed (%s)----------", error);
    }else{
        log_info("\nConnect request to ODL successful------------");
    }
    /* MWT CODE END*/
~~~~~~

* Compile the source code 
~~~~~~~~
sudo make clean 
sudo make 
sudo make install 
~~~~~~~~
* Start Openyuma netconfd 

