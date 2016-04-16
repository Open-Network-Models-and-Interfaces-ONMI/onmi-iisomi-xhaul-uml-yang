package org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.statemodel.rev160305;


/**
 * The enumeration built-in type represents values from a set of assigned names.
 *
 */
public enum OperationalState {
    DISABLED(0),
    
    ENABLED(1)
    ;


    int value;
    private static final java.util.Map<java.lang.Integer, OperationalState> VALUE_MAP;

    static {
        final com.google.common.collect.ImmutableMap.Builder<java.lang.Integer, OperationalState> b = com.google.common.collect.ImmutableMap.builder();
        for (OperationalState enumItem : OperationalState.values())
        {
            b.put(enumItem.value, enumItem);
        }

        VALUE_MAP = b.build();
    }

    private OperationalState(int value) {
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
     * @return corresponding OperationalState item
     */
    public static OperationalState forValue(int valueArg) {
        return VALUE_MAP.get(valueArg);
    }
}
