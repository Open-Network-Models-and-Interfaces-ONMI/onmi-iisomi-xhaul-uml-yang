package org.opendaylight.mwtn.base.toggleAlarmFilter;

import java.util.Map.Entry;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class NotificationDelayFilter<T> implements AutoCloseable {

	private static final Logger LOG = LoggerFactory.getLogger(NotificationDelayFilter.class);

	private class NotificationWithServerTimeStamp<T2> {
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
			return this.timestamp + NotificationDelayFilter.delay < now;
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

	private final ConcurrentHashMap <String, NotificationWithServerTimeStamp<T>> problemItems;
//	private final HashMap<String, NotificationWithServerTimeStamp<T>> nonProblemItems;
	private final NotificationDelayedListener<T> timeoutListener;

	private static long delay;
	private static boolean enabled;

	public static void setDelay(long l) {
		NotificationDelayFilter.delay = l;
	}

	public static long getDelay() {
		return NotificationDelayFilter.delay;
	}

	public static boolean isEnabled() {
		return NotificationDelayFilter.enabled;
	}

	public static void setEnabled(boolean enabled) {
		NotificationDelayFilter.enabled = enabled;
	}

	private final ScheduledExecutorService scheduler;
	private final Runnable timerRunner = new Runnable() {

		@Override
		public void run() {
			onTick();
		}
	};

	private final String nodeName;

	public NotificationDelayFilter(String nodeName, NotificationDelayedListener<T> timeoutListener) {
		this.nodeName = nodeName;
		this.timeoutListener = timeoutListener;
		this.problemItems = new ConcurrentHashMap <String, NotificationWithServerTimeStamp<T>>();
		this.scheduler = Executors.newScheduledThreadPool(1);
		this.startTimer();
	}

	/**
	 * Push notification with a specific severity (everything except non-alarmed)
	 *
	 * @param problemName
	 * @param notification
	 */
	public void pushAlarmNotification(String problemName, T notification) {
		synchronized (problemItems) {

			boolean cp = this.problemItems.containsKey(problemName);
			if (!cp) {
				// no alarm in entries => create entry and push the alarm currently
				NotificationDelayFilter<T>.NotificationWithServerTimeStamp<T> item = new NotificationWithServerTimeStamp<T>(
						notification);
				LOG.debug("add event into list for node " + this.nodeName + " for alarm " + problemName + ": "
						+ item.toString());
				this.problemItems.put(problemName, item);
				if (this.timeoutListener != null)
					this.timeoutListener.onNotificationDelay(notification);
			} else {
				LOG.debug("clear contra event for node " + this.nodeName + " for alarm " + problemName);
				this.problemItems.get(problemName).clrContraEvent();
			}

		}
	}

	/**
	 * Push notification with severity non-alarmed
	 *
	 * @param problemName
	 * @param notification
	 */
	public void clearAlarmNotification(String problemName, T notification) {
		synchronized (problemItems) {

			boolean cp = this.problemItems.containsKey(problemName);
			if (cp) {
				LOG.debug("set contra event for alarm " + problemName);
				this.problemItems.get(problemName).setContraEvent(notification);
			} else {
				// not in list => push directly through
				if (this.timeoutListener != null)
					this.timeoutListener.onNotificationDelay(notification);
			}
		}
	}

	private void startTimer() {
		scheduler.scheduleAtFixedRate(timerRunner, 0, 1, TimeUnit.SECONDS);
	}

	private void stopTimer() {
		scheduler.shutdown();
	}

	/**
	 * check for clearing item out of the list
	 */
	private void onTick() {
		long now = System.currentTimeMillis();
		try {

			synchronized (problemItems) {

				for (Entry<String, NotificationDelayFilter<T>.NotificationWithServerTimeStamp<T>> entry : problemItems
						.entrySet()) {
					NotificationWithServerTimeStamp<T> value = entry.getValue();
					if (value.isStable(now)) {
						// send contra Alarm if exists
						if (value.getContraAlarmNotification() != null) {
							if (this.timeoutListener != null)
								this.timeoutListener.onNotificationDelay(value.getContraAlarmNotification());
						}
						problemItems.remove(entry.getKey());
						LOG.debug("removing entry for "+this.nodeName+" for alarm " + entry.getKey());
					} else
						LOG.trace("currently state is still unstable for alarm " + entry.getKey());
				}

			}
		} catch (Exception e) {
			//Prevent stopping the task
			LOG.warn("Exception during NotificationDelayFilter Task", e);
		}
	}

	@Override
	public void close() throws Exception {
		this.stopTimer();
	}

}
