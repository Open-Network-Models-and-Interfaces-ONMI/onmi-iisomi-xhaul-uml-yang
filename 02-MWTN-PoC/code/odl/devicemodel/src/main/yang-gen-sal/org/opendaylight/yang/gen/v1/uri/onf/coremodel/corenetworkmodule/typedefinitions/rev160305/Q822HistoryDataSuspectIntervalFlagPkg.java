package org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305;
import org.opendaylight.yangtools.yang.binding.ChildOf;
import org.opendaylight.yangtools.yang.common.QName;
import org.opendaylight.yangtools.yang.binding.Augmentable;
import org.opendaylight.yangtools.yang.binding.Identifiable;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;CoreModel-CoreNetworkModule-TypeDefinitions&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/CoreModel-CoreNetworkModule-TypeDefinitions.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * list Q_822_historyDataSuspectIntervalFlagPkg {
 *     key "cTPId"
 *     leaf cTPId {
 *         type string;
 *     }
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;CoreModel-CoreNetworkModule-TypeDefinitions/Q_822_historyDataSuspectIntervalFlagPkg&lt;/i&gt;
 *
 * &lt;p&gt;To create instances of this class use {@link org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822HistoryDataSuspectIntervalFlagPkgBuilder}.
 * @see org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822HistoryDataSuspectIntervalFlagPkgBuilder
 * @see org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822HistoryDataSuspectIntervalFlagPkgKey
 *
 */
public interface Q822HistoryDataSuspectIntervalFlagPkg
    extends
    ChildOf<CoreModelCoreNetworkModuleTypeDefinitionsData>,
    Augmentable<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822HistoryDataSuspectIntervalFlagPkg>,
    Identifiable<Q822HistoryDataSuspectIntervalFlagPkgKey>
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("uri:onf:CoreModel-CoreNetworkModule-TypeDefinitions","2016-03-05","Q_822_historyDataSuspectIntervalFlagPkg"));

    java.lang.String getCTPId();
    
    /**
     * Returns Primary Key of Yang List Type
     *
     */
    Q822HistoryDataSuspectIntervalFlagPkgKey getKey();

}

