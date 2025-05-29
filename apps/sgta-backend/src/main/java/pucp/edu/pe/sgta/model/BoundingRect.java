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
public class BoundingRect {
    @Column(name="bounding_x1")
    private Double x1;
    @Column(name="bounding_y1")
    private Double y1;
    @Column(name="bounding_x2")
    private Double x2;
    @Column(name="bounding_y2")
    private Double y2;
    @Column(name="bounding_width")
    private Double width;
    @Column(name="bounding_height")
    private Double height;
    @Column(name="bounding_page")
    private Integer pageNumber;
}