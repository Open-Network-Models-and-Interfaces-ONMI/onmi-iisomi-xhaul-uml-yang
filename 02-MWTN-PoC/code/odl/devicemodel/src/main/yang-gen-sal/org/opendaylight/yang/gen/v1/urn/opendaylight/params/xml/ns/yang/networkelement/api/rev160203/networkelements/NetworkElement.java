package org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements;
import org.opendaylight.yangtools.yang.binding.ChildOf;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.NetworkElements;
import org.opendaylight.yangtools.yang.common.QName;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.Ne;
import org.opendaylight.yangtools.yang.binding.Augmentable;
import org.opendaylight.yangtools.yang.binding.Identifiable;


/**
 * Network Elements
 *
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;NetworkElement&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/NetworkElement.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * list networkElement {
 *     key "name"
 *     leaf name {
 *         type string;
 *     }
 *     leaf ip {
 *         type string;
 *     }
 *     leaf port {
 *         type string;
 *     }
 *     leaf username {
 *         type string;
 *     }
 *     leaf password {
 *         type string;
 *     }
 *     leaf connected {
 *         type boolean;
 *     }
 *     uses ne;
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;NetworkElement/networkElements/networkElement&lt;/i&gt;
 *
 * &lt;p&gt;To create instances of this class use {@link org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElementBuilder}.
 * @see org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElementBuilder
 * @see org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElementKey
 *
 */
public interface NetworkElement
    extends
    ChildOf<NetworkElements>,
    Augmentable<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElement>,
    Ne,
    Identifiable<NetworkElementKey>
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("urn:opendaylight:params:xml:ns:yang:networkelement:api","2016-02-03","networkElement"));

    /**
     * Returns Primary Key of Yang List Type
     *
     */
    NetworkElementKey getKey();

}

