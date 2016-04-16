package org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305;
import org.opendaylight.yangtools.yang.binding.DataObject;
import org.opendaylight.yangtools.yang.common.QName;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.localclass.LocalIdList;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;CoreModel-CoreFoundationModule-SuperClassesAndCommonPackages&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/CoreModel-CoreFoundationModule-SuperClassesAndCommonPackages.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * grouping LocalClass {
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
 *     leaf uuid {
 *         type UniversalId;
 *     }
 *     container localIdList {
 *         leaf valueName {
 *             type string;
 *         }
 *         leaf value {
 *             type string;
 *         }
 *         uses NameAndValue;
 *     }
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;CoreModel-CoreFoundationModule-SuperClassesAndCommonPackages/LocalClass&lt;/i&gt;
 *
 */
public interface LocalClass
    extends
    DataObject,
    Name
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("uri:onf:CoreModel-CoreFoundationModule-SuperClassesAndCommonPackages","2016-03-05","LocalClass"));

    /**
     * A global identifier for the LocalClass, which should be used as reference.
     *
     */
    UniversalId getUuid();
    
    /**
     * An identifier that is unique in the context of some scope that is less than the 
     * global scope.(consider in the context of Identifier: A property of an 
     * entity/role with a value that is unique within an identifier space, where the 
     * identifier space is itself unique, and immutable. The identifier therefore 
     * represents the identity of the entity/role. An identifier carries no semantics 
     * with respect to the purpose of the entity.)
     *
     */
    LocalIdList getLocalIdList();

}

