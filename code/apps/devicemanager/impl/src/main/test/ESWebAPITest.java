import java.io.IOException;

import org.json.JSONException;
import org.json.JSONObject;
import org.opendaylight.mwtn.base.database.HtDatabaseWebAPIClient;

public class ESWebAPITest {

	public static void main(String[] args)
	{
		HtDatabaseWebAPIClient client=new HtDatabaseWebAPIClient();
		try {
			String response=client.sendRequest("/mwtn/mediator-server/_search", "GET", new JSONObject("{\"match\":{\"id\":id}}"));
			System.out.println(response);
		} catch (JSONException | IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
