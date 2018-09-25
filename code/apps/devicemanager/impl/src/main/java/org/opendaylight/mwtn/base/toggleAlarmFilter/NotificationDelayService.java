package org.opendaylight.mwtn.base.toggleAlarmFilter;

import java.util.HashMap;

import org.opendaylight.mwtn.config.impl.HtDevicemanagerConfiguration;
import org.opendaylight.mwtn.config.impl.ToggleAlarmConfig;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160809.ProblemNotification;
import org.opendaylight.mwtn.config.impl.HtDevicemanagerConfiguration.IConfigChangedListener;

public class NotificationDelayService implements AutoCloseable{

	public NotificationDelayFilter<ProblemNotification> getInstance10(String nodeName,
			NotificationDelayedListener<ProblemNotification> eventListener) {
		NotificationDelayFilter<ProblemNotification> filter = this.filters10.getOrDefault(nodeName, null);
		if(filter==null)
		{
			filter=new NotificationDelayFilter<ProblemNotification>(nodeName,eventListener);
			this.filters10.put(nodeName, filter);
		}
		return filter;
	}
	public NotificationDelayFilter<org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.ProblemNotification> getInstance12(String nodeName,
			NotificationDelayedListener<org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.ProblemNotification> eventListener) {
		NotificationDelayFilter<org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.ProblemNotification> filter = this.filters12.getOrDefault(nodeName, null);
		if(filter==null)
		{
			filter=new NotificationDelayFilter<org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.ProblemNotification>(nodeName,eventListener);
			this.filters12.put(nodeName, filter);
		}
		return filter;
	}

	private final HashMap<String,NotificationDelayFilter<ProblemNotification>> filters10;
	private final HashMap<String,NotificationDelayFilter<org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.ProblemNotification>> filters12;

	public NotificationDelayService(HtDevicemanagerConfiguration htconfig)
	{
		this.filters10=new HashMap<String,NotificationDelayFilter<ProblemNotification>>();
		this.filters12=new HashMap<String,NotificationDelayFilter<org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.ProblemNotification>>();
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
		for(NotificationDelayFilter<ProblemNotification> filter: this.filters10.values())
			filter.close();
		for(NotificationDelayFilter<org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.ProblemNotification> filter: this.filters12.values())
			filter.close();

	}


}
