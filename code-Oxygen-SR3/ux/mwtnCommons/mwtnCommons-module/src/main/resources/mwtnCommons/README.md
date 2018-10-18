# MTWN Comments

This component offers services for MTWN specific ODL DLUX application development.
It should ensure, that common functionality of ODL DLUX applications is implemented and tested only once, but reused by several applications.

All MWTN ODL DLUX application should have a dependency to 'mtwnCommons'.
However, it is a case by case decision by developers, whether such dependency is needed for their application of not.

Common functions are:
* A centralized service ($mwtnLog), which stores application logs in a centralized database. It should simplify failure analysis and debugging.
* Communication with the RestConf API of OpenDaylight.
* WebSocket subscription for notification handling
* Implementation of common object classes as defined by the Microwave Information model (e.g. NetConfServer, NetworkElement, LogicalTerminationPoint, LayerProtocol, MW_AirInterface_Pac, MW_PureEthernetStructure_Pac, MW_EthernetContainer_Pac)
* Enhanced [angular.js](https://angularjs.org/) features for web development, which are not native in [ODL DLUX](https://wiki.opendaylight.org/view/OpenDaylight_dlux:Main).

## Installation

Additional [angular.js](https://angularjs.org/) feature and implementations are listed in the file [bower.json](./bower.json).

```
bower install
```
Please see [bower.io](https://bower.io/) for further information about bower.

## angular-chart.js

* Open app/mwtnCommons/bower_components/angular-chart.js/dist/angular-chart
* Locate 
   else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['angular', 'chart'], factory);
  }

  * change  define(['angular', 'chart'], factory); to  define(['angular', 'app/mwtnCommons/bower_components/chart.js/dist/Chart'], factory);
