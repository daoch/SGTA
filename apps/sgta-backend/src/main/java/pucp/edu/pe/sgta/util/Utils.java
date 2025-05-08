package pucp.edu.pe.sgta.util;

import java.util.List;

public class Utils {
    static public String convertIntegerListToString(List<Integer> list) {
        String arrayStr = list.toString().replace("[", "{").replace("]", "}");
        return arrayStr;
    }
}
