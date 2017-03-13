sed -f sed-script.txt boot_time_callbacks.c.ori > boot_time_callbacks.c
sed -f sed-script.txt dvm_boot_time_callbacks.c.ori > dvm_boot_time_callbacks.c
sed -f sed-script.txt dvm_runtime_callbacks.c.ori > dvm_runtime_callbacks.c
sed -f sed-script.txt runtime_callbacks.c.ori > runtime_callbacks.c
sed -f sed-script.txt configuration_callbacks.c.ori > configuration_callbacks.c
