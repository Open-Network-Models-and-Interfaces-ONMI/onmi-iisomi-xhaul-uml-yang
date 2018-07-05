/**
 *
 */
package org.opendaylight.mwtn.devicemanager.impl.xml;

import java.util.concurrent.Future;

import org.opendaylight.mwtn.devicemanager.impl.listener.ODLEventListener;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.websocketmanager.rev150105.WebsocketEventInputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.websocketmanager.rev150105.WebsocketEventOutput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.websocketmanager.rev150105.WebsocketmanagerService;
import org.opendaylight.yangtools.yang.common.RpcResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Wrapper for forwarding websocket notifications to the websocket service, that is running as container.
 * @author herbert
 */
public class WebSocketServiceClient {

    private static final Logger LOG = LoggerFactory.getLogger(ODLEventListener.class);

    private final WebsocketmanagerService websocketmanagerService;
    private final XmlMapper xmlMapper;

    /**
     * @param websocketmanagerService object
     * @param xmlMapper object
     */
    public WebSocketServiceClient(WebsocketmanagerService websocketmanagerService,
            XmlMapper xmlMapper) {
        super();
        this.websocketmanagerService = websocketmanagerService;
        this.xmlMapper = xmlMapper;
    }

    public <T extends MwtNotificationBase & GetEventType> void sendViaWebsockets(String nodeName, T notificationXml) {
        LOG.info("Send websocket event {} for mountpoint {}", notificationXml.getClass().getSimpleName(), nodeName);

        try {
            WebsocketEventInputBuilder wsBuilder = new WebsocketEventInputBuilder();
            wsBuilder.setNodeName(nodeName);
            wsBuilder.setEventType(notificationXml.getEventType());
            wsBuilder.setXmlEvent(xmlMapper.getXmlString(notificationXml));
            Future<RpcResult<WebsocketEventOutput>> result = websocketmanagerService.websocketEvent(wsBuilder.build());
            LOG.info("Send websocket result: {}", result.get().getResult().getResponse());
        } catch (Exception e) {
            LOG.warn("Can not send websocket event {} for mountpoint {} {}",
                    notificationXml.getClass().getSimpleName(), nodeName, e.toString());
        }
    }
}
