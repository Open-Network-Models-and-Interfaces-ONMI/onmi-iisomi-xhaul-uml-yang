package org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302;
import org.opendaylight.yangtools.yang.binding.DataObject;
import org.opendaylight.yangtools.yang.common.QName;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.Ne;
import org.opendaylight.yangtools.yang.binding.Augmentable;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;nediscovery-api&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/nediscovery-api.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * container input {
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
 * &lt;i&gt;nediscovery-api/connect/input&lt;/i&gt;
 *
 * &lt;p&gt;To create instances of this class use {@link org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302.ConnectInputBuilder}.
 * @see org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302.ConnectInputBuilder
 *
 */
public interface ConnectInput
    extends
    Ne,
    DataObject,
    Augmentable<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302.ConnectInput>
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("urn:opendaylight:params:xml:ns:yang:nediscovery:api","2016-03-02","input"));


}

