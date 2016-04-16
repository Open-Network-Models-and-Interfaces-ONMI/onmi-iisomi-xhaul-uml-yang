package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.typedefinitions.rev160323;


/**
 * The enumeration built-in type represents values from a set of assigned names.
 *
 */
public enum SeverityType {
    NonAlarmed(0),
    
    Warning(1),
    
    Minor(2),
    
    Major(3),
    
    Critical(4)
    ;


    int value;
    private static final java.util.Map<java.lang.Integer, SeverityType> VALUE_MAP;

    static {
        final com.google.common.collect.ImmutableMap.Builder<java.lang.Integer, SeverityType> b = com.google.common.collect.ImmutableMap.builder();
        for (SeverityType enumItem : SeverityType.values())
        {
            b.put(enumItem.value, enumItem);
        }

        VALUE_MAP = b.build();
    }

    private SeverityType(int value) {
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
     * @return corresponding SeverityType item
     */
    public static SeverityType forValue(int valueArg) {
        return VALUE_MAP.get(valueArg);
    }
}
