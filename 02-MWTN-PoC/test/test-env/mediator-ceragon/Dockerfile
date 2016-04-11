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
    make install


# build mediator
WORKDIR /root/yang-modules
RUN set -x -e; \
    make; \
    make install


# configure sshd to use netconf
RUN set -x -e; \
    echo 'Port 830' >> /etc/ssh/sshd_config; \
    echo 'Subsystem netconf "/usr/sbin/netconf-subsystem --ncxserver-sockname=830@/tmp/ncxserver.sock"' >> /etc/ssh/sshd_config


# finishing touches
EXPOSE 22
EXPOSE 830

