import org.opendaylight.mwtn.impl.websocket.SyncWebSocketClient;

public class WebsocketClientTest {

	private static final int PORT = 8085;

	public static void main(String[] args)
	{

		String remoteAddress="192.168.178.142";
		String message="hier könnte ihre werbung stehen";
		SyncWebSocketClient wsclient=null;
		try {
			wsclient=new SyncWebSocketClient(String.format("ws://%s:%d/websocket", remoteAddress,PORT));
			if(!wsclient.isOpen())
				wsclient.openAndSendAsync(message);
			System.out.println("sending succeeded");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		finally
		{

		}
		System.out.println("finished");

	}
}
