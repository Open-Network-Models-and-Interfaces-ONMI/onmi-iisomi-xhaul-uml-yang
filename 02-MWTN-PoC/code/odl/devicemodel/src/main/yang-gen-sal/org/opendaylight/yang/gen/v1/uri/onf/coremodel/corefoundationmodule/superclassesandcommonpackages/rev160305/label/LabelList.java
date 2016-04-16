package org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.label;
import org.opendaylight.yangtools.yang.binding.ChildOf;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.NameAndValue;
import org.opendaylight.yangtools.yang.common.QName;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.Label;
import org.opendaylight.yangtools.yang.binding.Augmentable;
import org.opendaylight.yangtools.yang.binding.Identifiable;


/**
 * List of labels.
 *
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;CoreModel-CoreFoundationModule-SuperClassesAndCommonPackages&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/CoreModel-CoreFoundationModule-SuperClassesAndCommonPackages.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * list labelList {
 *     key "valueName"
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
 * &lt;i&gt;CoreModel-CoreFoundationModule-SuperClassesAndCommonPackages/Label/labelList&lt;/i&gt;
 *
 * &lt;p&gt;To create instances of this class use {@link org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.label.LabelListBuilder}.
 * @see org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.label.LabelListBuilder
 * @see org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.label.LabelListKey
 *
 */
public interface LabelList
    extends
    ChildOf<Label>,
    Augmentable<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.label.LabelList>,
    NameAndValue,
    Identifiable<LabelListKey>
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("uri:onf:CoreModel-CoreFoundationModule-SuperClassesAndCommonPackages","2016-03-05","labelList"));

    /**
     * Returns Primary Key of Yang List Type
     *
     */
    LabelListKey getKey();

}

