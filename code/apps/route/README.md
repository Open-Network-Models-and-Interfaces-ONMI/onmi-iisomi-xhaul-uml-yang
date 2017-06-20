## Basic Concept
![Basic Concept](resources_readme/Re-route.png?raw=true "Basic Concept")

- topology.json: route/impl/src/main/resources/topology.json
    - not same as the topology.json provided by Martin.
    - define the main and backup fc-path for creation and switch

- apis: using these apis to run the tests for ethernet scenario
    - create: create as any FCs as you want, and without taking care about the real path
        - vlanid
        - fc_desc
            - nodeName: network-element's name
            - aEnd: name of ltp
            - zEnd: name of another ltp
    - createFollowTopo: create FCs according to the topology.json, using vlanid as key.
    - switchFollowTopo: switch to backup fc-path(delete current fc-path:vlanid and create topology.json:vlanid:backup)
    - restoreFollowTopo: switch back to main fc-path(delete current fc-path:vlanid and create topology.json:vlanid:main)
    - delete: delete specified fc-path(include all ltps, lps and fc)

- ltp-path.yang: updated after fc-path creation or deletion

- threshold.yang: setup the threshold of MSD and Bandwidth

## Build and run
- edit the route/impl/src/main/resources/topology.json first if you need
- enter CENTENNIAL/code/apps/route and type
`mvn clean install -DskipTests`
- copy release to ODL
```
cp -R ~/.m2/repository/com/highstreet $ODL_KARAF_HOME/system/com
```
- start karaf and install odl-route
```
feature:repo-add mvn:com.highstreet.technologies.odl.app/route-features/0.4.0-SNAPSHOT/xml/features
feature:install odl-route
```

## Using "route" to test your own device via yang-ui or restconf-api

  - test creating fc
  - test deleting fc
  - test creating fc-path
    - create by 'create'
    - create by 'createFollowTopo'
  - test switching and restoring

## Scenario of PoC4

1. setup thresholds
2. execute 'createFollowTopo:vlanid'
3. reduce the AirInterfacePac/AirInterfaceStatus/modulationCur of any AirInterface on path and wait for the bandwidth reach threshold
4. switch(to backup when currently main or to main when currently backup)
