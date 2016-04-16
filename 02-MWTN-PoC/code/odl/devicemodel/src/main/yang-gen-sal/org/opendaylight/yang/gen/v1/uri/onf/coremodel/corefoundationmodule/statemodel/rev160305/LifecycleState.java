package org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.statemodel.rev160305;


/**
 * The enumeration built-in type represents values from a set of assigned names.
 *
 */
public enum LifecycleState {
    PLANNED(0),
    
    POTENTIAL(1),
    
    INSTALLED(2),
    
    PENDINGREMOVAL(3)
    ;


    int value;
    private static final java.util.Map<java.lang.Integer, LifecycleState> VALUE_MAP;

    static {
        final com.google.common.collect.ImmutableMap.Builder<java.lang.Integer, LifecycleState> b = com.google.common.collect.ImmutableMap.builder();
        for (LifecycleState enumItem : LifecycleState.values())
        {
            b.put(enumItem.value, enumItem);
        }

        VALUE_MAP = b.build();
    }

    private LifecycleState(int value) {
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
     * @return corresponding LifecycleState item
     */
    public static LifecycleState forValue(int valueArg) {
        return VALUE_MAP.get(valueArg);
    }
}
