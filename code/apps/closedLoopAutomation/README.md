# Closed loop automation

The application loops the mounted devices in the topology. 
If the device is connected and has specified capability then application change its name.
This action is triggered:
 
- Manually by a button on a GUI
- By a timer event

The timer is de facto closed loop. It can loop every:
  
  - 5 seconds
  - 30 seconds
  - 1 minute
  - 2 minutes
  - 30 minutes
  - 1 hour

Furthermore, the application listens to check whether any device changes its connection status. And if this situation happens then the application logs this information

The application consists of a GUI interface in DLUX and backend code.
 

# Installation
### Step #1 follow the instructions in
```
https://github.com/OpenNetworkingFoundation/CENTENNIAL/tree/master/code
```
### Step #2 copy config file
Copy config file closedLoopAutomation-config.xml to Karaf

```
cp CENTENNIAL/code/apps/closedLoopAutomation/controller-config/src/main/resources/initial/closedLoopAutomation-config.xml distribution-karaf-0.4.2-Beryllium-SR2/etc/opendaylight/karaf/
```

### Step #3 add repository
```
feature:repo-add mvn:com.highstreet.technologies.odl.app/closedLoopAutomation-features/0.3.0-SNAPSHOT/xml/features
```

### Step #4 install app
```
feature:install odl-closedLoopAutomation
```

