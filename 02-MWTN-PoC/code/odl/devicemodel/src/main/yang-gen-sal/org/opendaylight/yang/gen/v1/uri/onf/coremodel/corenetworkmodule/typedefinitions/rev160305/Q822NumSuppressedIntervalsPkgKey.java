package org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305;
import org.opendaylight.yangtools.yang.binding.Identifier;
import java.math.BigInteger;


public class Q822NumSuppressedIntervalsPkgKey
 implements Identifier<Q822NumSuppressedIntervalsPkg> {
    private static final long serialVersionUID = -6982484928410468256L;
    private final BigInteger _numSuppressedIntervals;


    public Q822NumSuppressedIntervalsPkgKey(BigInteger _numSuppressedIntervals) {
    
    
        this._numSuppressedIntervals = _numSuppressedIntervals;
    }
    
    /**
     * Creates a copy from Source Object.
     *
     * @param source Source object
     */
    public Q822NumSuppressedIntervalsPkgKey(Q822NumSuppressedIntervalsPkgKey source) {
        this._numSuppressedIntervals = source._numSuppressedIntervals;
    }


    public BigInteger getNumSuppressedIntervals() {
        return _numSuppressedIntervals;
    }


    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((_numSuppressedIntervals == null) ? 0 : _numSuppressedIntervals.hashCode());
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
        Q822NumSuppressedIntervalsPkgKey other = (Q822NumSuppressedIntervalsPkgKey) obj;
        if (_numSuppressedIntervals == null) {
            if (other._numSuppressedIntervals != null) {
                return false;
            }
        } else if(!_numSuppressedIntervals.equals(other._numSuppressedIntervals)) {
            return false;
        }
        return true;
    }

    @Override
    public java.lang.String toString() {
        java.lang.StringBuilder builder = new java.lang.StringBuilder(org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822NumSuppressedIntervalsPkgKey.class.getSimpleName()).append(" [");
        boolean first = true;
    
        if (_numSuppressedIntervals != null) {
            if (first) {
                first = false;
            } else {
                builder.append(", ");
            }
            builder.append("_numSuppressedIntervals=");
            builder.append(_numSuppressedIntervals);
         }
        return builder.append(']').toString();
    }



}

