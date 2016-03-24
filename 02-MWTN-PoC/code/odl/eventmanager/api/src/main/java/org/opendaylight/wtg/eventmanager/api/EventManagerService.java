package org.opendaylight.wtg.eventmanager.api;

public interface EventManagerService {
	public void startListenerOnNode(String nodeName);

	public void removeListenerOnNode(String nodeName);
}
