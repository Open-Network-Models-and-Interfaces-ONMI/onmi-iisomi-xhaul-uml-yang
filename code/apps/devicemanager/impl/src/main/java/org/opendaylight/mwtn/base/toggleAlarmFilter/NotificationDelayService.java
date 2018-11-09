package org.opendaylight.mwtn.base.toggleAlarmFilter;

import java.util.HashMap;

import org.opendaylight.mwtn.config.impl.HtDevicemanagerConfiguration;
import org.opendaylight.mwtn.config.impl.HtDevicemanagerConfiguration.IConfigChangedListener;
import org.opendaylight.mwtn.config.impl.ToggleAlarmConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class NotificationDelayService<T> implements AutoCloseable {
    private static final Logger LOG = LoggerFactory.getLogger(NotificationDelayService.class);

    private final HashMap<String, NotificationDelayFilter<T>> filters;

    public NotificationDelayFilter<T> getInstance(String nodeName, NotificationDelayedListener<T> eventListener) {
        NotificationDelayFilter<T> filter = filters.getOrDefault(nodeName, null);

        LOG.trace("nodeName={}, filter!=null? {}", nodeName, filter != null);
        if (filter == null) {
            filter = new NotificationDelayFilter<>(nodeName, eventListener);
            this.filters.put(nodeName, filter);
        }
        return filter;
    }

    public NotificationDelayService(HtDevicemanagerConfiguration htconfig) {
        this.filters = new HashMap<>();
        htconfig.registerConfigChangedListener(configChangedListener);
        NotificationDelayFilter.setDelay(htconfig.getToggleAlarm().getDelay());
        NotificationDelayFilter.setEnabled(htconfig.getToggleAlarm().isEnabled());
    }

    private final IConfigChangedListener configChangedListener = () -> {
        ToggleAlarmConfig cfg = ToggleAlarmConfig.reload();
        NotificationDelayFilter.setDelay(cfg.getDelay());
        NotificationDelayFilter.setEnabled(cfg.isEnabled());
    };

    @Override
    public void close() throws Exception {
        // close all filters
        for (NotificationDelayFilter<T> filter : this.filters.values()) {
            filter.close();
        }
    }

}
