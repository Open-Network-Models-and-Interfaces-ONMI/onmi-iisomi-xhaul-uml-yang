
public class UntilTest {

	public static void main(String[] args) {

		System.out.println("Test");
        int retry=0, maxRetries=3;
        boolean noErrorIndication=false;

		do {

			if (retry > 0)
				System.out.println("Sleep");
			noErrorIndication = retry == 0;
			System.out.println(retry+ "  " + noErrorIndication);

		} while (noErrorIndication == false && retry++ < maxRetries);

		System.out.println("Done "+noErrorIndication+" "+retry);
	}

}
