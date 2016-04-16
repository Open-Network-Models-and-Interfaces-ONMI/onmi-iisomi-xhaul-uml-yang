package org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305;
import org.opendaylight.yangtools.yang.binding.Identifier;


public class Q822ObservedManagedObjectPkgKey
 implements Identifier<Q822ObservedManagedObjectPkg> {
    private static final long serialVersionUID = -1651482217877447037L;
    private final java.lang.String _observedObjectClass;


    public Q822ObservedManagedObjectPkgKey(java.lang.String _observedObjectClass) {
    
    
        this._observedObjectClass = _observedObjectClass;
    }
    
    /**
     * Creates a copy from Source Object.
     *
     * @param source Source object
     */
    public Q822ObservedManagedObjectPkgKey(Q822ObservedManagedObjectPkgKey source) {
        this._observedObjectClass = source._observedObjectClass;
    }


    public java.lang.String getObservedObjectClass() {
        return _observedObjectClass;
    }


    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((_observedObjectClass == null) ? 0 : _observedObjectClass.hashCode());
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
        Q822ObservedManagedObjectPkgKey other = (Q822ObservedManagedObjectPkgKey) obj;
        if (_observedObjectClass == null) {
            if (other._observedObjectClass != null) {
                return false;
            }
        } else if(!_observedObjectClass.equals(other._observedObjectClass)) {
            return false;
        }
        return true;
    }

    @Override
    public java.lang.String toString() {
        java.lang.StringBuilder builder = new java.lang.StringBuilder(org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822ObservedManagedObjectPkgKey.class.getSimpleName()).append(" [");
        boolean first = true;
    
        if (_observedObjectClass != null) {
            if (first) {
                first = false;
            } else {
                builder.append(", ");
            }
            builder.append("_observedObjectClass=");
            builder.append(_observedObjectClass);
         }
        return builder.append(']').toString();
    }



}

