package org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305;
import org.opendaylight.yangtools.yang.binding.DataRoot;
import java.util.List;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;CoreModel-CoreNetworkModule-TypeDefinitions&lt;/b&gt;
 * &lt;br&gt;Source path: &lt;i&gt;META-INF/yang/CoreModel-CoreNetworkModule-TypeDefinitions.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * module CoreModel-CoreNetworkModule-TypeDefinitions {
 *     yang-version 1;
 *     namespace "uri:onf:CoreModel-CoreNetworkModule-TypeDefinitions";
 *     prefix "CoreModel-CoreNetworkModule-TypeDefinitions";
 *
 *     revision 2016-03-05 {
 *         description "";
 *     }
 *
 *     list Q_822_numSuppressedIntervalsPkg {
 *         key "numSuppressedIntervals"
 *         leaf numSuppressedIntervals {
 *             type uint64;
 *         }
 *     }
 *     list Q_822_historyDataMeasurementListPkg {
 *         key "cTPId"
 *         leaf cTPId {
 *             type string;
 *         }
 *     }
 *     list Q_822_historyDataSuspectIntervalFlagPkg {
 *         key "cTPId"
 *         leaf cTPId {
 *             type string;
 *         }
 *     }
 *     list Q_822_observedManagedObjectPkg {
 *         key "observedObjectClass"
 *         leaf observedObjectClass {
 *             type string;
 *         }
 *         leaf observedObjectInstance {
 *             type string;
 *         }
 *     }
 *     list Q_822_objectDeleteNotificationPkg {
 *         key "cTPId"
 *         leaf cTPId {
 *             type string;
 *         }
 *     }
 * }
 * &lt;/pre&gt;
 *
 */
public interface CoreModelCoreNetworkModuleTypeDefinitionsData
    extends
    DataRoot
{




    List<Q822NumSuppressedIntervalsPkg> getQ822NumSuppressedIntervalsPkg();
    
    List<Q822HistoryDataMeasurementListPkg> getQ822HistoryDataMeasurementListPkg();
    
    List<Q822HistoryDataSuspectIntervalFlagPkg> getQ822HistoryDataSuspectIntervalFlagPkg();
    
    List<Q822ObservedManagedObjectPkg> getQ822ObservedManagedObjectPkg();
    
    List<Q822ObjectDeleteNotificationPkg> getQ822ObjectDeleteNotificationPkg();

}

