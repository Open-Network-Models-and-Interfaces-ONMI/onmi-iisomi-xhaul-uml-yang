package org.opendaylight.mwtn.base.toggleAlarmFilter;

public class NotificationWithServerTimeStamp<T2> {
    private final T2 alarmNotification;
    private T2 contraAlarmNotification;
    private final long timestampStart;
    private long timestamp;

    public NotificationWithServerTimeStamp(T2 n) {
        this(n, System.currentTimeMillis());
    }

    public NotificationWithServerTimeStamp(T2 n, long ts) {
        this.alarmNotification = n;
        this.contraAlarmNotification = null;
        this.timestamp = ts;
        this.timestampStart=ts;
    }

    @SuppressWarnings("unused")
    public long getStartTime() {
        return this.timestampStart;
    }
    public void refresh() {
        this.refresh(System.currentTimeMillis());
    }

    public void refresh(long ts) {
        this.timestamp = ts;
    }

    public void setContraEvent(T2 notification) {
        this.contraAlarmNotification = notification;
        this.refresh();
    }

    public void clrContraEvent() {
        this.contraAlarmNotification = null;
        this.refresh();
    }

    public boolean isStable(long now) {
        return this.timestamp + NotificationDelayFilter.getDelay() < now;
    }

    @SuppressWarnings("unused")
    public T2 getAlarmNotification() {
        return this.alarmNotification;
    }

    public T2 getContraAlarmNotification() {
        return this.contraAlarmNotification;
    }

    @Override
    public String toString() {
        return "NotificationWithServerTimeStamp [alarmNotification=" + alarmNotification
                + ", contraAlarmNotification=" + contraAlarmNotification + ", timestampStart=" + timestampStart
                + ", timestamp=" + timestamp + "]";
    }
}
