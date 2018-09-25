import org.apache.log4j.Level;
import org.opendaylight.mwtn.base.toggleAlarmFilter.NotificationDelayFilter;
import org.opendaylight.mwtn.base.toggleAlarmFilter.NotificationDelayService;
import org.opendaylight.mwtn.base.toggleAlarmFilter.NotificationDelayedListener;
import org.opendaylight.mwtn.base.internalTypes.TimeSpan;
import org.opendaylight.mwtn.config.impl.HtDevicemanagerConfiguration;
import org.opendaylight.mwtn.config.impl.HtLogger;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.UniversalId;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.ProblemNotification;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.ProblemNotificationBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.SeverityType;

public class DelayNotificationServiceTest {


	private static final String TESTNODE_NAME = "testnode";
	private static final UniversalId UUID = UniversalId.getDefaultInstance("ref-id");
	protected static final String ALARMNAME1 = "alarm1";
	protected static final String ALARMNAME2 = "alarm2";
	protected static final String ALARMNAME3 = "alarm3";
	protected static final String ALARMNAME4 = "alarm4";
	private static final int FILTERDELAY = 6000;
	protected static final String ALARMNAME5 = "alarm5";
	protected static final String ALARMNAME7 = "alarm7";
	protected static final String ALARMNAME6 = "alarm6";

	private static NotificationDelayService service;
	private static NotificationDelayFilter<ProblemNotification> filter;
	private static int counter=0;
	private static boolean thread1IsRunning;
	private static boolean thread2IsRunning;

