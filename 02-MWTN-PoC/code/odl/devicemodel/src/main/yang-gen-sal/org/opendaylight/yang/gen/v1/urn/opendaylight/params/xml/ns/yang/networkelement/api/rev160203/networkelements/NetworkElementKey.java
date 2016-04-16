package org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements;
import org.opendaylight.yangtools.yang.binding.Identifier;


public class NetworkElementKey
 implements Identifier<NetworkElement> {
    private static final long serialVersionUID = 6904992753965111729L;
    private final java.lang.String _name;


    public NetworkElementKey(java.lang.String _name) {
    
    
        this._name = _name;
    }
    
    /**
     * Creates a copy from Source Object.
     *
     * @param source Source object
     */
    public NetworkElementKey(NetworkElementKey source) {
        this._name = source._name;
    }


    public java.lang.String getName() {
        return _name;
    }


    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((_name == null) ? 0 : _name.hashCode());
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
        NetworkElementKey other = (NetworkElementKey) obj;
        if (_name == null) {
            if (other._name != null) {
                return false;
            }
        } else if(!_name.equals(other._name)) {
            return false;
        }
        return true;
    }

    @Override
    public java.lang.String toString() {
        java.lang.StringBuilder builder = new java.lang.StringBuilder(org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElementKey.class.getSimpleName()).append(" [");
        boolean first = true;
    
        if (_name != null) {
            if (first) {
                first = false;
            } else {
                builder.append(", ");
            }
            builder.append("_name=");
            builder.append(_name);
         }
        return builder.append(']').toString();
    }



}

