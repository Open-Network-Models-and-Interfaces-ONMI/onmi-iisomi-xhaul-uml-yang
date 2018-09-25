import java.time.ZonedDateTime;

import org.opendaylight.mwtn.maintenance.database.types.EsMaintenanceFilter;

public class ZonedDateTimeTimesTest {

	public static void main(String[] args) {


		EsMaintenanceFilter fi = new EsMaintenanceFilter();

		System.out.println("Default 1: "+fi);


		fi.setEndAsString("2018-01-01T10:00:00+05:00");

		System.out.println("Default 2: "+fi);

		System.out.println("As String: "+fi.getEndAsString());


		ZonedDateTime start = ZonedDateTime.parse("2018-01-01T10:00:00+05:00");
		ZonedDateTime end = ZonedDateTime.parse("2019-01-01T10:00:00+05:00");
		ZonedDateTime now;

		now = ZonedDateTime.parse("2017-05-01T10:00:00+05:00");
		System.out.println("Vor: "+EsMaintenanceFilter.isInPeriod(start, end, now));

		now = ZonedDateTime.parse("2018-05-01T10:00:00+05:00");
		System.out.println("in: "+EsMaintenanceFilter.isInPeriod(start, end, now));

		now = ZonedDateTime.parse("2019-05-01T10:00:00+05:00");
		System.out.println("nach: "+EsMaintenanceFilter.isInPeriod(start, end, now));

	}


}
