package org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.typedefinitions.rev160305;
import java.io.Serializable;
import java.beans.ConstructorProperties;
import com.google.common.base.Preconditions;


public class PrintableString
 implements Serializable {
    private static final long serialVersionUID = -45509996214133682L;
    private final java.lang.String _value;


    @ConstructorProperties("value")
    public PrintableString(java.lang.String _value) {
    
    
        Preconditions.checkNotNull(_value, "Supplied value may not be null");
    
    
        this._value = _value;
    }
    
    /**
     * Creates a copy from Source Object.
     *
     * @param source Source object
     */
    public PrintableString(PrintableString source) {
        this._value = source._value;
    }

    public static PrintableString getDefaultInstance(String defaultValue) {
        return new PrintableString(defaultValue);
    }

    public java.lang.String getValue() {
        return _value;
    }


    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((_value == null) ? 0 : _value.hashCode());
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
        PrintableString other = (PrintableString) obj;
        if (_value == null) {
            if (other._value != null) {
                return false;
            }
        } else if(!_value.equals(other._value)) {
            return false;
        }
        return true;
    }

    @Override
    public java.lang.String toString() {
        java.lang.StringBuilder builder = new java.lang.StringBuilder(org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.typedefinitions.rev160305.PrintableString.class.getSimpleName()).append(" [");
        boolean first = true;
    
        if (_value != null) {
            if (first) {
                first = false;
            } else {
                builder.append(", ");
            }
            builder.append("_value=");
            builder.append(_value);
         }
        return builder.append(']').toString();
    }



}

