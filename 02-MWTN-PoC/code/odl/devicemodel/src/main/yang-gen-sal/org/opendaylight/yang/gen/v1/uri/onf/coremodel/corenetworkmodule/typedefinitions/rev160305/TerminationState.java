package org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305;


/**
 * The enumeration built-in type represents values from a set of assigned names.
 *
 */
public enum TerminationState {
    LPCANNEVERTERMINATE(0),
    
    LTNOTTERMINATED(1),
    
    TERMINATEDSERVERTOCLIENTFLOW(2),
    
    TERMINATEDCLIENTTOSERVERFLOW(3),
    
    TERMINATEDBIDIRECTIONAL(4),
    
    LTPERMENANTLYTERMINATED(5),
    
    TERMINATIONSTATEUNKNOWN(6)
    ;


    int value;
    private static final java.util.Map<java.lang.Integer, TerminationState> VALUE_MAP;

    static {
        final com.google.common.collect.ImmutableMap.Builder<java.lang.Integer, TerminationState> b = com.google.common.collect.ImmutableMap.builder();
        for (TerminationState enumItem : TerminationState.values())
        {
            b.put(enumItem.value, enumItem);
        }

        VALUE_MAP = b.build();
    }

    private TerminationState(int value) {
        this.value = value;
    }

    /**
     * @return integer value
     */
    public int getIntValue() {
        return value;
    }

    /**
     * @param valueArg
     * @return corresponding TerminationState item
     */
    public static TerminationState forValue(int valueArg) {
        return VALUE_MAP.get(valueArg);
    }
}
