package org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.netconfconnector.impl;
import org.opendaylight.yangtools.yang.binding.ChildOf;
import org.opendaylight.yangtools.yang.common.QName;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.controller.config.rev130405.modules.Module;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.controller.config.rev130405.ServiceRef;
import org.opendaylight.yangtools.yang.binding.Augmentable;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;netconfconnector-impl&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/netconfconnector-impl.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * container notification-service {
 *     leaf type {
 *         type leafref;
 *     }
 *     leaf name {
 *         type leafref;
 *     }
 *     uses service-ref {
 *         refine (urn:opendaylight:params:xml:ns:yang:netconfconnector:impl?revision=2016-03-02)type {
 *             leaf type {
 *                 type leafref;
 *             }
 *         }
 *     }
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;netconfconnector-impl/modules/module/configuration/(urn:opendaylight:params:xml:ns:yang:netconfconnector:impl?revision=2016-03-02)netconfconnector-impl/notification-service&lt;/i&gt;
 *
 * &lt;p&gt;To create instances of this class use {@link org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.netconfconnector.impl.NotificationServiceBuilder}.
 * @see org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.netconfconnector.impl.NotificationServiceBuilder
 *
 */
public interface NotificationService
    extends
    ChildOf<Module>,
    Augmentable<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.netconfconnector.impl.NotificationService>,
    ServiceRef
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("urn:opendaylight:params:xml:ns:yang:netconfconnector:impl","2016-03-02","notification-service"));


}

