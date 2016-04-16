package org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration;
import org.opendaylight.yangtools.yang.binding.DataObject;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.netconfconnector.impl.Broker;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.controller.config.rev130405.modules.module.Configuration;
import org.opendaylight.yangtools.yang.common.QName;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.netconfconnector.impl.NotificationService;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.netconfconnector.impl.EventmanagerService;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.netconfconnector.impl.DataBroker;
import org.opendaylight.yangtools.yang.binding.Augmentable;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;netconfconnector-impl&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/netconfconnector-impl.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * case netconfconnector-impl {
 *     container broker {
 *         leaf type {
 *             type leafref;
 *         }
 *         leaf name {
 *             type leafref;
 *         }
 *         uses service-ref {
 *             refine (urn:opendaylight:params:xml:ns:yang:netconfconnector:impl?revision=2016-03-02)type {
 *                 leaf type {
 *                     type leafref;
 *                 }
 *             }
 *         }
 *     }
 *     container notification-service {
 *         leaf type {
 *             type leafref;
 *         }
 *         leaf name {
 *             type leafref;
 *         }
 *         uses service-ref {
 *             refine (urn:opendaylight:params:xml:ns:yang:netconfconnector:impl?revision=2016-03-02)type {
 *                 leaf type {
 *                     type leafref;
 *                 }
 *             }
 *         }
 *     }
 *     container data-broker {
 *         leaf type {
 *             type leafref;
 *         }
 *         leaf name {
 *             type leafref;
 *         }
 *         uses service-ref {
 *             refine (urn:opendaylight:params:xml:ns:yang:netconfconnector:impl?revision=2016-03-02)type {
 *                 leaf type {
 *                     type leafref;
 *                 }
 *             }
 *         }
 *     }
 *     container eventmanager-service {
 *         leaf type {
 *             type leafref;
 *         }
 *         leaf name {
 *             type leafref;
 *         }
 *         uses service-ref {
 *             refine (urn:opendaylight:params:xml:ns:yang:netconfconnector:impl?revision=2016-03-02)type {
 *                 leaf type {
 *                     type leafref;
 *                 }
 *             }
 *         }
 *     }
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;netconfconnector-impl/modules/module/configuration/(urn:opendaylight:params:xml:ns:yang:netconfconnector:impl?revision=2016-03-02)netconfconnector-impl&lt;/i&gt;
 *
 */
public interface NetconfconnectorImpl
    extends
    DataObject,
    Augmentable<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.NetconfconnectorImpl>,
    Configuration
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("urn:opendaylight:params:xml:ns:yang:netconfconnector:impl","2016-03-02","netconfconnector-impl"));

    Broker getBroker();
    
    NotificationService getNotificationService();
    
    DataBroker getDataBroker();
    
    EventmanagerService getEventmanagerService();

}

