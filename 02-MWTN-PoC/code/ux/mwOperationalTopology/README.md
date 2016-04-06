## MW Operational Topology application

### Overview:
This application displays the Microwave topology operational status in a graph view using Sigma.js.

### How it works:
#### The application devided into 2 part:

1) Topology library - issue AJAX calls to OpenDaylight/static resources to retreive operational information about the Microware network topology

2) Topolgy GUI application - uses the toplogy library to retreive the network topology and diplay it in the GUI useing Sigma.js

#### The application works in 2 modes to retrieve information about the topology:

1) Use static JSON files that represent the network elements

2) Use the OpenDaylight REST API to retrieve information about the topology

The application provides a simple configuration GUI to modify the controller IP/Port, site information and application mode.

Note: This is a client-side application only, thus the configuration is not persistent, in order to change the defaults, change the index.html configuration fields and refresh the browser.

### How to deploy:
1) Install a Nginx (other web servers can be used as well:
~~~~
sudo apt-get install nginx
~~~~
2) clone this repository

3) Copy the source files into the web server:
~~~~
cp -r <path/to/mwOperationalTopology>/* /usr/share/nginx/html/
~~~~
Limitation: mwOperationalTopology application MUST run on the same machine as the Opendaylight controller and access it via 127.0.0.1/localhost due to Access-Control-Allow-Origin policy.

### How to use:
To access the GUI simply go to http://127.0.0.1

Modify the "Site JSON" section to hold the netowrk elements by specifing the uuid of the element in the networkElementArr, the number of elements per site is limited to 4.

Choose the "Static" option to retrieve the data from the files located at <path/to/application/>/network-elements
The big grey cirecles represent a site, the inner big grey circles represent network elements and the small black circles represent an AirInterface LP.

The edges represent a matching radioSignalId between 2 AirInterface nodes, a grey color edge means the link is down and blue means up.
