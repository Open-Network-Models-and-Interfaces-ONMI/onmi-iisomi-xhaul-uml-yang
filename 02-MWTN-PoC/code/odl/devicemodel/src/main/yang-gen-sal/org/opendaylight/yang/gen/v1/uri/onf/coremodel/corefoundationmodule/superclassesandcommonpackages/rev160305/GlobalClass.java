package org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305;
import org.opendaylight.yangtools.yang.binding.DataObject;
import org.opendaylight.yangtools.yang.common.QName;
import java.util.List;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.globalclass.LocalIdList;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.statemodel.rev160305.StatePac;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;CoreModel-CoreFoundationModule-SuperClassesAndCommonPackages&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/CoreModel-CoreFoundationModule-SuperClassesAndCommonPackages.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * grouping GlobalClass {
 *     list nameList {
 *         key "valueName"
 *         leaf valueName {
 *             type string;
 *         }
 *         leaf value {
 *             type string;
 *         }
 *         uses NameAndValue;
 *     }
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
 *     list localIdList {
 *         key "valueName"
 *         leaf valueName {
 *             type string;
 *         }
 *         leaf value {
 *             type string;
 *         }
 *         uses NameAndValue;
 *     }
 *     leaf uuid {
 *         type UniversalId;
 *     }
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;CoreModel-CoreFoundationModule-SuperClassesAndCommonPackages/GlobalClass&lt;/i&gt;
 *
 */
public interface GlobalClass
    extends
    DataObject,
    StatePac,
    Name
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("uri:onf:CoreModel-CoreFoundationModule-SuperClassesAndCommonPackages","2016-03-05","GlobalClass"));

    /**
     * An identifier that is unique in the context of some scope that is less than the 
     * global scope.(consider in the context of Identifier: A property of an 
     * entity/role with a value that is unique within an identifier space, where the 
     * identifier space is itself unique, and immutable. The identifier therefore 
     * represents the identity of the entity/role. An identifier carries no semantics 
     * with respect to the purpose of the entity.)
     *
     */
    List<LocalIdList> getLocalIdList();
    
    /**
     * UUID: An identifier that is universally unique(consider in the context of 
     * Identifier: A property of an entity/role with a value that is unique within an 
     * identifier space, where the identifier space is itself globally unique, and 
     * immutable. An identifier carries no semantics with respect to the purpose or 
     * state of the entity)
     *
     */
    UniversalId getUuid();

}

