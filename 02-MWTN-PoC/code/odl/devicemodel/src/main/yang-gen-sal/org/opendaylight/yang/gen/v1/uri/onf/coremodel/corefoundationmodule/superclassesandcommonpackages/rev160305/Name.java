package org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.name.NameList;
import org.opendaylight.yangtools.yang.binding.DataObject;
import org.opendaylight.yangtools.yang.common.QName;
import java.util.List;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;CoreModel-CoreFoundationModule-SuperClassesAndCommonPackages&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/CoreModel-CoreFoundationModule-SuperClassesAndCommonPackages.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * grouping Name {
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
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;CoreModel-CoreFoundationModule-SuperClassesAndCommonPackages/Name&lt;/i&gt;
 *
 */
public interface Name
    extends
    DataObject
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("uri:onf:CoreModel-CoreFoundationModule-SuperClassesAndCommonPackages","2016-03-05","Name"));

    /**
     * List of names.
     *
     */
    List<NameList> getNameList();

}

