# OpenDaylight DLUX 

OpenDaylight DLUX is a Javascript-based stateless user interface that communicates with the service backend to provide a consistent and user-friendly interface to interact with OpenDaylight projects and base controller.


## Build DLUX code with Karaf feature and distribution

All necessary modules mentioned above such as nodesjs, bower etc. will be installed automatically, when you run the dlux build for first time.  Run following command at dlux home directory /dlux to build dlux feature and distribution along with code.
Once successful, It will make dlux feature available to install and also create dlux karaf distribution. You can find karaf distribution at dlux/distribution-dlux.

    $  mvn clean install

__NOTE__: Some people reported about node related error while maven build. Those errors are usually environment related, mostly happens because of the permission issues or node is not installed properly. Try to reinstall node manually.

### Install NodeJS manually if needed

__For Windows and Mac without brew:__

    Go to http://www.nodejs.org
    Download and install NodeJS

__For Mac with brew installed:__

    $ brew update
    $ brew install node

__Verify NodeJS is installed:__

    $ npm --version

__Run DLUX in karaf distribution__

Once you have dlux distribution or you have karaf distribution from integration repository. You can turn on the dlux feature to access the UI.
We will take example of dlux distribution here. Navigate to directory dlux/distribution-dlux/target/assembly/bin and start the karaf via following command -

    ./karaf

On the karaf shell, install dlux core feature via running following command -

    feature:install odl-dlux-core


It will internally install odl-restconf and dlux topology application along with core dlux components. once this feature is successfully installed.
Access the dlux UI at __http://localhost:8181/index.html__. Default credentials are admin/admin for login.

All the applications in dlux are now karaf features. You can install other dlux applications such as nodes, yang-ui from karaf console using commands such as

    feature:install odl-dlux-node
    feature:install odl-dlux-yangui

For more details - follow the wiki at  [dlux opendaylight](https://wiki.opendaylight.org/view/OpenDaylight_dlux:Getting_started)
