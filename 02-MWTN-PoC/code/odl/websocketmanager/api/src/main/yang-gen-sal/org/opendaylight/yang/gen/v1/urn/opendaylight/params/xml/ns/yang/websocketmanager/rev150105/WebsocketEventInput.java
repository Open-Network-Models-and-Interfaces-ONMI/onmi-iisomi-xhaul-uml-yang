package org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.websocketmanager.rev150105;
import org.opendaylight.yangtools.yang.binding.DataObject;
import org.opendaylight.yangtools.yang.common.QName;
import org.opendaylight.yangtools.yang.binding.Augmentable;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;websocketmanager&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/websocketmanager.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * container input {
 *     leaf nodeName {
 *         type string;
 *     }
 *     leaf eventType {
 *         type string;
 *     }
 *     leaf xmlEvent {
 *         type string;
 *     }
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;websocketmanager/websocket-event/input&lt;/i&gt;
 *
 * &lt;p&gt;To create instances of this class use {@link org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.websocketmanager.rev150105.WebsocketEventInputBuilder}.
 * @see org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.websocketmanager.rev150105.WebsocketEventInputBuilder
 *
 */
public interface WebsocketEventInput
    extends
    DataObject,
    Augmentable<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.websocketmanager.rev150105.WebsocketEventInput>
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("urn:opendaylight:params:xml:ns:yang:websocketmanager","2015-01-05","input"));

    java.lang.String getNodeName();
    
    java.lang.String getEventType();
    
    java.lang.String getXmlEvent();

}

