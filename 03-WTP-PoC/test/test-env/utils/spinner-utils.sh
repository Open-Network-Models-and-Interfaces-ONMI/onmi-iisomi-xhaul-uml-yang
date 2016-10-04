#!/bin/bash
#
# spinner.sh - Display an awesome 'spinner' while running shell commands
#
# Authors: Tasos Latsas (original work)
#          Paolo Rovelli (extended spinner_exec)
#

function _spinner() {
    # $1 start/stop
    #
    # on start: $2 display message
    # on stop : $2 process exit status
    #           $3 spinner function pid (supplied from stop_spinner)

    local delay=${SPINNER_DELAY:-0.10}

    local on_success="done"
    local on_fail="fail"
    local white="\e[37m"
    local green="\e[32m"
    local red="\e[31m"
    local nc="\e[0m"

    case $1 in
        start)
            # display message and position the cursor in $column column
            echo -n ${2}" "

            i=1
            sp='\|/-'
            # start spinner
            while :
            do
                printf "\b${sp:i++%${#sp}:1}"
                sleep $delay
            done
            ;;
        stop)
            # let time to the spinner to run before killing it
            sleep $delay
            if [[ -z ${3} ]]; then
                exit 1
            fi
            kill $3 > /dev/null 2>&1

            # inform the user uppon success or failure
            echo -ne "\b"
            if [[ $2 -eq 0 ]]; then
                echo -e "${green}${on_success}${nc}"
            else
                echo -e "${red}${on_fail}${nc}"
            fi
            ;;
        *)
            echo "invalid argument, try {start/stop}"
            exit 1
            ;;
    esac
}

function spinner_start {
    # $1 : msg to display
    _spinner "start" "${1}" &
    # set global spinner pid
    _sp_pid=$!
    disown
}

function spinner_stop {
    # $1 : command exit status
    _spinner "stop" $1 $_sp_pid
    unset _sp_pid
}

function spinner_exec {
    # $1 : msg to display
    # ${@:2} : command to exec
    spinner_start "${1}"
    _err_msg=$("${@:2}" 2>&1)
    _err_code=$?
    spinner_stop ${_err_code}
    if [[ ${_err_code} -ne 0 ]]; then
        printf '%s\n' "${_err_msg[@]}"
    fi
    return ${_err_code}
}

