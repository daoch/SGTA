package pucp.edu.pe.sgta.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Calendar;
import java.util.Date;

@Getter
@Setter

public abstract class BaseEntity {
    //Based on the Eunoia project by Echo-Echo, which I was part of. Course Ingesoft, 2024-1.
    //Two audit dates and an active field

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "creation_date", columnDefinition = "DATETIME", nullable = false)
    protected Date creationDate = new Date();

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "modification_date", columnDefinition = "DATETIME", nullable = false)
    protected Date modificationDate = new Date();

    @Column(name = "is_active")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Byte isActive = 1;

    @PreUpdate
    private void onUpdate() {
        modificationDate = addHoursToJavaUtilDate(new Date(), -5);
    }

    @PrePersist
    private void onCreate() {
        creationDate = modificationDate = addHoursToJavaUtilDate(new Date(), -5);
    }

    public Date addHoursToJavaUtilDate(Date date, int hours) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.HOUR_OF_DAY, hours);
        return calendar.getTime();
    }

    public void toGMTminusFive() {
        creationDate = modificationDate = addHoursToJavaUtilDate(new Date(), -5);
    }
}