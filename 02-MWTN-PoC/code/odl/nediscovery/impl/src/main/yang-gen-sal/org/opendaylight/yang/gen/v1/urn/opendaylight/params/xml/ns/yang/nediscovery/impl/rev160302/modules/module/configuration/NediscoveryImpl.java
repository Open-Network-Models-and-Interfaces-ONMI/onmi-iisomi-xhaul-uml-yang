package org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.impl.rev160302.modules.module.configuration;
import org.opendaylight.yangtools.yang.binding.DataObject;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.impl.rev160302.modules.module.configuration.nediscovery.impl.Broker;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.controller.config.rev130405.modules.module.Configuration;
import org.opendaylight.yangtools.yang.common.QName;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.impl.rev160302.modules.module.configuration.nediscovery.impl.NetconfconnectorService;
import org.opendaylight.yangtools.yang.binding.Augmentable;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;nediscovery-impl&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/nediscovery-impl.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * case nediscovery-impl {
 *     container broker {
 *         leaf type {
 *             type leafref;
 *         }
 *         leaf name {
 *             type leafref;
 *         }
 *         uses service-ref {
 *             refine (urn:opendaylight:params:xml:ns:yang:nediscovery:impl?revision=2016-03-02)type {
 *                 leaf type {
 *                     type leafref;
 *                 }
 *             }
 *         }
 *     }
 *     container netconfconnector-service {
 *         leaf type {
 *             type leafref;
 *         }
 *         leaf name {
 *             type leafref;
 *         }
 *         uses service-ref {
 *             refine (urn:opendaylight:params:xml:ns:yang:nediscovery:impl?revision=2016-03-02)type {
 *                 leaf type {
 *                     type leafref;
 *                 }
 *             }
 *         }
 *     }
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;nediscovery-impl/modules/module/configuration/(urn:opendaylight:params:xml:ns:yang:nediscovery:impl?revision=2016-03-02)nediscovery-impl&lt;/i&gt;
 *
 */
public interface NediscoveryImpl
    extends
    DataObject,
    Augmentable<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.impl.rev160302.modules.module.configuration.NediscoveryImpl>,
    Configuration
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("urn:opendaylight:params:xml:ns:yang:nediscovery:impl","2016-03-02","nediscovery-impl"));

    Broker getBroker();
    
    NetconfconnectorService getNetconfconnectorService();

}

