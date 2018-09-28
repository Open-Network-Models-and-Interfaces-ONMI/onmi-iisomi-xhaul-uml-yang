package org.opendaylight.mwtn.base.toggleAlarmFilter;

import java.util.HashMap;

import org.opendaylight.mwtn.config.impl.HtDevicemanagerConfiguration;
import org.opendaylight.mwtn.config.impl.ToggleAlarmConfig;
import org.opendaylight.mwtn.config.impl.HtDevicemanagerConfiguration.IConfigChangedListener;

public class NotificationDelayService implements AutoCloseable{

	public NotificationDelayFilter<org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180927.ProblemNotification> getInstance12(String nodeName,
			NotificationDelayedListener<org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180927.ProblemNotification> eventListener) {
		NotificationDelayFilter<org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180927.ProblemNotification> filter = this.filters12.getOrDefault(nodeName, null);
		if(filter==null)
		{
			filter=new NotificationDelayFilter<org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180927.ProblemNotification>(nodeName,eventListener);
			this.filters12.put(nodeName, filter);
		}
		return filter;
	}

	private final HashMap<String,NotificationDelayFilter<org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180927.ProblemNotification>> filters12;

	public NotificationDelayService(HtDevicemanagerConfiguration htconfig)
	{
		this.filters12=new HashMap<String,NotificationDelayFilter<org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180927.ProblemNotification>>();
		htconfig.registerConfigChangedListener(configChangedListener);
		NotificationDelayFilter.setDelay(htconfig.getToggleAlarm().getDelay());
		NotificationDelayFilter.setEnabled(htconfig.getToggleAlarm().isEnabled());
	}
	private final IConfigChangedListener configChangedListener = new IConfigChangedListener() {

		@Override
		public void onConfigChanged() {
			ToggleAlarmConfig cfg=ToggleAlarmConfig.reload();
			NotificationDelayFilter.setDelay(cfg.getDelay());
			NotificationDelayFilter.setEnabled(cfg.isEnabled());
		}
	};
	@Override
	public void close() throws Exception {

		//close all filters
		for(NotificationDelayFilter<org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180927.ProblemNotification> filter: this.filters12.values())
			filter.close();

	}


}
