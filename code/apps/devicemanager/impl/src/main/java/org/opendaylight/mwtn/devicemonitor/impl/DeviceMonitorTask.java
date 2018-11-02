/**
 * @author herbert
 *
 */
package org.opendaylight.mwtn.devicemonitor.impl;

import java.util.Collections;
import java.util.EnumSet;
import java.util.Set;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

import org.opendaylight.mwtn.base.internalTypes.InternalSeverity;
import org.opendaylight.mwtn.base.netconf.util.NetconfTimeStamp;
import org.opendaylight.mwtn.devicemanager.impl.listener.ODLEventListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DeviceMonitorTask implements Runnable {

    private static final Logger LOG = LoggerFactory.getLogger(DeviceMonitorTask.class);
    private static final String LOGMARKER = "DMTick";

    private final String mountPointName;
    private final ODLEventListener odlEventListener;
    private final Checker checkConnectionToMediator;
    private final Checker checkConnectionToNe;

    private int tickCounter; //Added for each tick. Not relevant for internal status

    private ScheduledFuture<?> taskHandle;
    private final Object lock = new Object();    //USe top lock access to member ne
    private @Nullable DeviceMonitoredNe ne; //Indication if in status connect or disconnect
    private @Nonnull Boolean mountpointConnectingStateSupervision; //Indication of mountpoint supervision

    private Integer disconnectSupervisionTickout; //Tickcounter of task ticks for "not connected indication"
    private Set<DeviceMonitorProblems> currentProblems; //List with actual problems. Synchronized by itself

    /*------------------------------------------------------------
     * Construction
     */

    /**
     * Setup monitoring task
     * @param mountPointName to monitor
     * @param odlEventListener to forward problems to
     */
    public DeviceMonitorTask(String mountPointName, ODLEventListener odlEventListener) {
        LOG.debug("Init task {}", DeviceMonitorTask.class.getSimpleName());

        //Setup finals
        this.mountPointName = mountPointName;
        this.odlEventListener = odlEventListener;
        this.checkConnectionToMediator = new Checker() {
            @Override
            boolean isReachableOnce() {
                synchronized(lock) {
                    //mountpoint state "Connected"
                    //If for any reason the mountpoint is Connected, but Notconf messages are not received
                    return ne == null ? true : ne.checkIfConnectionToMediatorIsOk();
                }
            }
        };
        this.checkConnectionToNe = new Checker() {
            @Override
            boolean isReachableOnce() {
                synchronized(lock) {
                    //mountpoint state "Connected"
                    //If netconf mediator (netconf application software for NE) has connection loss to managed device.
                    //The networkelement object is available, but there is no interfacepack available.
                    return ne == null ? true : ne.checkIfConnectionToNeIsOk();
                }
            }
        };

        //Setup parameters
        this.taskHandle = null;
        this.tickCounter = 0;
        this.ne = null;
        this.mountpointConnectingStateSupervision = false;
        this.currentProblems = Collections.synchronizedSet(EnumSet.noneOf(DeviceMonitorProblems.class));
        this.disconnectSupervisionTickout = 0;

        int removed = odlEventListener.removeAllCurrentProblemsOfNode(mountPointName);
        LOG.debug("{} Init task removed fault entries {}", LOGMARKER, removed);

    }

    /**
     * Start for each object an own instance of the thread.
     * @param scheduler for all the threads.
     */
    public void start(ScheduledExecutorService scheduler) {
        LOG.info("{} {} DeviceMonitor task to create", LOGMARKER, tickCounter);
        if (taskHandle == null) {
            startDisconnectSupervision();
            taskHandle = scheduler.scheduleAtFixedRate(this, 0, 120, TimeUnit.SECONDS);
            LOG.info("DeviceMonitor task scheduled");
        } else {
            LOG.error("{} {} Task already running.", LOGMARKER, tickCounter);
        }
    }

    /**
     * Call after NE change state to connected.
     * Mountpoint exists. Status is Connecting.
     * @param neParam that connected
     */

    public void deviceConnectIndication(DeviceMonitoredNe neParam) {
        LOG.info("{} {} Connect {} and stop.", LOGMARKER, tickCounter, mountPointName);
        clear(DeviceMonitorProblems.connectionLossOAM);
        synchronized(lock) {
            this.ne = neParam;
            this.mountpointConnectingStateSupervision = false;
        }
        stopDisconnectSupervision();
    }

    /**
     * If ne is disconnected do the related actions.
     * - Mountpoint exists. Status is Connecting or UnableToConnect
     */

    public void deviceDisconnectIndication() {
        LOG.info("{} {} Disconnect {} and start.", LOGMARKER, tickCounter, mountPointName);
        clear(DeviceMonitorProblems.connectionLossOAM);
        synchronized(lock) {
            this.ne = null;
            this.mountpointConnectingStateSupervision = true;
        }
        startDisconnectSupervision();
    }

    /**
     * Do all actions to clean up the log if mountpoint has been deleted.
     * - Mountpoint removed
     * Prepare cancellation of the task and cancel task
     */

    public void removeMountpointIndication() {
         for (DeviceMonitorProblems problem : DeviceMonitorProblems.values()) {
            clear(problem);
        }
         //Cancel the task
         if (this.taskHandle != null) {
             this.taskHandle.cancel(false);
             LOG.info("{} {} DeviceMonitor task canceled for {}", LOGMARKER, tickCounter, mountPointName);
         } else {
             LOG.error("{} {} Task already stopped", LOGMARKER, tickCounter);
         }
    }

    /**
     * Referesh Alarms
     */
    public void refreshAlarms() {
        LOG.debug("{} Start refresh of all problems",LOGMARKER);
        synchronized(currentProblems) {
            for (DeviceMonitorProblems problem :    currentProblems) {
                LOG.debug("{} Refresh problem {} Raised-status {}",LOGMARKER, problem.name(), currentProblems.contains(problem));
                odlEventListener.onProblemNotification(mountPointName, problem.name(), problem.getSeverity());
            }
        }
        LOG.debug("{} Finish refresh of all problems",LOGMARKER);
    }

    /*------------------------------------------------------------
     * Functions to clear/raise alarm
     */

    /**
     * Raise a problem, but only once
     * @param problem
     */
    private void raise(DeviceMonitorProblems problem) {
        LOG.debug("{} Raise problem {} Raised-status {}",LOGMARKER, problem.name(), currentProblems.contains(problem));
        synchronized(currentProblems) {
            if (! currentProblems.contains(problem)) {
                currentProblems.add(problem);
                odlEventListener.onProblemNotification(mountPointName, problem.name(), problem.getSeverity());
            }
        }
    }

    /**
     * Raise a problem, but only once
     * @param problem
     */
    private void clear(DeviceMonitorProblems problem) {
        LOG.debug("{} Clear problem {} Raised-status {}",LOGMARKER, problem.name(), currentProblems.contains(problem));
        synchronized(currentProblems) {
            if (currentProblems.contains(problem)) {
                currentProblems.remove(problem);
                odlEventListener.onProblemNotification(mountPointName, problem.name(), InternalSeverity.NonAlarmed);
            }
        }
    }

    /**
     * Process problem notification cascade
     * @param isReachable
     * @param problem
     */
    private void clearRaiseIfConnected(Checker checker, DeviceMonitorProblems problem) {
        LOG.debug("{} check start {} problem {} Raised-status {}",LOGMARKER, tickCounter, problem.name(), currentProblems.contains(problem));
        if (checker.isConnected()) {
            clear(problem);
        } else {
            raise(problem);
        }
        LOG.debug("{} check end {} problem {} Raised-status {}",LOGMARKER, tickCounter, problem.name(), currentProblems.contains(problem));
    }

    /*------------------------------------------------------------
     * Functions to start/stop
     */

    private void startDisconnectSupervision() {
        synchronized(disconnectSupervisionTickout) {
            this.disconnectSupervisionTickout = 2;
        }
    }

    private void stopDisconnectSupervision() {
        synchronized(disconnectSupervisionTickout) {
            this.disconnectSupervisionTickout = 0;
        }
    }

    private boolean processDisconnectSupervisionAndCheckExceeded() {
        synchronized(disconnectSupervisionTickout) {
            if (disconnectSupervisionTickout == 0) {
                return true;
            } else if (disconnectSupervisionTickout > 0) {
                disconnectSupervisionTickout--;
            }
            return false;
        }
    }

    /*------------------------------------------------------------
     * TASK
     */

    /**
     * Task to monitor connectivity to Network Elements.
     * Connectivity problems lead to alarm indication.
     */
    @Override
    public void run() {

        try {
            LOG.debug("{} UTCTime {} START mountpoint {} tick {} connecting supervision {} tickout {}",
                    LOGMARKER,
                    NetconfTimeStamp.getTimeStamp(),
                    mountPointName,
                    tickCounter,
                    mountpointConnectingStateSupervision,
                    disconnectSupervisionTickout);

               if (mountpointConnectingStateSupervision) {
                   LOG.debug("{} {} Mountpoint supervision {}", LOGMARKER, tickCounter, mountPointName);
                   if (processDisconnectSupervisionAndCheckExceeded()) {
                       raise(DeviceMonitorProblems.connectionLossOAM);
                   }

               } else {
				synchronized (lock) {
				       if (ne != null) {
				           //checks during "Connected"
				           clear(DeviceMonitorProblems.connectionLossOAM); //Always cleared never raised
				           LOG.debug("{} {} Prepare check", LOGMARKER, tickCounter);
				           ne.prepareCheck();  // Prepare ne check
				           // Mediator check
				           LOG.debug("{} {} Mediator check", LOGMARKER, tickCounter);
				           clearRaiseIfConnected(checkConnectionToMediator, DeviceMonitorProblems.connectionLossMediator);

				           // NE check
				           LOG.debug("{} {} Ne check", LOGMARKER, tickCounter);
				           clearRaiseIfConnected(checkConnectionToNe, DeviceMonitorProblems.connectionLossNeOAM);
				       } else {
				           //Monitor switch off.
				           LOG.debug("{} {} Monitor switch off state", LOGMARKER, tickCounter);
				           clear(DeviceMonitorProblems.connectionLossOAM); //Always cleared never raised
				           clear(DeviceMonitorProblems.connectionLossMediator); //Always cleared never raised
				           clear(DeviceMonitorProblems.connectionLossNeOAM); //Always cleared never raised
				       }
				   }
			}
        } catch (Exception e) {
            //Prevent stopping the task
            LOG.warn("{} {} During DeviceMontoring task",LOGMARKER, tickCounter, e);
        }
        LOG.debug("{} {} END", LOGMARKER, tickCounter++);

    }
}
