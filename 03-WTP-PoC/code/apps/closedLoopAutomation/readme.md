# Closed loop automation

The app gets triggered: 
-       Manually by a button on a GUI 
-       By a timer event 
o    Polling, for example every 300s 
o    Scheduler, for example every day at 13:30 local time 
-       By a notification from the device. 
 
Then the app retrieves information from the affected device or for all devices. 
Then the app takes a decision based in the information 
-       Ether all is ok -> no further action 
-       Or something is not ok -> an actions is triggered 
 
Actions could be: 
-       Send an alarm to notify a user or another application 
-       Change the configuration in the device. 
-       Log the decision and the configuration 
 

