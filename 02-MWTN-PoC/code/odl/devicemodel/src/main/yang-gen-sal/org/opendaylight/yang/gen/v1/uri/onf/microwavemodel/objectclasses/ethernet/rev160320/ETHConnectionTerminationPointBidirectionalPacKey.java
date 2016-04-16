package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320;
import org.opendaylight.yangtools.yang.binding.Identifier;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.UniversalId;


public class ETHConnectionTerminationPointBidirectionalPacKey
 implements Identifier<ETHConnectionTerminationPointBidirectionalPac> {
    private static final long serialVersionUID = -7360736470460252593L;
    private final UniversalId _layerProtocol;


    public ETHConnectionTerminationPointBidirectionalPacKey(UniversalId _layerProtocol) {
    
    
        this._layerProtocol = _layerProtocol;
    }
    
    /**
     * Creates a copy from Source Object.
     *
     * @param source Source object
     */
    public ETHConnectionTerminationPointBidirectionalPacKey(ETHConnectionTerminationPointBidirectionalPacKey source) {
        this._layerProtocol = source._layerProtocol;
    }


    public UniversalId getLayerProtocol() {
        return _layerProtocol;
    }


    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((_layerProtocol == null) ? 0 : _layerProtocol.hashCode());
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
        ETHConnectionTerminationPointBidirectionalPacKey other = (ETHConnectionTerminationPointBidirectionalPacKey) obj;
        if (_layerProtocol == null) {
            if (other._layerProtocol != null) {
                return false;
            }
        } else if(!_layerProtocol.equals(other._layerProtocol)) {
            return false;
        }
        return true;
    }

    @Override
    public java.lang.String toString() {
        java.lang.StringBuilder builder = new java.lang.StringBuilder(org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.ETHConnectionTerminationPointBidirectionalPacKey.class.getSimpleName()).append(" [");
        boolean first = true;
    
        if (_layerProtocol != null) {
            if (first) {
                first = false;
            } else {
                builder.append(", ");
            }
            builder.append("_layerProtocol=");
            builder.append(_layerProtocol);
         }
        return builder.append(']').toString();
    }



}

