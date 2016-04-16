package org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302;
import org.opendaylight.yangtools.yang.binding.RpcService;
import org.opendaylight.yangtools.yang.common.RpcResult;
import java.util.concurrent.Future;


/**
 * Interface for implementing the following YANG RPCs defined in module &lt;b&gt;nediscovery-api&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/nediscovery-api.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * rpc connect {
 *     "Netconf Server connects to Controller through this rpc";
 *     input {
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
 *     
 *     output {
 *         leaf result {
 *             type string;
 *         }
 *     }
 *     status CURRENT;
 * }
 * rpc disconnect {
 *     "Netconf Server dis-connects to Controller through this rpc";
 *     input {
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
 *     
 *     output {
 *         leaf result {
 *             type string;
 *         }
 *     }
 *     status CURRENT;
 * }
 * &lt;/pre&gt;
 *
 */
public interface NediscoveryApiService
    extends
    RpcService
{




    /**
     * Netconf Server connects to Controller through this rpc
     *
     */
    Future<RpcResult<ConnectOutput>> connect(ConnectInput input);
    
    /**
     * Netconf Server dis-connects to Controller through this rpc
     *
     */
    Future<RpcResult<DisconnectOutput>> disconnect(DisconnectInput input);

}

