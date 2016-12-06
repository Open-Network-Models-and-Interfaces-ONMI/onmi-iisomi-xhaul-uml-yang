# Spectrum

The devices gets connected (ODL connection status changed to “connected”). 
The application should check the current configured frequencies/polarization. 
With the information of the device name and the AirInterface.radioSignalIds it ask a SpectrumProviderService (maybe a simple file or database via a WebService) about the expected or planned frequencies. 
Later it can be a service returning the frequency on the fly by some calculations, maybe such service can be later also provided by a regulation agency (via a WebService). 
Then the app compares the configured frequencies with the returned Frequencies – in case of a mismatch the app configures the frequencies in the device. 
By writing it, I think also the polarization should be returned by the SpectrumProviderService. 
The Decision and the Configuration should be logged in a persistent database.

## Installation

### Step #1 follow the instruction in
```
https://github.com/OpenNetworkingFoundation/CENTENNIAL/tree/master/code
```

### Step #2 install the dependency
```
bundle:install -s mvn:net.iharder/base64/2.3.9
bundle:install -s mvn:com.github.briandilley.jsonrpc4j/jsonrpc4j/1.2.0
bundle:install -s mvn:com.sun.jersey/jersey-client/1.17
```

### Step #3 add repository
```
feature:repo-add mvn:com.highstreet.technologies.odl.app.spectrum/scheduler-features/1.0.0-SNAPSHOT/xml/features
```

### Step #4 install app
```
feature:install odl-scheduler \
odl-scheduler-api \
odl-scheduler-rest \
odl-scheduler-ui
```

### Step #5 install mos follow instruction in
```
https://github.com/olinchy/mos/tree/master/develop/source-code
```

### Step #6 create necessary data in mos-style command line
```
cd ../exl2cmd
python exl2cmd.py [excel which define all available frequencies]
```

### Step #7 follow the instruction at "https://github.com/olinchy/mos/tree/master/develop/source-code" to start mos and cli of mos

### Step #8 paste all command in exl2cmd/cmd.txt to cli of mos





