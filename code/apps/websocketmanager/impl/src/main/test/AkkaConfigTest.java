import org.opendaylight.mwtn.impl.utils.AkkaConfig;

public class AkkaConfigTest {

	public static void main(String[] args) {

		try {
			AkkaConfig cfg = AkkaConfig
					.load("/home/herbert/odl/distribution-karaf-0.6.1-Carbon/configuration/initial/akka.conf");
			System.out.println("config loaded successfully");
			System.out.println("==========================");
			System.out.println(cfg.toString());
			System.out.println("==========================");
			for(AkkaConfig.ClusterNodeInfo info:cfg.getClusterConfig().getSeedNodes())
				System.out.println("isme="+cfg.getClusterConfig().isMe(info));

		} catch (Exception e) {

			e.printStackTrace();
		}
	}
}
