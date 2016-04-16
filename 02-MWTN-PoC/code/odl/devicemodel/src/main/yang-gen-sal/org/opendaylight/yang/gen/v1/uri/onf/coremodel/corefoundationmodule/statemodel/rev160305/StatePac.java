package org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.statemodel.rev160305;
import org.opendaylight.yangtools.yang.binding.DataObject;
import org.opendaylight.yangtools.yang.common.QName;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;CoreModel-CoreFoundationModule-StateModel&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/CoreModel-CoreFoundationModule-StateModel.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * grouping State_Pac {
 *     leaf operationalState {
 *         type OperationalState;
 *     }
 *     leaf administrativeControl {
 *         type AdministrativeControl;
 *     }
 *     leaf adminsatratveState {
 *         type AdministrativeState;
 *     }
 *     leaf lifecycleState {
 *         type LifecycleState;
 *     }
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;CoreModel-CoreFoundationModule-StateModel/State_Pac&lt;/i&gt;
 *
 */
public interface StatePac
    extends
    DataObject
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("uri:onf:CoreModel-CoreFoundationModule-StateModel","2016-03-05","State_Pac"));

    /**
     * The operational state is used to indicate whether or not the resource is 
     * installed and working
     *
     */
    OperationalState getOperationalState();
    
    /**
     * The administrativeControl state provides control of the availability of specific
     * resources without modification to the provisioning of those resources.The value 
     * is the current control target. The actual administrativeState may or may not be 
     * at target.
     *
     */
    AdministrativeControl getAdministrativeControl();
    
    /**
     * Shows whether or not the client has permission to use or has a prohibition 
     * against using the resource.The administrative state expresses usage permissions 
     * for specific resources without modification to the provisioning of those 
     * resources.
     *
     */
    AdministrativeState getAdminsatratveState();
    
    /**
     * Used to track the planned deployment, allocation to clients and withdrawal of 
     * resources.
     *
     */
    LifecycleState getLifecycleState();

}

