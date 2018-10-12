package org.opendaylight.mwtn.base.toggleAlarmFilter;

import java.util.HashMap;

import org.opendaylight.mwtn.config.impl.HtDevicemanagerConfiguration;
import org.opendaylight.mwtn.config.impl.ToggleAlarmConfig;
import org.opendaylight.mwtn.config.impl.HtDevicemanagerConfiguration.IConfigChangedListener;

public class NotificationDelayService implements AutoCloseable{

    public NotificationDelayFilter<org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.ProblemNotification> getInstance12(String nodeName,
            NotificationDelayedListener<org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.ProblemNotification> eventListener) {
        NotificationDelayFilter<org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.ProblemNotification> filter = this.filters12.getOrDefault(nodeName, null);
        if(filter==null)
        {
            filter=new NotificationDelayFilter<>(nodeName,eventListener);
            this.filters12.put(nodeName, filter);
        }
        return filter;
    }

    public NotificationDelayFilter<org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.ProblemNotification> getInstance1211(String nodeName,
            NotificationDelayedListener<org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.ProblemNotification> eventListener) {
        NotificationDelayFilter<org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.ProblemNotification> filter = this.filters1211.getOrDefault(nodeName, null);
        if(filter==null)
        {
            filter=new NotificationDelayFilter<>(nodeName,eventListener);
            this.filters1211.put(nodeName, filter);
        }
        return filter;
    }

    public NotificationDelayFilter<org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev181010.ProblemNotification> getInstance1211p(String nodeName,
            NotificationDelayedListener<org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev181010.ProblemNotification> eventListener) {
        NotificationDelayFilter<org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev181010.ProblemNotification> filter = this.filters1211p.getOrDefault(nodeName, null);
        if(filter==null)
        {
            filter=new NotificationDelayFilter<>(nodeName,eventListener);
            this.filters1211p.put(nodeName, filter);
        }
        return filter;
    }

    private final HashMap<String,NotificationDelayFilter<org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.ProblemNotification>> filters12;
    private final HashMap<String,NotificationDelayFilter<org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.ProblemNotification>> filters1211;
    private final HashMap<String,NotificationDelayFilter<org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev181010.ProblemNotification>> filters1211p;

    public NotificationDelayService(HtDevicemanagerConfiguration htconfig)
    {
        this.filters12 = new HashMap<>();
        this.filters1211 = new HashMap<>();
        this.filters1211p = new HashMap<>();
        htconfig.registerConfigChangedListener(configChangedListener);
        NotificationDelayFilter.setDelay(htconfig.getToggleAlarm().getDelay());
        NotificationDelayFilter.setEnabled(htconfig.getToggleAlarm().isEnabled());
    }
    private final IConfigChangedListener configChangedListener = () -> {
        ToggleAlarmConfig cfg=ToggleAlarmConfig.reload();
        NotificationDelayFilter.setDelay(cfg.getDelay());
        NotificationDelayFilter.setEnabled(cfg.isEnabled());
    };

    @Override
    public void close() throws Exception {

        //close all filters
        for(NotificationDelayFilter<org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.ProblemNotification> filter: this.filters12.values()) {
            filter.close();
        }

        for(NotificationDelayFilter<org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.ProblemNotification> filter: this.filters1211.values()) {
            filter.close();
        }

        for(NotificationDelayFilter<org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev181010.ProblemNotification> filter: this.filters1211p.values()) {
            filter.close();
        }
    }


}
