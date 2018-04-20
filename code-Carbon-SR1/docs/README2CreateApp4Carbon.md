# Create app for ODL Boron and some backgrounds

## Common information and workshop tasks

### Overall

  - Demo ODL, GUI and Simulators
  - [Opendaylight](http://5g-crosshaul.eu/wp-content/uploads/2016/10/UC3M_5tonic_SdnOdlDay_19Oct2016.pdf)
    - Three slides: 6:MDSAL, 8:AppDev, 11:Karaf
  - Demo Eclipse
  - User's home and the tools to use
  - Git/ Maven &co mvn command, .m2
  - HANDS-ON: Setup Single server development environment
    - Follow [DevEnv](READMEInstallDevelopmentEnvironment.md)

### Karaf

   - OSGi and what does Karaf do
     - [osgi](https://en.wikipedia.org/wiki/OSGi)
     - [karaf](https://stackoverflow.com/questions/17350281/what-exactly-is-apache-karaf)
   - How does it come and the directory structure
     - Opendaylight karaf [odlkaraf](https://nexus.opendaylight.org/content/groups/public/org/opendaylight/integration/distribution-karaf/)
     - show setup
         - Repository
         - data log
   - Bundles and Features
     - related xml files
   - clean start
   - Start&stop
     - commands start/stop/client
     - command karaf
   - command line
     - start and list features and bundles
   - Debug and log files
     - see read me
   - Problems
     - Startup timing

### Network applications

   - commons bundle and parents
     - See CENTENNIAL/code/features (features-parent)
     - binding-parent => Access of MDSAL
     - config-parent => Push config xml file
   - Karaf / Yang and the device model
   - DLUX, Angular JS, Chromium
   - Clone myapp
   - ODL Datamodel, Access the database and the Netconf model
   - [Documentation Boron](http://docs.opendaylight.org/en/stable-boron/)
   - [ArchetypeRPCHelloWorld](https://wiki.opendaylight.org/view/OpenDaylight_Controller:MD-SAL:Startup_Project_Archetype)


## 1. Create app for ODL Boron

### 1.1. Prerequirements

- Development environment for ODL Boron according to Description "InstallDevelopmentEnvironment".
- Clone from git the projects CENTENNIAL and WirelessTranportEmulator to get the following structure
    ```
    odl
    ├── CENTENNIAL
    ├── WirelessTransportEmulator
    └── distribution-karaf-0.6.1-Carbon
    ```

### 1.2. Create the app

Approach is to copy the template application in the CENTENNIAL repository apps directory and adapt it to the needs.<br/>
  - Northbound: Provide RPC northbound
  - Southbound: Monitors mountpoints connected to netconf devices.

The template app is located here:

    CENTENNIAL/code/apps/template/
    ├── api
    │   ├── pom.xml
    │   └── src
    ├── impl
    │   ├── pom.xml
    │   └── src
    ├── features
    │   ├── pom.xml
    │   └── src
    └── pom.xml

Use the commandline and copy template to a new directory and modify with vi

    cd ~/odl/CENTENNIAL/code/apps
    cp -r template myapp

### 1.3. Adapt myapp

Remove files which are recreated later

    cd myapp
    rm -r target api/target impl/target
    rm -r .settings/ api/.settings/ impl/.settings/
    rm -r .project api/.project impl/.project

Change with eclipse editor (or vi) within the directory tree the four pom.xml files from<br/>
template_something to myapp_something

  Example:

      <artifactId>myapp</artifactId>
      <name>myapp</name>

Adapt in the impl/pom.xml and the features/pom.xml the dependency to the myapps-api project.

Import into eclipse under the apps working set, that you see the new projects:
  - myapp
  - myapp-api
  - myapp-impl
  - myapp-features

Using eclipse do rename

  - filename or partial filenames from "template" to "myapp"
    - .yang file in myapp-api
    - .yang file in myapp-impl
  - bundle name in myapp-impl/src/main/java to org.opendaylight.mwtn.myapp

Modify module name, namespace, prefix revision date of myapp-api yang file:

    module myapp {
        yang-version 1;
        namespace "urn:opendaylight:params:xml:ns:yang:myapp";
        prefix "myapp";

        revision "2018-01-23" {
            description "Initial revision of myapp model";
        }

        rpc hello-world {
            input {
                leaf name {
                    type string;
                }
            }
            output {
                leaf greeting {
                    type string;
                }
            }
        }
    }

Similar with myapp-impl yang file. Adapt module name, namespace, prefix, revision date, java-name-prefix.

    module myapp-impl {
        yang-version 1;
        namespace "urn:opendaylight:params:xml:ns:yang:myapp:impl";
        prefix "myapp-impl";

        import config { prefix config; revision-date 2013-04-05; }
        import opendaylight-md-sal-binding { prefix md-sal-binding; revision-date 2013-10-28;}

        description
            "Service definition for myapp project";

        revision "2018-01-23" {
            description
                "Initial myapp revision";
        }

        identity myapp {
            base config:module-type;
            config:java-name-prefix MyappImpl;
        }

        augment "/config:modules/config:module/config:configuration" {
            case myapp {
                when "/config:modules/config:module/config:type = 'myapp'";
                container broker {
                    uses config:service-ref {
                        refine type {
                            mandatory true;
                            config:required-identity md-sal-binding:binding-broker-osgi-registry;
                        }
                    }
                }
            }
        }
    }

Adapt Java classes using eclipse refactor

  - TemplateAppProvider -> MyAppProvider
  - TemplateServiceImpl -> MyAppServiceImpl

HINT1: The enabled *eclipse -> project -> Build Automatically* option interferes with external Maven builds in the command line. You can see strange errors during maven build. If this is the case than disable it and try again. Basically handling is easier if option is switched on, but disable it before you use cli/maven.

HINT2: After cli/maven build is done use F5 to see all generated files files.

HINT3: If you feel that errors are all corrected, but the errors will not go away in eclipse use *eclipse -> projects -> clean* for the project.

Enable  *eclipse -> project -> Build Automatically* or use maven build command below to build the app.<br/>

    cd myapp
    mvn clean install -DskipTests -Dmaven.javadoc.skip=true

You see the new created sources with the timestamp in the package name.<br/>
Open "MyAppImplModule" and fill the implementation with addapted code similar to the code in the "TemplateImplModule.java" in the function "createInstance()". The eclipse refactor has already renamed the code snippet to the right class name.

Next steps:

  - Remove the old package.
  - Correct the imports where necessary

If all errors are corrected, do a cli maven build. If you see this you are ready with this section.

    [INFO] Reactor Summary:
    [INFO]
    [INFO] myapp-api .......................................... SUCCESS [ 10.130 s]
    [INFO] myapp-impl ......................................... SUCCESS [  4.644 s]
    [INFO] ONF :: Wireless :: myapp-features .................. SUCCESS [  8.811 s]
    [INFO] myapp .............................................. SUCCESS [  3.727 s]
    [INFO] ------------------------------------------------------------------------
    [INFO] BUILD SUCCESS
    [INFO] ------------------------------------------------------------------------

In case of errors:

  - Remove all targets
    rm -r target api/target impl/target features/target
  - Grep for all string "template" and replace
    grep -r template
  - Activate enough logging
  - (!)Remove in the karaf the xml config file: rm $ODL_KARAF_HOME/etc/opendaylight/karaf/myapp.xml. New install of the feature/bundle is required to re-create this file.


### 1.4 Test it

HINT1: At this point your .m2 repository needs to contain all jars of the applications in apps, features and ux. If not done before you need to compile everything with the following command:

    cd ~/odl/CENTENNIAL/code
    mvn clean install -DskipTests

HINT2: If karaf container is already running you get a feedback that start is not possible. Use the stop command to stop it:

    cd ~/odl/CENTENNIAL/code
    ./install.sh stop

HIN3: In new environment you should use the the ```./odl``` command insteadt of ```./install.sh```
Change to the code directory and start the karaf container using the *imd* option:

    cd ~/odl/CENTENNIAL/code
    ./install.sh imd

To **Test it** step into to the karaf cli:

    ./karafcmd.sh

Add the new feature in the karaf command line:

    feature:repo-add mvn:org.opendaylight.mwtn/myapp-features/0.4.0-SNAPSHOT/xml/features
    feature:install odl-mwt-myapp
    bundle:list

You are done with this test if you see something like this, especially the last line is important!

    herbert@vm2-herbert:~/odl/distribution-karaf-0.5.3-Boron-SR3/data/log$ grep -ia "session i" *
    2018-01-23 20:24:18,651 | INFO  | config-pusher    | TemplateProvider                 | 331 - org.opendaylight.mwtn.template-impl - 0.4.0.SNAPSHOT | TemplateProvider Session Initiated
    2018-01-23 20:24:18,760 | INFO  | config-pusher    | WebsocketmanagerProvider         | 329 - org.opendaylight.mwtn.websocketmanager-impl - 0.4.0.SNAPSHOT | WebsocketmanagerProvider Session Initiated
    2018-01-23 20:26:39,218 | INFO  | config-pusher    | MyAppProvider                    | 337 - org.opendaylight.mwtn.myapp-impl - 0.4.0.SNAPSHOT | TemplateProvider Session Initiated

Nect test is to access the RPC via restonf. This is done via ODLs APIDOC explorer.
Use this link to open the application, enter login credentials admin, admin <br/>
[odl apidoc](http://127.0.0.1:8181/apidoc/explorer/index.html)


### 1.5. Change higher-level POM files

  - code/feature.xml
  - code/pom.xml

### 1.6. Adapt install.sh script

  - code/install.sh

## 2.0 Test and debug app

### 2.1 Setup and connect netconf simulator


### 2.2 Setup ODL debug level


### Remarks

  - Karaf Intro and Install
  - Simulators
