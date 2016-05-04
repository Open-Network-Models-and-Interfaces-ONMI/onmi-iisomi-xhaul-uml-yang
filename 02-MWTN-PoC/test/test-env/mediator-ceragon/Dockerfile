FROM debian


# install required packages
RUN ["apt-get", "update"]
RUN ["apt-get", "install", "-y", "git", "autoconf", "gcc", "libtool", "libxml2-dev", "libssl-dev", "make", "libncurses5-dev", "libssh2-1-dev", "openssh-server", "vim"]

 
# setup 'compila' user that openyuma will use
RUN set -x -e; \
    mkdir /var/run/sshd; \
    adduser --gecos '' --disabled-password compila; \
    echo "compila:compila+" | chpasswd


# build openyuma
WORKDIR /root
COPY ./*.patch /root/
RUN git clone https://github.com/OpenClovis/OpenYuma
WORKDIR /root/OpenYuma
RUN git apply /root/0001-fix-siae.patch
RUN git apply /root/0002-fix-wipro.patch
RUN set -x -e; \
    make; \
    make install


# build mediator
WORKDIR /root
RUN git clone https://github.com/OpenNetworkingFoundation/CENTENNIAL
WORKDIR /root/CENTENNIAL/02-MWTN-PoC/code/mediator/yang-modules
RUN set -x -e; \
    make; \
    make install


# configure sshd to use netconf
WORKDIR /root
RUN set -x -e; \
    echo 'Port 830' >> /etc/ssh/sshd_config; \
    echo 'Subsystem netconf "/usr/sbin/netconf-subsystem --ncxserver-sockname=830@/tmp/ncxserver.sock"' >> /etc/ssh/sshd_config


# finishing touches
EXPOSE 22
EXPOSE 830

