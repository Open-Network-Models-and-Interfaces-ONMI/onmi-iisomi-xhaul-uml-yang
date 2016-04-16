package org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.websocketmanager.rev150105;
import org.opendaylight.yangtools.yang.binding.RpcService;
import org.opendaylight.yangtools.yang.common.RpcResult;
import java.util.concurrent.Future;


/**
 * Interface for implementing the following YANG RPCs defined in module &lt;b&gt;websocketmanager&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/websocketmanager.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * rpc websocket-event {
 *     input {
 *         leaf nodeName {
 *             type string;
 *         }
 *         leaf eventType {
 *             type string;
 *         }
 *         leaf xmlEvent {
 *             type string;
 *         }
 *     }
 *     
 *     output {
 *         leaf response {
 *             type string;
 *         }
 *     }
 *     status CURRENT;
 * }
 * &lt;/pre&gt;
 *
 */
public interface WebsocketmanagerService
    extends
    RpcService
{




    Future<RpcResult<WebsocketEventOutput>> websocketEvent(WebsocketEventInput input);

}

