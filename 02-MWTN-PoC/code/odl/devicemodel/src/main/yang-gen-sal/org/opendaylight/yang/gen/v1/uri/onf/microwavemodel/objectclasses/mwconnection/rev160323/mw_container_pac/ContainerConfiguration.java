package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_container_pac;
import org.opendaylight.yangtools.yang.binding.ChildOf;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWContainerPac;
import org.opendaylight.yangtools.yang.common.QName;
import org.opendaylight.yangtools.yang.binding.Augmentable;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;MicrowaveModel-ObjectClasses-MwConnection&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/MicrowaveModel-ObjectClasses-MwConnection.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * container containerConfiguration {
 *     container container {
 *         leaf uuid {
 *             type UniversalId;
 *         }
 *         leaf containerName {
 *             type string;
 *         }
 *         leaf numberOfTimeSlotsRequired {
 *             type uint64;
 *         }
 *         leaf bundlingIsAvail {
 *             type boolean;
 *         }
 *         uses containerType;
 *     }
 *     list timeSlotIDList {
 *         key "structureID" 
 *     "timeSlotID"
 *         leaf structureID {
 *             type string;
 *         }
 *         leaf timeSlotID {
 *             type string;
 *         }
 *         uses timeSlotIDType;
 *     }
 *     uses ContainerConfiguration;
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;MicrowaveModel-ObjectClasses-MwConnection/MW_Container_Pac/containerConfiguration&lt;/i&gt;
 *
 * &lt;p&gt;To create instances of this class use {@link org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_container_pac.ContainerConfigurationBuilder}.
 * @see org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_container_pac.ContainerConfigurationBuilder
 *
 */
public interface ContainerConfiguration
    extends
    ChildOf<MWContainerPac>,
    Augmentable<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_container_pac.ContainerConfiguration>,
    org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.ContainerConfiguration
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("uri:onf:MicrowaveModel-ObjectClasses-MwConnection","2016-03-23","containerConfiguration"));


}

