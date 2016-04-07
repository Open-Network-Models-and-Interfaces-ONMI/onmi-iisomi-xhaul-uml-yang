# Base image 
FROM debian 


# Install required software 
RUN apt-get update && \
    apt-get install -y git libxml2 libxml2-dev libxslt-dev libssh2-1-dev \
                       libcurl4-gnutls-dev libdbus-1-dev doxygen libevent-dev \
                       libreadline-dev libncurses-dev libxml++2.6-dev libtool \
                       python-libxml2 openssh-server xsltproc cmake \
                       build-essential libssl-dev python-setuptools \
                       libtool-bin wget autoconf vim && \
    apt-get clean && apt-get purge


# Change to /root directory 
WORKDIR /root


# Install libssh 0.6.4 
RUN wget https://git.libssh.org/projects/libssh.git/snapshot/libssh-0.6.4.tar.gz && \
    tar xvfz libssh-0.6.4.tar.gz && \
    rm libssh-0.6.4.tar.gz && \
    cd libssh-0.6.4/build && \
    cmake -DCMAKE_INSTALL_PREFIX=/usr -DCMAKE_BUILD_TYPE=Debug .. && \
    make && make install


# Install pyang and lnctool 
RUN git clone https://github.com/mbj4668/pyang.git && \
    cd pyang && python setup.py install && cd ..


# Install libnetconf 
RUN git clone https://code.google.com/p/libnetconf/ && \
    cd libnetconf && ./configure --with-nacm-recovery-uid=0 && \
    make && make install && cd ..


# Install lnctool 
RUN cp libnetconf/dev-tools/lnctool/lnctool /usr/local/bin/


# Install netopeer and cli 
ENV YANG_MODPATH '/root/pyang/modules/ietf/'
RUN git clone https://code.google.com/p/netopeer/ && \
    cd netopeer/server && ./configure && make && make install && cd ../.. && \
    cp netopeer/server/config/datastore.xml /usr/local/etc/netopeer/cfgnetopeer && \
    cd netopeer/cli && ./configure && make && make install && cd ../..


# Update root passwd to root
RUN mkdir /var/run/sshd
RUN echo "root\nroot" > /password && \
    cat /password | passwd


# Configure sshd to use netconf as default 
RUN echo 'Port 830' >> /etc/ssh/sshd_config
RUN echo 'Subsystem netconf /usr/local/bin/netopeer-server' >> /etc/ssh/sshd_config
CMD /etc/init.d/ssh restart
EXPOSE 830

