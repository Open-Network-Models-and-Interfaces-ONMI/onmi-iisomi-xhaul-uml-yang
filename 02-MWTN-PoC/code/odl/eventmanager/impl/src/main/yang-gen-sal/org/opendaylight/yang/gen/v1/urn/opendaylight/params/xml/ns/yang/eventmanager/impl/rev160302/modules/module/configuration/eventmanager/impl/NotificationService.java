package org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.eventmanager.impl;
import org.opendaylight.yangtools.yang.binding.ChildOf;
import org.opendaylight.yangtools.yang.common.QName;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.controller.config.rev130405.modules.Module;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.controller.config.rev130405.ServiceRef;
import org.opendaylight.yangtools.yang.binding.Augmentable;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;eventmanager-impl&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/eventmanager-impl.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * container notification-service {
 *     leaf type {
 *         type leafref;
 *     }
 *     leaf name {
 *         type leafref;
 *     }
 *     uses service-ref {
 *         refine (urn:opendaylight:params:xml:ns:yang:eventmanager:impl?revision=2016-03-02)type {
 *             leaf type {
 *                 type leafref;
 *             }
 *         }
 *     }
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;eventmanager-impl/modules/module/configuration/(urn:opendaylight:params:xml:ns:yang:eventmanager:impl?revision=2016-03-02)eventmanager-impl/notification-service&lt;/i&gt;
 *
 * &lt;p&gt;To create instances of this class use {@link org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.eventmanager.impl.NotificationServiceBuilder}.
 * @see org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.eventmanager.impl.NotificationServiceBuilder
 *
 */
public interface NotificationService
    extends
    ChildOf<Module>,
    Augmentable<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.eventmanager.impl.NotificationService>,
    ServiceRef
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("urn:opendaylight:params:xml:ns:yang:eventmanager:impl","2016-03-02","notification-service"));


}

