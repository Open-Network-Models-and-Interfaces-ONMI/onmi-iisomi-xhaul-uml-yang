package org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305;
import org.opendaylight.yangtools.yang.binding.Identifier;


public class Q822HistoryDataMeasurementListPkgKey
 implements Identifier<Q822HistoryDataMeasurementListPkg> {
    private static final long serialVersionUID = -1603880488838052203L;
    private final java.lang.String _cTPId;


    public Q822HistoryDataMeasurementListPkgKey(java.lang.String _cTPId) {
    
    
        this._cTPId = _cTPId;
    }
    
    /**
     * Creates a copy from Source Object.
     *
     * @param source Source object
     */
    public Q822HistoryDataMeasurementListPkgKey(Q822HistoryDataMeasurementListPkgKey source) {
        this._cTPId = source._cTPId;
    }


    public java.lang.String getCTPId() {
        return _cTPId;
    }


    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((_cTPId == null) ? 0 : _cTPId.hashCode());
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
        Q822HistoryDataMeasurementListPkgKey other = (Q822HistoryDataMeasurementListPkgKey) obj;
        if (_cTPId == null) {
            if (other._cTPId != null) {
                return false;
            }
        } else if(!_cTPId.equals(other._cTPId)) {
            return false;
        }
        return true;
    }

    @Override
    public java.lang.String toString() {
        java.lang.StringBuilder builder = new java.lang.StringBuilder(org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822HistoryDataMeasurementListPkgKey.class.getSimpleName()).append(" [");
        boolean first = true;
    
        if (_cTPId != null) {
            if (first) {
                first = false;
            } else {
                builder.append(", ");
            }
            builder.append("_cTPId=");
            builder.append(_cTPId);
         }
        return builder.append(']').toString();
    }



}

