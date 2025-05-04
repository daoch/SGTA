package pucp.edu.pe.sgta.dto;

public class AdvisorPerformanceDto {
    private String name;
    private String department;
    private double progressPercentage;
    private int testistas;

    public AdvisorPerformanceDto() {}

    public AdvisorPerformanceDto(String name, String department, double progressPercentage, int testistas) {
        this.name               = name;
        this.department         = department;
        this.progressPercentage = progressPercentage;
        this.testistas          = testistas;
    }

    public String getName() { return name; }
    public void   setName(String name) { this.name = name; }

    public String getDepartment() { return department; }
    public void   setDepartment(String department) { this.department = department; }

    public double getProgressPercentage() { return progressPercentage; }
    public void   setProgressPercentage(double progressPercentage) { this.progressPercentage = progressPercentage; }

    public int    getTestistas() { return testistas; }
    public void   setTestistas(int testistas) { this.testistas = testistas; }
}
