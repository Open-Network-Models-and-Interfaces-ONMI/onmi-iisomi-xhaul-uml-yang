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
