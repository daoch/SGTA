package pucp.edu.pe.sgta.dto;

public class TeacherCountDTO {
    private String teacherName;
    private int count;

    public TeacherCountDTO(String teacherName, int count) {
        this.teacherName = teacherName;
        this.count = count;
    }
    public String getTeacherName() { return teacherName; }
    public int getCount() { return count; }
}