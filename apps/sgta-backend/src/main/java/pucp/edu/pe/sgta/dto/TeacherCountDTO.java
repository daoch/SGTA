package pucp.edu.pe.sgta.dto;

//Se podria generalizar los datos, para mandar tanto asesor como jurado
public class TeacherCountDTO {
    private String teacherName;
    private int count;
    private String Area;

    public TeacherCountDTO(String teacherName, int count) {
        this.teacherName = teacherName;
        this.count = count;
    }
    public String getTeacherName() { return teacherName; }
    public int getCount() { return count; }
}