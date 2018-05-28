package org.opendaylight.mwtn.opticalpathmanager.test;

import java.util.HashMap;
import java.util.concurrent.Future;

import org.opendaylight.controller.md.sal.binding.api.BindingTransactionChain;
import org.opendaylight.controller.md.sal.binding.api.DataBroker;
import org.opendaylight.controller.md.sal.binding.api.DataChangeListener;
import org.opendaylight.controller.md.sal.binding.api.DataTreeChangeListener;
import org.opendaylight.controller.md.sal.binding.api.DataTreeIdentifier;
import org.opendaylight.controller.md.sal.binding.api.ReadOnlyTransaction;
import org.opendaylight.controller.md.sal.binding.api.ReadWriteTransaction;
import org.opendaylight.controller.md.sal.binding.api.WriteTransaction;
import org.opendaylight.controller.md.sal.common.api.data.LogicalDatastoreType;
import org.opendaylight.controller.md.sal.common.api.data.TransactionChainListener;
import org.opendaylight.controller.md.sal.common.api.routing.RouteChangeListener;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker.ProviderContext;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker.RoutedRpcRegistration;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker.RpcRegistration;
import org.opendaylight.controller.sal.binding.api.BindingAwareService;
import org.opendaylight.controller.sal.binding.api.rpc.RpcContextIdentifier;
import org.opendaylight.mwtn.opticalpathmanager.OpticalPathManagerProvider;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.opticalpathmanager.rev180119.GetInformationInputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.opticalpathmanager.rev180119.GetInformationOutput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.opticalpathmanager.rev180119.OpticalpathmanagerService;
import org.opendaylight.yangtools.concepts.ListenerRegistration;
import org.opendaylight.yangtools.yang.binding.DataObject;
import org.opendaylight.yangtools.yang.binding.InstanceIdentifier;
import org.opendaylight.yangtools.yang.binding.RpcService;
import org.opendaylight.yangtools.yang.common.RpcResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.apache.log4j.BasicConfigurator;


public class OpticalPathmanagerTest {

    private static final Logger LOG = LoggerFactory.getLogger(OpticalPathmanagerTest.class);

	private static HashMap<Class<?>,RpcService> services = new HashMap<>();

	public static void main(String[] args) throws Exception	{
		BasicConfigurator.configure();
		LOG.info("Start logging");
		System.out.println("Optical Pathmanager test program");

		ProviderContext providerContext = getDummySession();
        OpticalPathManagerProvider provider = new OpticalPathManagerProvider();
 		provider.onSessionInitiated(providerContext);

 		System.out.println("Optical passmanager specific setup");

 		OpticalpathmanagerService opticalPathManager = providerContext.getRpcService(OpticalpathmanagerService.class);
 		GetInformationInputBuilder inputBuilder =  new GetInformationInputBuilder();
 		Future<RpcResult<GetInformationOutput>> output = opticalPathManager.getInformation(inputBuilder.build());
 		System.out.println("Information: "+output.get().getResult().getInformation());


 		System.out.println("Optical passmanager end");
 		provider.close();
	}


    private static ProviderContext getDummySession() {

    	return new ProviderContext() {

			@Override
			public <T extends BindingAwareService> T getSALService(Class<T> service) {
				if (service == DataBroker.class) {
					return ((T)getDummyDataBroker());
				}
				return null;
			}

			@SuppressWarnings("unchecked")
			@Override
			public <T extends RpcService> T getRpcService(Class<T> serviceInterface) {
				return (T) services.get(serviceInterface);
			}

			@Override
			public <T extends RpcService> RpcRegistration<T> addRpcImplementation(Class<T> serviceInterface,
					T implementation) throws IllegalStateException {
				services.put(serviceInterface, implementation);
				System.out.println("Add rpc service:\n\t"+serviceInterface+"\n\t"+implementation);
				return null;
			}

			@Override
			public <T extends RpcService> RoutedRpcRegistration<T> addRoutedRpcImplementation(Class<T> serviceInterface,
					T implementation) throws IllegalStateException {
				return null;
			}

			@Override
			public <L extends RouteChangeListener<RpcContextIdentifier, InstanceIdentifier<?>>> ListenerRegistration<L> registerRouteChangeListener(
					L listener) {
				return null;
			}
    	};
    }

    private static <T extends BindingAwareService> DataBroker getDummyDataBroker() {
    	return new DataBroker() {

			@Override
			public <T extends DataObject, L extends DataTreeChangeListener<T>> ListenerRegistration<L> registerDataTreeChangeListener(
					DataTreeIdentifier<T> treeId, L listener) {
				return null;
			}

			@Override
			public ReadOnlyTransaction newReadOnlyTransaction() {
				return null;
			}

			@Override
			public ReadWriteTransaction newReadWriteTransaction() {
				return null;
			}

			@Override
			public WriteTransaction newWriteOnlyTransaction() {
				return null;
			}

			@Override
			public ListenerRegistration<DataChangeListener> registerDataChangeListener(LogicalDatastoreType store,
					InstanceIdentifier<?> path, DataChangeListener listener, DataChangeScope triggeringScope) {
				return null;
			}

			@Override
			public BindingTransactionChain createTransactionChain(TransactionChainListener listener) {
				return null;
			}

    	};
    }


}
