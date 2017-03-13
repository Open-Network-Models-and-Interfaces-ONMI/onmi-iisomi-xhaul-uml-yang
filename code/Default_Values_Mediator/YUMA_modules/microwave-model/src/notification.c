
/* 
 * FILE: notification.c
 */

#include <xmlstring.h>

#include "procdefs.h"
#include "agt.h"
#include "agt_cb.h"
#include "agt_not.h"
#include "agt_timer.h"
#include "agt_util.h"
#include "dlq.h"
#include "ncx.h"
#include "ncx_feature.h"
#include "ncxmod.h"
#include "ncxtypes.h"
#include "ses.h"
#include "status.h"
#include "val.h"
#include "val_util.h"
#include "xml_util.h"
#include "u_microwave-model.h"
#include "y_microwave-model.h"



#include "utils.h"
#include <pthread.h>
#include <time.h>
#include <math.h>


/* put your static variables here */

static pthread_t gen_notif_thread;


static void generateNotification()
{
	xmlChar buffer[256];
	int n = 0, freq = 0, attrValChangedcounter = 0, problemNotificationCounter;
	int nr = 0;
	char nr_extension[20];
	int cleared[21];

	for (int t=0; t < 20; t++) {
		cleared[t] = 0;
	}

	xmlChar dateAndTime[256];

	const xmlChar evalPath[1000], *resultString;
	sprintf(evalPath, "/data/mw-notifications/notification-timeout");

	resultString = get_value_from_xpath(evalPath);
	if (resultString)
	{
		freq = strtol(resultString, NULL, 10);
		free(resultString);
	}

	YUMA_ASSERT(freq == 0, return, "No eventFrequency configured. Not generating any notifications.");

    while (TRUE)
    {
    	time_t t = time(NULL);
    	struct tm tm = *localtime(&t);
    	struct timeval tv;

    	gettimeofday(&tv, NULL);
    	int millisec;
    	millisec = lrint(tv.tv_usec/1000.0); // Round to nearest millisec
    	if (millisec>=1000)
    	{ // Allow for rounding up to nearest second
    		millisec -=1000;
    		tv.tv_sec++;
    		millisec /= 100;
    	}

    	sprintf(dateAndTime, "%04d-%02d-%02dT%02d:%02d:%02d.%01d+00:00",
			tm.tm_year + 1900, tm.tm_mon + 1, tm.tm_mday, 
			tm.tm_hour, tm.tm_min, tm.tm_sec, millisec/100);

	if (nr == 0) {
		sprintf(nr_extension,"");
	} else {
    		sprintf(nr_extension, "%d", nr);
	}

    	sprintf(evalPath, "/data/mw-notifications/problem-notification/problem-name%s",nr_extension);
    	resultString = get_value_from_xpath(evalPath);

    	if (resultString)
    	{
    		sprintf(evalPath, "/data/mw-notifications/problem-notification/obj-id-ref%s",nr_extension);
    		char* objIdRef = get_value_from_xpath(evalPath);
		char* severity;

		if (cleared[nr] == 0) {
                sprintf(evalPath, "/data/mw-notifications/problem-notification/severity%s",nr_extension);
			severity = get_value_from_xpath(evalPath);
			cleared[nr] = 1;
		} else {
    			sprintf(evalPath, "/data/mw-notifications/problem-notification/cleared%s",nr_extension);
			severity = get_value_from_xpath(evalPath);
			cleared[nr] = 0;
		}

		u_microwave_model_problem_notification_send(problemNotificationCounter++, dateAndTime, objIdRef, resultString, severity);
		free(objIdRef);
		free(severity);
		free(resultString);

		nr++;
		if (nr >= 20) {
			nr = 0;
		}
    	} else {
        	nr = 0;
        }		

    	sprintf(evalPath, "/data/mw-notifications/problem-notification/attribute-name");
		resultString = get_value_from_xpath(evalPath);

		if (resultString)
		{
			sprintf(evalPath, "/data/mw-notifications/problem-notification/obj-id-ref");
			char* objIdRef = get_value_from_xpath(evalPath);

			sprintf(evalPath, "/data/mw-notifications/problem-notification/new-value");
			char* newValue = get_value_from_xpath(evalPath);

			u_microwave_model_attribute_value_changed_notification_send(attrValChangedcounter++,
					dateAndTime,
					objIdRef,
					resultString,
					newValue);

			free(objIdRef);
			free(newValue);
			free(resultString);
		}
    	sleep(freq);
    }
}

status_t notifications_init (void)
{
    status_t res = NO_ERR;

    if(pthread_create(&gen_notif_thread, NULL, generateNotification, NULL))
    {
    	YUMA_ASSERT(TRUE, return ERR_INTERNAL_VAL, "Could not create thread for generating notifications!");
    }

    return NO_ERR;
}

/********************************************************************
* FUNCTION notifications_cleanup
* 
********************************************************************/
void notifications_cleanup (void)
{
   void *res;
   int ret;

   ret = pthread_cancel(gen_notif_thread);
   YUMA_ASSERT(ret != 0, return, "pthread_cancel Fail");

   /* Join with thread to see what its exit status was */

   ret = pthread_join(gen_notif_thread, &res);

   if (res == PTHREAD_CANCELED)
       log_debug("Notification thread was canceled\n");
   else
       log_debug("Notification thread wasn't canceled (shouldn't happen!)\n");

}

/* END u_MicrowaveModel_Notifications.c */
