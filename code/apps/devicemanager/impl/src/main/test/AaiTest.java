import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Level;
import org.opendaylight.mwtn.aaiConnector.impl.AaiProviderClient;
import org.opendaylight.mwtn.base.internalTypes.InventoryInformation;
import org.opendaylight.mwtn.config.impl.HtDevicemanagerConfiguration;
import org.opendaylight.mwtn.config.impl.HtLogger;

public class AaiTest {

	public static void main(String[] args)
	{
		HtLogger.initConsole(Level.TRACE);
		HtDevicemanagerConfiguration cfg=HtDevicemanagerConfiguration.getTestConfiguration();

		AaiProviderClient provider = new AaiProviderClient(cfg, null);

		String mountPointName = "testDevice 01";
		String type="Unit";
		String model="Horizon Compact+";
		String vendor="DragonWave-X";
		String ipv4="127.0.0.1";
		String ipv6="::1";
		List<String> ifInfos = new ArrayList<String>();
		ifInfos.add("LP-MWPS-RADIO");
		InventoryInformation ii=new InventoryInformation(type, model, vendor, ipv4, ipv6, ifInfos);
		System.out.println("registering device");
		provider.onDeviceRegistered(mountPointName,ii);
		try {
			Thread.sleep(5000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		System.out.println("unregistering device");
		provider.onDeviceUnregistered(mountPointName);
		System.out.println("finished");
		try {
			provider.close();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
