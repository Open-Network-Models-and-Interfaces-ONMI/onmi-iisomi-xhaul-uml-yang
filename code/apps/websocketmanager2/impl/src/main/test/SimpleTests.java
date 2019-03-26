import java.io.File;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Iterator;
import org.json.JSONArray;
import org.json.JSONObject;

public class SimpleTests {


	private static void testURI()
	{
		String uri="/ms/1/api/";
		String query="task=getconfig";

		long id=0;
		String remoteUrl="";
		uri = uri.substring("/ms/".length());

		try {
			id = Long.parseLong(uri.substring(0, uri.indexOf("/")));
			uri=uri.substring(uri.indexOf("/"));
		} catch (Exception err) {
			System.out.println(err.getMessage());
		}

		if(id>0)
		{
		remoteUrl=baseUrl(id)+uri;
		if (query != null && query.length() > 0)
			remoteUrl += "?" + query;
		}
		System.out.println("url="+remoteUrl);
	}
	private static void testMSDBDataParser()
	{
		String resp="{\"took\":6,\"timed_out\":false,\"_shards\":{\"total\":5,\"successful\":5,\"failed\":0},\"hits\":{\"total\":2,\"max_score\":1.0,\"hits\":[{\"_index\":\"mwtn_v1\",\"_type\":\"mediator-server\",\"_id\":\"2\",\"_score\":1.0,\"_source\":{\"id\":2,\"name\":\"Server 2\",\"url\":\"http://mediatorsnmp.fritz.box:7070\"}},{\"_index\":\"mwtn_v1\",\"_type\":\"mediator-server\",\"_id\":\"1\",\"_score\":1.0,\"_source\":{\"id\":1,\"name\":\"Server 1\",\"url\":\"http://192.168.11.44:7070\"}}]}}";
		JSONObject ro=new JSONObject(resp);
		JSONArray a=ro.getJSONObject("hits").getJSONArray("hits");
		for(int i=0;i<a.length();i++)
		{
			JSONObject x=a.getJSONObject(i).getJSONObject("_source");
			System.out.println("id="+x.getLong("id")+" name=\""+x.getString("name")+"\" url=\""+x.getString("url")+"\"");
		}

	}

	 public static void walk(ArrayList<File> results, String path ) {

	        File root = new File( path );
	        File[] list = root.listFiles();

	        if (list == null) return;

	        for ( File f : list ) {
	            if ( f.isDirectory() ) {
	                walk(results, f.getAbsolutePath() );
	                //System.out.println( "Dir:" + f.getAbsoluteFile() );
	            }
	            else {
	                //System.out.println( "File:" + f.getAbsoluteFile() );
	                if(f.isFile() && f.getName().endsWith(".md") )
	                	results.add(f);
	            }
	        }
	    }
	private static void testFindMDs()
	{
		final String BASEURI = "/help";
		final int MAX_DEPTH = 10;
		String uri="/help/";//req.getRequestURI();
		Path basePath=new File("/home/herbert/odl/distribution-karaf-0.5.3-Boron-SR3").toPath();
		uri=uri.substring(BASEURI.length());
		try
		{
			ArrayList<File> mdfiles=new ArrayList<>();
			walk(mdfiles,basePath.toAbsolutePath().toString());
			JSONArray a=new JSONArray();
			Iterator<File> it=mdfiles.iterator();
			while(it.hasNext())
				a.put(it.next().toString().substring(basePath.toAbsolutePath().toString().length()));
			//resp.getOutputStream().println(a.toString());
			System.out.println(a.toString());

		}
		catch(Exception err)
		{
			err.printStackTrace();
		}
	}
	private static void folderTests()
	{
		Path basePath=new File("/home/herbert/odl/distribution-karaf-0.5.3-Boron-SR3").toPath();
		Path pHelp=basePath.resolve("help/");
		String uri="0.1.0-SNAPSHOT/OpenDaylight";
		System.out.println("phelp="+pHelp.toString());
		Path pUri=pHelp.resolve(uri);
		System.out.println("puri="+pUri.toString());
	}

	public static void main(String[] args)
	{
		//testURI();
		//testMSDBDataParser();
		//testFindMDs();
	}

	private static String baseUrl(long id) {
		return "http://test.tld:7021";
	}
}
