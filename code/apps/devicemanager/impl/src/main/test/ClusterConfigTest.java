import org.opendaylight.mwtn.config.impl.AkkaConfig;
import org.opendaylight.mwtn.config.impl.GeoConfig;
import org.opendaylight.mwtn.config.impl.HtDevicemanagerConfiguration;

public class ClusterConfigTest {

	public static void main(String[] args)
	{
		final String geoconf="/home/herbert/Nextcloud/captured-karaf-logs/geo.conf";
		final String akkconf="/home/herbert/Nextcloud/captured-karaf-logs/akka.conf";
		final String devmgrprop="";


		try {
			GeoConfig geo = geoconf==null?null:GeoConfig.load(geoconf);
			AkkaConfig akkaConfig = AkkaConfig.load(akkconf);
			//HtDevicemanagerConfiguration config = HtDevicemanagerConfiguration.getTestConfiguration(devmgrprop);
			String hostName = "0.0.0.0";
		hostName=akkaConfig.getClusterConfig().getHostName(hostName);
		String clusterDBName=akkaConfig.getClusterConfig().getDBClusterName(null);
		String nodeName=String.format("node%d.%s",akkaConfig.getClusterConfig().getRoleMemberIndex(),clusterDBName);

		System.out.println("hostname="+hostName);
		System.out.println("clusterdbName="+clusterDBName);
		System.out.println("nodename="+nodeName);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		}
}
