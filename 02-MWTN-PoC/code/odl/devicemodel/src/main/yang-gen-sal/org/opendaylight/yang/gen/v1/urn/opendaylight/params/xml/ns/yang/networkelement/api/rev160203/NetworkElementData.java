package org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203;
import org.opendaylight.yangtools.yang.binding.DataRoot;


/**
 * Network Element Model
 *
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;NetworkElement&lt;/b&gt;
 * &lt;br&gt;Source path: &lt;i&gt;META-INF/yang/NetworkElement.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * module NetworkElement {
 *     yang-version 1;
 *     namespace "urn:opendaylight:params:xml:ns:yang:networkelement:api";
 *     prefix "networkelement";
 *
 *     revision 2016-02-03 {
 *         description "Network Element Model
 *         ";
 *     }
 *
 *     container networkElements {
 *         list networkElement {
 *             key "name"
 *             leaf name {
 *                 type string;
 *             }
 *             leaf ip {
 *                 type string;
 *             }
 *             leaf port {
 *                 type string;
 *             }
 *             leaf username {
 *                 type string;
 *             }
 *             leaf password {
 *                 type string;
 *             }
 *             leaf connected {
 *                 type boolean;
 *             }
 *             uses ne;
 *         }
 *     }
 *
 *     grouping ne {
 *         leaf name {
 *             type string;
 *         }
 *         leaf ip {
 *             type string;
 *         }
 *         leaf port {
 *             type string;
 *         }
 *         leaf username {
 *             type string;
 *         }
 *         leaf password {
 *             type string;
 *         }
 *         leaf connected {
 *             type boolean;
 *         }
 *     }
 * }
 * &lt;/pre&gt;
 *
 */
public interface NetworkElementData
    extends
    DataRoot
{




    NetworkElements getNetworkElements();

}

