package pucp.edu.pe.sgta.util;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.List;

public class Utils {
    static public String convertIntegerListToString(List<Integer> list) {
        String arrayStr = list.toString().replace("[", "{").replace("]", "}");
        return arrayStr;
    }

    static public String convertByteArrayToStringBase64(byte[] array) {
        return array != null? Base64.getEncoder().encodeToString(array) : null;
    }
    static public boolean validarTrueOrFalseDeQuery(List<Object[]> list) {
        //Si un query asegura tener una sola fila con una sola columna y valor true or false
        return (boolean) list.get(0)[0];
    }
    static public String formatearInstant(Instant dateTime) {
        if(dateTime == null) {return null;}
        OffsetDateTime asOffSet = dateTime.atZone(ZoneId.of("America/Lima")).toOffsetDateTime();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        return asOffSet.format(formatter);
    }
    static public String normalizarNombre(String nombres, String apellido){
        if (nombres == null || apellido == null) return "";
        String nombreDisplay = "";
        nombreDisplay += nombres.split(" ")[0] + " ";
        nombreDisplay += apellido;
        return nombreDisplay;
    }
}
