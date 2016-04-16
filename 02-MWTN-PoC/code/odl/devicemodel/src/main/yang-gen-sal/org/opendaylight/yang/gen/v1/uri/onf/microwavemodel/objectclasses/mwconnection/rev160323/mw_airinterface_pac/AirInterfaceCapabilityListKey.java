package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac;
import org.opendaylight.yangtools.yang.binding.Identifier;


public class AirInterfaceCapabilityListKey
 implements Identifier<AirInterfaceCapabilityList> {
    private static final long serialVersionUID = -2312382453099028330L;
    private final java.lang.String _airInterfaceID;


    public AirInterfaceCapabilityListKey(java.lang.String _airInterfaceID) {
    
    
        this._airInterfaceID = _airInterfaceID;
    }
    
    /**
     * Creates a copy from Source Object.
     *
     * @param source Source object
     */
    public AirInterfaceCapabilityListKey(AirInterfaceCapabilityListKey source) {
        this._airInterfaceID = source._airInterfaceID;
    }


    public java.lang.String getAirInterfaceID() {
        return _airInterfaceID;
    }


    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((_airInterfaceID == null) ? 0 : _airInterfaceID.hashCode());
        return result;
    }

    @Override
    public boolean equals(java.lang.Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        AirInterfaceCapabilityListKey other = (AirInterfaceCapabilityListKey) obj;
        if (_airInterfaceID == null) {
            if (other._airInterfaceID != null) {
                return false;
            }
        } else if(!_airInterfaceID.equals(other._airInterfaceID)) {
            return false;
        }
        return true;
    }

    @Override
    public java.lang.String toString() {
        java.lang.StringBuilder builder = new java.lang.StringBuilder(org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCapabilityListKey.class.getSimpleName()).append(" [");
        boolean first = true;
    
        if (_airInterfaceID != null) {
            if (first) {
                first = false;
            } else {
                builder.append(", ");
            }
            builder.append("_airInterfaceID=");
            builder.append(_airInterfaceID);
         }
        return builder.append(']').toString();
    }



}

