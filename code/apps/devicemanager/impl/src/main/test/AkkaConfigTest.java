import org.opendaylight.mwtn.config.impl.AkkaConfig;
import org.opendaylight.mwtn.config.impl.AkkaConfig.ClusterNodeInfo;

public class AkkaConfigTest {

	private static String getAkkaConfigSingleNodeText()
	{
return "\n" +
		"odl-cluster-data {\n" +
		"  akka {\n" +
		"    remote {\n" +
		"      artery {\n" +
		"        enabled = off\n" +
		"        canonical.hostname = \"127.0.0.1\"\n" +
		"        canonical.port = 2550\n" +
		"      }\n" +
		"      netty.tcp {\n" +
		"        hostname = \"127.0.0.1\"\n" +
		"        port = 2550\n" +
		"      }\n" +
		"      # when under load we might trip a false positive on the failure detector\n" +
		"      # transport-failure-detector {\n" +
		"        # heartbeat-interval = 4 s\n" +
		"        # acceptable-heartbeat-pause = 16s\n" +
		"      # }\n" +
		"    }\n" +
		"\n" +
		"    cluster {\n" +
		"      # Remove \".tcp\" when using artery.\n" +
		"      seed-nodes = [\"akka.tcp://opendaylight-cluster-data@127.0.0.1:2550\"]\n" +
		"\n" +
		"      roles = [\n" +
		"        \"member-1\"\n" +
		"      ]\n" +
		"\n" +
		"    }\n" +
		"\n" +
		"    persistence {\n" +
		"      # By default the snapshots/journal directories live in KARAF_HOME. You can choose to put it somewhere else by\n" +
		"      # modifying the following two properties. The directory location specified may be a relative or absolute path. \n" +
		"      # The relative path is always relative to KARAF_HOME.\n" +
		"\n" +
		"      # snapshot-store.local.dir = \"target/snapshots\"\n" +
		"      # journal.leveldb.dir = \"target/journal\"\n" +
		"\n" +
		"      journal {\n" +
		"        leveldb {\n" +
		"          # Set native = off to use a Java-only implementation of leveldb.\n" +
		"          # Note that the Java-only version is not currently considered by Akka to be production quality.\n" +
		"\n" +
		"          # native = off\n" +
		"        }\n" +
		"      }\n" +
		"    }\n" +
		"  }\n" +
		"}";
	}
	private static String getAkkaConfigClusterNodeText()
	{
		return "\n" +
				"odl-cluster-data {\n" +
				"\n" +
				"  akka {\n" +
				"    loglevel = \"\"\n" +
				"    remote {\n" +
				"      netty.tcp {\n" +
				"        hostname = \"zltcmtn23arbc01.2f0377.mtn23a.tci.att.com\"\n" +
				"        port = 2550\n" +
				"      }\n" +
				"    }\n" +
				"    actor {\n" +
				"    debug{\n" +
				"        autoreceive = on\n" +
				"        lifecycle = on\n" +
				"        unhandled = on\n" +
				"        fsm = on\n" +
				"        event-stream = on\n" +
				"     }\n" +
				"    }\n" +
				"    cluster {\n" +
				"      seed-nodes = [\"akka.tcp://opendaylight-cluster-data@zltcmtn23arbc01.2f0377.mtn23a.tci.att.com:2550\", \"akka.tcp://opendaylight-cluster-data@zltcmtn23arbc02.2f0377.mtn23a.tci.att.com:2550\", \"akka.tcp://opendaylight-cluster-data@zltcmtn23arbc03.2f0377.mtn23a.tci.att.com:2550\", \"akka.tcp://opendaylight-cluster-data@zltcmtn23brbc01.f84e7a.mtn23b.tci.att.com:2550\", \"akka.tcp://opendaylight-cluster-data@zltcmtn23brbc02.f84e7a.mtn23b.tci.att.com:2550\", \"akka.tcp://opendaylight-cluster-data@zltcmtn23brbc03.f84e7a.mtn23b.tci.att.com:2550\"]\n" +
				"      seed-node-timeout = 15s\n" +
				"      roles = [\"member-1\"]\n" +
				"\n" +
				"    }\n" +
				"    persistence {\n" +
				"    journal-plugin-fallback {\n" +
				"         circuit-breaker {\n" +
				"            max-failures = 10\n" +
				"            call-timeout = 60s\n" +
				"            reset-timeout = 30s\n" +
				"         }\n" +
				"     }\n" +
				"    }\n" +
				"  }\n" +
				"}\n" +
				"\n" +
				"odl-cluster-rpc {\n" +
				"\n" +
				"  akka {\n" +
				"    loglevel = \"\"\n" +
				"    remote {\n" +
				"      netty.tcp {\n" +
				"        hostname = \"zltcmtn23arbc01.2f0377.mtn23a.tci.att.com\"\n" +
				"        port = 2551\n" +
				"      }\n" +
				"    }\n" +
				"    actor {\n" +
				"    debug{\n" +
				"        autoreceive = on\n" +
				"        lifecycle = on\n" +
				"        unhandled = on\n" +
				"        fsm = on\n" +
				"        event-stream = on\n" +
				"     }\n" +
				"    }\n" +
				"    cluster {\n" +
				"	seed-nodes = [\"akka.tcp://odl-cluster-rpc@zltcmtn23arbc01.2f0377.mtn23a.tci.att.com:2551\", \"akka.tcp://odl-cluster-rpc@zltcmtn23arbc02.2f0377.mtn23a.tci.att.com:2551\", \"akka.tcp://odl-cluster-rpc@zltcmtn23arbc03.2f0377.mtn23a.tci.att.com:2551\", \"akka.tcp://odl-cluster-rpc@zltcmtn23brbc01.f84e7a.mtn23b.tci.att.com:2551\", \"akka.tcp://odl-cluster-rpc@zltcmtn23brbc02.f84e7a.mtn23b.tci.att.com:2551\", \"akka.tcp://odl-cluster-rpc@zltcmtn23brbc03.f84e7a.mtn23b.tci.att.com:2551\"]\n" +
				"        seed-node-timeout = 15s\n" +
				"    }\n" +
				"    persistence {\n" +
				"    journal-plugin-fallback {\n" +
				"         circuit-breaker {\n" +
				"            max-failures = 10\n" +
				"            call-timeout = 60s\n" +
				"            reset-timeout = 30s\n" +
				"         }\n" +
				"     }\n" +
				"     }\n" +
				"  }\n" +
				"}\n" +
				"\n" +
				"";
	}
	public static void main(String[] args)
	{
		AkkaConfig cfg;
		try {
			System.out.println("testing clusternode config1");
			System.out.println("===========================");
			cfg = AkkaConfig.parse(getAkkaConfigClusterNodeText());
			System.out.println("succeeded: ");
			System.out.println(cfg.toString());
			System.out.println(String.format("found %d cluster nodes",cfg.getClusterConfig().getSeedNodes().size()));
			for(ClusterNodeInfo n : cfg.getClusterConfig().getSeedNodes())
			{
				System.out.println(n.toString());
			}
		} catch (Exception e) {
			System.out.println("failed: "+e.getMessage());
		}
		try {
			System.out.println("testing singlenode config1");
			System.out.println("===========================");
			cfg = AkkaConfig.parse(getAkkaConfigSingleNodeText());
			System.out.println("succeeded: ");
			System.out.println(cfg.toString());
		} catch (Exception e) {
			System.out.println("failed: "+e.getMessage());
		}

	}
}
