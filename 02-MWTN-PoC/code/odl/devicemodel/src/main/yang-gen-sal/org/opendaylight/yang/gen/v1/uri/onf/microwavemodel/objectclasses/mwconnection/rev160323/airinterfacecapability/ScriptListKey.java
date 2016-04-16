package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.airinterfacecapability;
import org.opendaylight.yangtools.yang.binding.Identifier;


public class ScriptListKey
 implements Identifier<ScriptList> {
    private static final long serialVersionUID = -7838860095055673405L;
    private final java.lang.String _scriptID;


    public ScriptListKey(java.lang.String _scriptID) {
    
    
        this._scriptID = _scriptID;
    }
    
    /**
     * Creates a copy from Source Object.
     *
     * @param source Source object
     */
    public ScriptListKey(ScriptListKey source) {
        this._scriptID = source._scriptID;
    }


    public java.lang.String getScriptID() {
        return _scriptID;
    }


    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((_scriptID == null) ? 0 : _scriptID.hashCode());
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
        ScriptListKey other = (ScriptListKey) obj;
        if (_scriptID == null) {
            if (other._scriptID != null) {
                return false;
            }
        } else if(!_scriptID.equals(other._scriptID)) {
            return false;
        }
        return true;
    }

    @Override
    public java.lang.String toString() {
        java.lang.StringBuilder builder = new java.lang.StringBuilder(org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.airinterfacecapability.ScriptListKey.class.getSimpleName()).append(" [");
        boolean first = true;
    
        if (_scriptID != null) {
            if (first) {
                first = false;
            } else {
                builder.append(", ");
            }
            builder.append("_scriptID=");
            builder.append(_scriptID);
         }
        return builder.append(']').toString();
    }



}

