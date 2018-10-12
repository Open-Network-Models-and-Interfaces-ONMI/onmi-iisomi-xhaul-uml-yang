package org.opendaylight.mwtn.base.netconf;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.opendaylight.yang.gen.v1.urn.ietf.params.xml.ns.yang.ietf.yang.types.rev130715.DateAndTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class NetconfTimeStamp {
    private static final Logger LOG = LoggerFactory.getLogger(NetconfTimeStamp.class);

    private static final TimeZone TIMEZONEUTC = TimeZone.getTimeZone("GMT");
    private static final SimpleDateFormat dateFormatResult = init("yyyy-MM-dd'T'HH:mm:ss.S'Z'",TIMEZONEUTC);
    private static final SimpleDateFormat dateFormatConvert = init("yyyy-MM-dd HH:mm:ss.S", TIMEZONEUTC);
    private static int MILLISECONDSDIGITS = 3; //Digits of milliseconds  in dateFormatResult
    private static String MILLISECONDZEROS = "000"; //String with zeros for milliseconds in dateFormatResult
    /*
    private static final Pattern dateNetconfPatter[] = {
            // 10 Groups, 1-7,9+10, ISO8601
            Pattern.compile("(\\d{4})-(\\d{2})-(\\d{2})T(\\d{2}):(\\d{2}):(\\d{2})\\.(\\d+)?(Z|([+-]\\d{2}):(\\d{2}))"),
            // 10 Groups, 1-7,9+10, Microwave ONF
            Pattern.compile("(\\d{4})(\\d{2})(\\d{2})(\\d{2})(\\d{2})(\\d{2}).(\\d+)?(Z|([+-]\\d{2})(\\d{2}))"),
            // 9 Groups, 1-6, 8+9Ericson. Example: 2017-01-23T13:32:38-05:00
            Pattern.compile("(\\d{4})-(\\d{2})-(\\d{2})T(\\d{2}):(\\d{2}):(\\d{2})?(Z|([+-]\\d{2}):(\\d{2}))")
    };
     */
    private static final Pattern dateNetconfPatter = Pattern
            // Formats:
            //      1) ISO8601. Example 2017-01-18T11:44:49.482-05:00
            //      2) Microwave ONF. Examples 20170118114449.1Z, 20170118114449.1-0500
            //      3.1) Ericson. Example: 2017-01-23T13:32:38-05:00
            //      3.2) Ericson. Example: 2017-01-23T13:32-05:00
            // Always 10 Groups,
            //          1:Year   2:Month   3:day     4:Hour   5:minute      6:optional sec 7:optional ms 8:optioal Z or 9:offset signedhour 10:min
            .compile("(\\d{4})-?(\\d{2})-?(\\d{2})T?(\\d{2}):?(\\d{2})(?:(?::?)(\\d{2}))?(?:.(\\d+))?(?:(Z)|([+-]\\d{2}):?(\\d{2}))");


    /* ------------------------------------
     * Construct
     */

    /**
     * Do not provide public constructor for this static module
     */

    private NetconfTimeStamp() {
    }

    /**
     * Static initialization
     *//*
    private static void doInit() {
        LOG.debug("Init begin");
        //dateFormatResult =new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        dateFormatResult =new SimpleDateFormat("yyyyMMddHHmmss.S'Z'"); //Netconf 1.0 format
        dateFormatResult.setTimeZone(TIMEZONEUTC);
        dateFormatConvert =new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.S");
        dateFormatConvert.setTimeZone(TIMEZONEUTC);
        LOG.debug("Init end");
    }*/

    public static SimpleDateFormat init(String format, TimeZone zone ) {
        SimpleDateFormat dateFormat;
        dateFormat = new SimpleDateFormat(format);
        dateFormat.setTimeZone(zone);
        return dateFormat;
    }

    /* ------------------------------------
     * Public function
     */

    /**
     * Get actual timestamp as NETCONF specific type NETCONF/YANG 1.0 Format
     * @return String with Date in NETCONF/YANG Format Version 1.0.
     */
    public static String getTimeStampAsNetconfString() {
        /*if (dateFormatResult == null) {
            doInit();
        }*/
        return getRightFormattedDate(new Date().getTime());
    }

    /**
     * Get actual timestamp as NETCONF specific type NETCONF/YANG 1.0 Format
     * @return DateAndTime Type 1.0. Date in NETCONF/YANG Format Version 1.0.
     */
    public static DateAndTime getTimeStamp() {
        /*if (dateFormatResult == null) {
            doInit();
        }*/
        //Time in GMT
        return DateAndTime.getDefaultInstance(getTimeStampAsNetconfString());
    }

    /*
     * Input ist in folgenden Formaten, die über Netconf empfangen wurden möglich:
     *
     * Format1
     *        ISO 8601
     *        2017-01-18T11:44:49.482-05:00
     *
     * Format2 Netconf
     *        Netconf - pattern aus ietf-yang-types "2013-07-15"
     *        Pattern: "\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[\+\-](\d{2}):(\d{2}))"
     *
     * Format3 Netconf
     *        (Netconf) DateAndTime CoreModel-CoreFoundationModule-TypeDefinitions vom 2016-07-01
     *        Example1: 20170118114449.1Z
     *        Example2: 20170118114449.1-0500
     *        Pattern: "\d{4}\d{2}\d{2}\d{2}\d{2}\d{2}.\d+?(Z|[\+\-](\d{2})(\d{2}))"
     *          typedef DateAndTime {
     *                description "This primitive type defines the date and time according to the following structure:
     *                    'yyyyMMddhhmmss.s[Z|{+|-}HHMm]' where:
     *                    yyyy    '0000'..'9999'    year
     *                    MM        '01'..'12'            month
     *                    dd        '01'..'31'            day
     *                    hh        '00'..'23'            hour
     *                    mm        '00'..'59'            minute
     *                    ss        '00'..'59'            second
     *                    s        '.0'..'.9'            tenth of second (set to '.0' if EMS or NE cannot support this granularity)
     *                    Z        'Z'                    indicates UTC (rather than local time)
     *                    {+|-}    '+' or '-'            delta from UTC
     *                    HH        '00'..'23'            time zone difference in hours
     *                    Mm        '00'..'59'            time zone difference in minutes.";
     *                type string;
     *            }
     * Format4 E/// specific
     *         Example1: 2017-01-23T13:32:38-05:00
     *         Example2: 2017-01-23T13:32-05:00
     *
     * @param netconfTime as String according the formats given above
     * @return String in ISO8601 Format for database and presentation.
     */

    /**
    * Return the String with a NETCONF time converted to long
    * @param netconfTime as String according the formats given above
    * @return Epoch milliseconds
    * @throws IllegalArgumentException In case of no compliant time format definition for the string
    * @throws ParseException Time parsing failed
    */
   public static long getTimeStampFromNetconfAsMilliseconds( String netconfTime ) throws IllegalArgumentException, ParseException {
       /*if (dateFormatResult == null) {
           doInit();
       }*/
       Matcher m;
       {
           m = dateNetconfPatter.matcher(netconfTime);
           //According to spezified matches there have to be 10 parameter
           if (m.matches() && m.groupCount() == 10) {
               //Convert now
                  long utcMillis = dateFormatConvert.parse(getTimeAsNormalizedString(m, m.group(6), m.group(7))).getTime()
                               - getTimezoneOffsetMilliseconds(m.group(9), m.group(10));
                  return utcMillis;
           } else {
               throw new IllegalArgumentException("No pattern for NETCONF data string: "+netconfTime);
           }
       }
   }

   /**
    * Deliver String result.
    * @param netconfTime as String according the formats given above
    * @return If successful: String in ISO8601 Format for database and presentation.
    * If "wrong formed input" the Input string with the prefix "Mailformed date" is delivered back.
    */
    public static String getTimeStampFromNetconf( String netconfTime ) {
        /*if (dateFormatResult == null) {
            doInit();
        }*/
        Matcher m;
        {
            m = dateNetconfPatter.matcher(netconfTime);
            //According to spezified matches there have to be 10 parameter
            if (m.matches() && m.groupCount() == 10) {
                //Convert now
                try {
                    long utcMillis = dateFormatConvert.parse(getTimeAsNormalizedString(m, m.group(6), m.group(7))).getTime()
                            - getTimezoneOffsetMilliseconds(m.group(9), m.group(10));
                    return getRightFormattedDate(utcMillis);
                } catch (ParseException e) {
                    LOG.info(e.getMessage());
                } catch (IllegalArgumentException e) {
                    LOG.info(e.getMessage());
                }
            }
        }
        LOG.debug("No pattern for NETCONF data string: {}",netconfTime);
        return "Malformed date: "+netconfTime; //Error handling
    }
    /*-------------------------------------------
     * Private and static functions
     */
    /**
     * Convert timeZone parameter in format [+-]/d/d:/d/d into milliseconds
     * @param m Index 9 with "+/-" and hour string or null for UTZ, Index 10 with minutes
     * @return long milliseconds of TimeZoneOffset
     * @throws IllegalArgumentException If parameters are wrong
     */
    private static long getTimezoneOffsetMilliseconds(String timeZoneHour, String timeZoneMinute) throws IllegalArgumentException {
        //-- Calculate timezone specific offset
        long timeZoneOffsetMilliseconds = 0;
        if (timeZoneHour != null) {
            //Time zone offset in hours and minutes
            int tzHour = 0;
            int tzMinutes = 0;
            tzHour = Integer.valueOf(timeZoneHour);
            if (timeZoneMinute != null) {
                tzMinutes = Integer.valueOf(timeZoneMinute);
            } else {
                throw new IllegalArgumentException("Problem in Netconf Time format timeZone minutes parameter.");
            }
            timeZoneOffsetMilliseconds = (tzHour * 60 + (tzHour > 0 ? tzMinutes : -tzMinutes))*60000;
        }
        return timeZoneOffsetMilliseconds;
    }
    /**
     * Convert parameters to String with year .. minutes and optional Seconds and  .. milliseconds
     * @param m Matcher with parsed date
     * @param secString Seconds as String or null
     * @param msString Milliseconds as String or null
     * @return Normalized time string
     */
    private static String getTimeAsNormalizedString(Matcher m, String secString, String msString) {
        //-- Create time as normalized string
        StringBuffer sb = new StringBuffer();
        sb.append(m.group(1)); //year
        sb.append('-');
        sb.append(m.group(2)); //Month
        sb.append('-');
        sb.append(m.group(3)); //Day
        sb.append(' ');
        sb.append(m.group(4)); //Hour 0-23
        sb.append(':');
        sb.append(m.group(5)); //Minute
        sb.append(':');
        sb.append(secString != null ? secString : "00"); //Seconds (optional)
        sb.append('.');
        if (msString == null) { //Milliseconds optional
            sb.append(MILLISECONDZEROS);
        } else if (msString.length() <= MILLISECONDSDIGITS) {
            sb.append(msString); //Millisecond
            sb.append(MILLISECONDZEROS.substring(0, MILLISECONDSDIGITS-msString.length()));
        } else {
            sb.append(msString.substring(0, MILLISECONDSDIGITS )); //Only first Three
        }
        return sb.toString();
    }
    /**
     * Deliver format in a way that milliseconds are correct.
     * @param dateMillis Date as milliseconds in Java definition
     * @return String
     */
    private static String getRightFormattedDate( long dateMillis ) {
        /*if (dateFormatResult == null) {
            doInit();
        }*/
        long tenthOfSeconds = dateMillis % 1000/100L; //Extract 100 milliseconds
        long base = dateMillis / 1000L * 1000L; //Cut milliseconds to 000
        Date newDate = new Date( base + tenthOfSeconds);
        return dateFormatResult.format(newDate);
    }
}