	private static long startTime;
	private static boolean thread3IsRunning;
	private static boolean thread4IsRunning;
	private static boolean thread5IsRunning;
	private static boolean thread6IsRunning;
	private static boolean thread7IsRunning;
	private static ProblemNotification getNotification(String alarmName,boolean alarm)
	{
		ProblemNotificationBuilder builder=new ProblemNotificationBuilder();
		builder.setCounter(counter++).setSeverity(alarm?SeverityType.Critical:SeverityType.NonAlarmed).setProblem(alarmName).setObjectIdRef(UUID);
		return builder.build();

	}
	public static void main(String[] args)
	{
		HtLogger.initConsole(Level.INFO);
		service = new NotificationDelayService(HtDevicemanagerConfiguration.getTestConfiguration());
		filter=service.getInstance12(TESTNODE_NAME, new NotificationDelayedListener<ProblemNotification>() {

			@Override
			public void onNotificationDelay(ProblemNotification notification) {
				pushNotification(notification);

			}
		});
		sleep(5000);
		NotificationDelayFilter.setEnabled(true);
		NotificationDelayFilter.setDelay(FILTERDELAY);
		System.out.println("initialized");
		System.out.println("start test with filter-delay:"+NotificationDelayFilter.getDelay()+"ms");
		startTime=System.currentTimeMillis();
		//startThread1();
		//startThread2();
		//startThread3();
		//startThread4();
		//startThread5();
		startThread6();
		//startThread7();

		while(threadsAreRunning())
		{
			sleep(1000);
		}
		sleep(2*FILTERDELAY);
		try {
			service.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		System.out.println("finished test");
	}


	private static boolean threadsAreRunning() {
		return thread1IsRunning || thread2IsRunning || thread3IsRunning || thread4IsRunning || thread5IsRunning || thread6IsRunning || thread7IsRunning;
	}
	private static void startThread1() {
		thread1IsRunning=true;
		new Thread(new Runnable() {

			private final int smallTick=1000;
			private final int longTick=6000;
			private final String ALARMNAME=ALARMNAME1;
			@Override
			public void run() {
				raiseNotification(getNotification(ALARMNAME, true));
				sleep(this.longTick);
				raiseNotification(getNotification(ALARMNAME, false));
				sleep(this.longTick);
				thread1IsRunning=false;
			}

		}).start();

	}
	private static void startThread2() {
		thread2IsRunning=true;
		new Thread(new Runnable() {

			private final int smallTick=1000;
			private final int longTick=6000;
			private final String ALARMNAME=ALARMNAME2;
			@Override
			public void run() {

				raiseNotification(getNotification(ALARMNAME, true));
				sleep(this.smallTick);
				raiseNotification(getNotification(ALARMNAME, false));
				sleep(this.longTick);
				thread2IsRunning=false;
			}

		}).start();

	}
	private static void startThread3() {
		thread3IsRunning=true;
		new Thread(new Runnable() {

			private final int smallTick=1000;
			private final int longTick=6000;
			private final String ALARMNAME=ALARMNAME3;
			@Override
			public void run() {

				raiseNotification(getNotification(ALARMNAME, true));
				sleep(this.smallTick);
				raiseNotification(getNotification(ALARMNAME, false));
				sleep(this.smallTick);
				raiseNotification(getNotification(ALARMNAME, true));
				sleep(this.longTick);


				thread3IsRunning=false;
			}

		}).start();

	}
	private static void startThread4() {
		thread4IsRunning=true;
		new Thread(new Runnable() {

			private final int smallTick=1000;
			private final int longTick=6000;
			private final String ALARMNAME=ALARMNAME4;
			@Override
			public void run() {

				raiseNotification(getNotification(ALARMNAME, true));
				sleep(this.smallTick);
				raiseNotification(getNotification(ALARMNAME, false));
				sleep(this.smallTick);
				raiseNotification(getNotification(ALARMNAME, true));
				sleep(this.smallTick);
				raiseNotification(getNotification(ALARMNAME, false));
				sleep(this.smallTick);

				thread4IsRunning=false;
			}

		}).start();

	}
	private static void startThread5() {
		thread5IsRunning=true;
		new Thread(new Runnable() {

			private final int smallTick=1000;
			private final int longTick=6000;
			private final String ALARMNAME=ALARMNAME5;
			@Override
			public void run() {

				raiseNotification(getNotification(ALARMNAME, false));
				sleep(this.smallTick);
				raiseNotification(getNotification(ALARMNAME, true));
				sleep(this.smallTick);
				raiseNotification(getNotification(ALARMNAME, false));
				sleep(this.smallTick);
				raiseNotification(getNotification(ALARMNAME, true));
				sleep(this.smallTick);
				raiseNotification(getNotification(ALARMNAME, false));
				sleep(this.longTick);

				thread5IsRunning=false;
			}

		}).start();

	}
	private static void startThread6() {
		thread6IsRunning=true;
		new Thread(new Runnable() {

			private final int smallTick=1000;
			private final int smallerTick=500;
			private final int longTick=6000;
			private final String ALARMNAME=ALARMNAME6;
			@Override
			public void run() {

				raiseNotification(getNotification(ALARMNAME, true));
				sleep(this.smallerTick);
				raiseNotification(getNotification(ALARMNAME, true));
				sleep(this.smallerTick);
				raiseNotification(getNotification(ALARMNAME, false));
				sleep(this.smallerTick);
				raiseNotification(getNotification(ALARMNAME, false));
				sleep(this.smallerTick);
				raiseNotification(getNotification(ALARMNAME, true));
				sleep(this.smallerTick);
				raiseNotification(getNotification(ALARMNAME, true));
				sleep(this.smallerTick);
				raiseNotification(getNotification(ALARMNAME, false));
				sleep(this.smallerTick);
				raiseNotification(getNotification(ALARMNAME, false));
				sleep(this.smallerTick);
				raiseNotification(getNotification(ALARMNAME, true));
				sleep(this.smallerTick);
				raiseNotification(getNotification(ALARMNAME, true));
				sleep(this.smallerTick);
				raiseNotification(getNotification(ALARMNAME, false));
				sleep(this.smallerTick);
				raiseNotification(getNotification(ALARMNAME, false));
				sleep(this.smallerTick);
				raiseNotification(getNotification(ALARMNAME, true));
				sleep(this.smallerTick);
				raiseNotification(getNotification(ALARMNAME, true));
				sleep(this.longTick);

				thread6IsRunning=false;
			}

		}).start();

	}
	private static void startThread7() {
		thread7IsRunning=true;
		new Thread(new Runnable() {

			private final int smallTick=1000;
			private final int smallerTick=500;
			private final int longTick=6000;
			private final String ALARMNAME=ALARMNAME7;
			@Override
			public void run() {

				raiseNotification(getNotification(ALARMNAME, false));
				sleep(this.smallerTick);
				raiseNotification(getNotification(ALARMNAME, false));
				sleep(this.smallerTick);
				raiseNotification(getNotification(ALARMNAME, true));
				sleep(this.smallerTick);
				raiseNotification(getNotification(ALARMNAME, true));
				sleep(this.smallerTick);
				raiseNotification(getNotification(ALARMNAME, false));
				sleep(this.smallerTick);
				raiseNotification(getNotification(ALARMNAME, false));
				sleep(this.smallerTick);
				raiseNotification(getNotification(ALARMNAME, true));
				sleep(this.smallerTick);
				raiseNotification(getNotification(ALARMNAME, true));
				sleep(this.smallerTick);
				raiseNotification(getNotification(ALARMNAME, false));
				sleep(this.smallerTick);
				raiseNotification(getNotification(ALARMNAME, false));
				sleep(this.smallerTick);
				raiseNotification(getNotification(ALARMNAME, true));
				sleep(this.smallerTick);
				raiseNotification(getNotification(ALARMNAME, true));
				sleep(this.smallerTick);
				raiseNotification(getNotification(ALARMNAME, false));
				sleep(this.smallerTick);
				raiseNotification(getNotification(ALARMNAME, false));
				sleep(this.longTick);

				thread7IsRunning=false;
			}

		}).start();

	}
	protected static void sleep(int i) {
		try {
			Thread.sleep(i);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	private static void pushNotification(ProblemNotification n)
	{
		TimeSpan curTs=TimeSpan.ofMillis(System.currentTimeMillis()-startTime);
		System.out.println(curTs.toString()+"\tpushed alarm: "+n.getProblem()+": "+n.getSeverity().toString()+" "+String.valueOf(n.getCounter()));
	}
	private static void raiseNotification(ProblemNotification n)
	{
		TimeSpan curTs=TimeSpan.ofMillis(System.currentTimeMillis()-startTime);
		System.out.println(curTs.toString()+"\traised alarm: "+n.getProblem()+": "+n.getSeverity().toString()+" "+String.valueOf(n.getCounter()));
		if(n.getSeverity()!=SeverityType.NonAlarmed)
			filter.pushAlarmNotification(n.getProblem(),n);
		else
			filter.clearAlarmNotification(n.getProblem(), n);
	}
}
