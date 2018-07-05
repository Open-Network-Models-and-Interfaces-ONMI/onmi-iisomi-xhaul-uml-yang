import org.apache.log4j.Level;
import org.opendaylight.mwtn.config.impl.AaiConfig;
import org.opendaylight.mwtn.config.impl.DcaeConfig;
import org.opendaylight.mwtn.config.impl.EsConfig;
import org.opendaylight.mwtn.config.impl.HtDevicemanagerConfiguration;
import org.opendaylight.mwtn.config.impl.HtDevicemanagerConfiguration.IConfigChangedListener;
import org.opendaylight.mwtn.config.impl.HtLogger;
import org.opendaylight.mwtn.config.impl.PmConfig;

public class ConfigTest {

	public static void main(String[] args)
	{
		HtLogger.initConsole(Level.DEBUG);
			HtDevicemanagerConfiguration config = HtDevicemanagerConfiguration.getTestConfiguration();
			DcaeConfig c=config.getDcae();
			EsConfig c3=config.getEs();
			AaiConfig c4 = config.getAai();
			PmConfig c5 = config.getPm();
			System.out.println(c.toString());
			System.out.println(c3.toString());
			System.out.println(c4.toString());
			System.out.println(c5.toString());
			IConfigChangedListener listener = new IConfigChangedListener() {

				@Override
				public void onConfigChanged() {
					System.out.println("sth changed");
					AaiConfig c=AaiConfig.reload();
					System.out.println(c.toString());
				}
			};
			System.out.println("start listening for changes");

			config.registerConfigChangedListener(listener );
			try {
				Thread.sleep(50000);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			config.unregisterConfigChangedListener(listener);
			System.out.println("finished");
	}
}
