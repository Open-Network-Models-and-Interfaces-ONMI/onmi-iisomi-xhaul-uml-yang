package org.opendaylight.mwtn.config.impl;

import org.opendaylight.mwtn.base.database.EsObject;

public class HtConfiguration extends EsObject {

    public static final String ESDATATYPENAME = "database";

    private static final String EMPTY = "empty";

    private String cluster=EMPTY;
    private String host=EMPTY;
    private String node=EMPTY;
    private String index=EMPTY;

    public HtConfiguration() {
    }

    public static String getESDATATYPENAME() {
        return ESDATATYPENAME;
    }

    public String getCluster() {
        return cluster;
    }

    public void setCluster(String cluster) {
        this.cluster = cluster;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public String getNode() {
        return node;
    }

    public void setNode(String node) {
        this.node = node;
    }

    public String getIndex() {
        return index;
    }

    public void setIndex(String index) {
        this.index = index;
    }

    @Override
    public String toString() {
        return "HtConfiguration [cluster=" + cluster + ", host=" + host + ", node=" + node + ", index=" + index + "]";
    }

}
