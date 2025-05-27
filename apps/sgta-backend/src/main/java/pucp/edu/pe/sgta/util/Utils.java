package pucp.edu.pe.sgta.util;

import java.util.Base64;
import java.util.List;

public class Utils {
    static public String convertIntegerListToString(List<Integer> list) {
        String arrayStr = list.toString().replace("[", "{").replace("]", "}");
        return arrayStr;
    }

    static public String convertByteArrayToStringBase64(byte[] array) {
        return array != null ? Base64.getEncoder().encodeToString(array) : null;
    }
}
