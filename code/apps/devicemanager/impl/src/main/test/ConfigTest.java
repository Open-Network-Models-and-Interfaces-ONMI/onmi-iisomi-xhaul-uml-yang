import org.opendaylight.mwtn.config.impl.EcompConfig;
import org.opendaylight.mwtn.config.impl.EsConfig;
import org.opendaylight.mwtn.config.impl.HtDevicemanagerConfiguration;

public class ConfigTest {

	public static void main(String[] args)
	{
		//HtLogger.initConsole(Priority.DEBUG);
			HtDevicemanagerConfiguration config = HtDevicemanagerConfiguration.getConfiguration();
			EcompConfig c=config.getEcomp();
			EsConfig c3=config.getEs();
			System.out.println(c.toString());
			System.out.println(c3.toString());
	}
}
