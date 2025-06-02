package pucp.edu.pe.sgta.model;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Embeddable
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Rect {
    @Column(name="x1")
    private Double x1;
    @Column(name="y1")
    private Double y1;
    @Column(name="x2")
    private Double x2;
    @Column(name="y2")
    private Double y2;
    @Column(name="width")
    private Double width;
    @Column(name="height")
    private Double height;
    @Column(name="page_number")
    private Integer pageNumber;
}