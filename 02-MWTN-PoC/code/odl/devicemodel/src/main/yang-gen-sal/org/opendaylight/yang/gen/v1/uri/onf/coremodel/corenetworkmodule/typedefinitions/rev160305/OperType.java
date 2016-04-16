package org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305;


/**
 * The enumeration built-in type represents values from a set of assigned names.
 *
 */
public enum OperType {
    REVERTIVE(0),
    
    NONREVERTIVE(1)
    ;


    int value;
    private static final java.util.Map<java.lang.Integer, OperType> VALUE_MAP;

    static {
        final com.google.common.collect.ImmutableMap.Builder<java.lang.Integer, OperType> b = com.google.common.collect.ImmutableMap.builder();
        for (OperType enumItem : OperType.values())
        {
            b.put(enumItem.value, enumItem);
        }

        VALUE_MAP = b.build();
    }

    private OperType(int value) {
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
     * @return corresponding OperType item
     */
    public static OperType forValue(int valueArg) {
        return VALUE_MAP.get(valueArg);
    }
}
