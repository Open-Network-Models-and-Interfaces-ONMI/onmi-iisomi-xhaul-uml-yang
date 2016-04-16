package org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.localclass;
import org.opendaylight.yangtools.yang.binding.ChildOf;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.NameAndValue;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.LocalClass;
import org.opendaylight.yangtools.yang.common.QName;
import org.opendaylight.yangtools.yang.binding.Augmentable;


/**
 * An identifier that is unique in the context of some scope that is less than the 
 * global scope.(consider in the context of Identifier: A property of an 
 * entity/role with a value that is unique within an identifier space, where the 
 * identifier space is itself unique, and immutable. The identifier therefore 
 * represents the identity of the entity/role. An identifier carries no semantics 
 * with respect to the purpose of the entity.)
 *
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;CoreModel-CoreFoundationModule-SuperClassesAndCommonPackages&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/CoreModel-CoreFoundationModule-SuperClassesAndCommonPackages.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * container localIdList {
 *     leaf valueName {
 *         type string;
 *     }
 *     leaf value {
 *         type string;
 *     }
 *     uses NameAndValue;
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;CoreModel-CoreFoundationModule-SuperClassesAndCommonPackages/LocalClass/localIdList&lt;/i&gt;
 *
 * &lt;p&gt;To create instances of this class use {@link org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.localclass.LocalIdListBuilder}.
 * @see org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.localclass.LocalIdListBuilder
 *
 */
public interface LocalIdList
    extends
    ChildOf<LocalClass>,
    Augmentable<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.localclass.LocalIdList>,
    NameAndValue
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("uri:onf:CoreModel-CoreFoundationModule-SuperClassesAndCommonPackages","2016-03-05","localIdList"));


}

