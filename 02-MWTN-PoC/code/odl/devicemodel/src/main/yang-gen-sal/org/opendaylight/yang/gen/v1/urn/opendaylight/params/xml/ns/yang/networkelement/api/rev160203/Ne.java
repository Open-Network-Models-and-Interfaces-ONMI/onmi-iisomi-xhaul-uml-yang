package org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203;
import org.opendaylight.yangtools.yang.binding.DataObject;
import org.opendaylight.yangtools.yang.common.QName;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;NetworkElement&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/NetworkElement.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * grouping ne {
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
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;NetworkElement/ne&lt;/i&gt;
 *
 */
public interface Ne
    extends
    DataObject
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("urn:opendaylight:params:xml:ns:yang:networkelement:api","2016-02-03","ne"));

    /**
     * Network Element Name
     *
     */
    java.lang.String getName();
    
    /**
     * Network Element Ip Address
     *
     */
    java.lang.String getIp();
    
    /**
     * Network Element Port
     *
     */
    java.lang.String getPort();
    
    /**
     * Network Element Username
     *
     */
    java.lang.String getUsername();
    
    /**
     * Network Element Password
     *
     */
    java.lang.String getPassword();
    
    /**
     * Network Element Is Connected
     *
     */
    java.lang.Boolean isConnected();

}

