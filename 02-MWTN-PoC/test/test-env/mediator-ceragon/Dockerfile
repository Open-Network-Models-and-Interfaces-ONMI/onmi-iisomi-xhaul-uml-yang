FROM debian


# install required packages
RUN ["apt-get", "update"]
RUN ["apt-get", "install", "-y", "git", "autoconf", "gcc", "libtool", "libxml2-dev", "libssl-dev", "make", "libncurses5-dev", "libssh2-1-dev", "openssh-server", "vim"]

 
# setup 'compila' user that openyuma will use
RUN set -x -e; \
    mkdir /var/run/sshd; \
    adduser --gecos '' --disabled-password compila; \
    echo "compila:compila+" | chpasswd


# copy the mediator
WORKDIR /root
COPY . /root


# clone openyuma and apply patches
RUN git clone https://github.com/OpenClovis/OpenYuma
RUN mv agt_val.c OpenYuma/netconf/src/agt/


# build openyuma
WORKDIR /root/OpenYuma
RUN set -x -e; \
    make; \
    make install; \
    printf 'Port 830\nSubsystem netconf "/usr/sbin/netconf-subsystem --ncxserver-sockname=830@/tmp/ncxserver.sock"\n' >> /etc/ssh/sshd_config; \ 
    printf '#!/bin/bash\nset -e\n/usr/sbin/netconfd --no-startup --superuser=compila --log=/dev/null --module=CoreModel-CoreNetworkModule-ObjectClasses --module=MicrowaveModel-ObjectClasses-MwConnection &\nsleep 1\n/usr/sbin/sshd -D &\nwait\nkill %%\n' > /root/start.sh; \
    chmod 0755 /root/start.sh


# build mediator
WORKDIR /root/yang-modules
RUN set -x -e; \
    make; \
    make install;


# finishing touches
EXPOSE 22
EXPOSE 830

