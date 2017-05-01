package org.opendaylight.mwtn.devicemanager.impl.database.types;

import org.opendaylight.mwtn.base.database.EsObject;
import org.osgi.framework.Version;

/**
 *
 * Create a VersionInfo Object Network to be recorded in the database
 *
 */

public class EsVersionInfo extends EsObject {

    public static final String ESDATATYPENAME = "versioninfo";
    private static final String EMPTY = "";

    private Version bundleVersion;
    private String build = EMPTY;
    private String version = EMPTY;

    public EsVersionInfo() {
    }

    public Version getBundleVersion() {
        return bundleVersion;
    }

    public void setBundleVersion(Version bundleVersion) {
        this.bundleVersion = bundleVersion;
    }

    public String getBuild() {
        return build;
    }

    public void setBuild(String build) {
        this.build = build;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public static String getEsdatatypename() {
        return ESDATATYPENAME;
    }

    @Override
    public String toString() {
        return "EsVersionInfo [bundleVersion=" + bundleVersion + ", build=" + build + ", version=" + version + "]";
    }


 }
