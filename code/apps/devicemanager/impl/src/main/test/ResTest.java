import java.io.IOException;
import java.util.List;

import org.apache.log4j.Level;
import org.json.JSONException;
import org.json.JSONObject;
import org.opendaylight.mwtn.base.internalTypes.Resources;
import org.opendaylight.mwtn.config.impl.HtLogger;

public class ResTest {

	private static void testDuplicateKeyJSON()
	{
		try
		{
			String str=Resources.getFileContent("/elasticsearch/index/mwtn/modelDescription/CoreModel-ForMicrowave.json");

			JSONObject o=new JSONObject(str) {

				@Override
				public JSONObject putOnce(String key, Object value) throws JSONException {


						Object storedValue;
						if (key != null && value != null) {
							if ((storedValue = this.opt(key)) != null ) {
								if(!storedValue.equals(value)) {                         //Only through Exception for different values with same key
									//Replace
									System.out.println("duplicate found");
									this.remove(key);
									this.put(key, value);

								} else
									return this;
							}
							else
								this.put(key, value);
						}
						return this;
				}
			};
			System.out.println(o.toString());
		}
		catch(IOException err)
		{
				err.printStackTrace();
		}
	}
	public static void main(String[] args)
	{
		HtLogger.initConsole(Level.DEBUG);
		JSONObject o=Resources.getJSONFile("/elasticsearch/index/sdnevents/sdneventsMapping.json");
		System.out.println(o==null?"null":o.toString());

		List<JSONObject> list=Resources.getJSONFiles("/elasticsearch/index", true);
		System.out.println("found "+list.size()+" valid json files");

		testDuplicateKeyJSON();

	}
}
