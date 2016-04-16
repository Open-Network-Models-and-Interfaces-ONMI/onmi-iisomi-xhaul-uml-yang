package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.typedefinitions.rev160323;
import org.opendaylight.yangtools.yang.binding.DataObject;
import org.opendaylight.yangtools.yang.common.QName;
import java.math.BigInteger;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.UniversalId;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;MicrowaveModel-TypeDefinitions&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/MicrowaveModel-TypeDefinitions.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * grouping containerType {
 *     leaf uuid {
 *         type UniversalId;
 *     }
 *     leaf containerName {
 *         type string;
 *     }
 *     leaf numberOfTimeSlotsRequired {
 *         type uint64;
 *     }
 *     leaf bundlingIsAvail {
 *         type boolean;
 *     }
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;MicrowaveModel-TypeDefinitions/containerType&lt;/i&gt;
 *
 */
public interface ContainerType
    extends
    DataObject
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("uri:onf:MicrowaveModel-TypeDefinitions","2016-03-23","containerType"));

    UniversalId getUuid();
    
    /**
     * Names to be chosen from the following list: 
     * 'ethernet','e1','t1','j1','e3','ds3','stm1','cpri1','cpri2','cpri3','cpri4','cpri5','cpri6'
     * or 'cpri7'
     *
     */
    java.lang.String getContainerName();
    
    /**
     * Number of time slots required to transport this type of container.
     *
     */
    BigInteger getNumberOfTimeSlotsRequired();
    
    /**
     * If it is possible to combine transport resources of several radio links to 
     * transport this container type, this attribute shall be set to '1'.
     *
     */
    java.lang.Boolean isBundlingIsAvail();

}

