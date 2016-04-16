package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.containerconfiguration;
import org.opendaylight.yangtools.yang.binding.Identifier;


public class TimeSlotIDListKey
 implements Identifier<TimeSlotIDList> {
    private static final long serialVersionUID = -3303899430808191L;
    private final java.lang.String _structureID;
    private final java.lang.String _timeSlotID;


    public TimeSlotIDListKey(java.lang.String _structureID, java.lang.String _timeSlotID) {
    
    
        this._structureID = _structureID;
        this._timeSlotID = _timeSlotID;
    }
    
    /**
     * Creates a copy from Source Object.
     *
     * @param source Source object
     */
    public TimeSlotIDListKey(TimeSlotIDListKey source) {
        this._structureID = source._structureID;
        this._timeSlotID = source._timeSlotID;
    }


    public java.lang.String getStructureID() {
        return _structureID;
    }
    
    public java.lang.String getTimeSlotID() {
        return _timeSlotID;
    }


    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((_structureID == null) ? 0 : _structureID.hashCode());
        result = prime * result + ((_timeSlotID == null) ? 0 : _timeSlotID.hashCode());
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
        TimeSlotIDListKey other = (TimeSlotIDListKey) obj;
        if (_structureID == null) {
            if (other._structureID != null) {
                return false;
            }
        } else if(!_structureID.equals(other._structureID)) {
            return false;
        }
        if (_timeSlotID == null) {
            if (other._timeSlotID != null) {
                return false;
            }
        } else if(!_timeSlotID.equals(other._timeSlotID)) {
            return false;
        }
        return true;
    }

    @Override
    public java.lang.String toString() {
        java.lang.StringBuilder builder = new java.lang.StringBuilder(org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.containerconfiguration.TimeSlotIDListKey.class.getSimpleName()).append(" [");
        boolean first = true;
    
        if (_structureID != null) {
            if (first) {
                first = false;
            } else {
                builder.append(", ");
            }
            builder.append("_structureID=");
            builder.append(_structureID);
         }
        if (_timeSlotID != null) {
            if (first) {
                first = false;
            } else {
                builder.append(", ");
            }
            builder.append("_timeSlotID=");
            builder.append(_timeSlotID);
         }
        return builder.append(']').toString();
    }



}

