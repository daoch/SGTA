package pucp.edu.pe.sgta.job;

import org.quartz.JobDetail;
import org.quartz.Trigger;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;
import org.springframework.scheduling.quartz.SpringBeanJobFactory;

@Configuration
public class QuartzSchedulerConfig {


    private final SpringBeanJobFactory springBeanJobFactory;
    private final JobDetail estadoExposicionJobDetail;
    private final Trigger estadoExposicionTrigger;

    public QuartzSchedulerConfig(SpringBeanJobFactory springBeanJobFactory,
                                 JobDetail estadoExposicionJobDetail,
                                 Trigger estadoExposicionTrigger) {
        this.springBeanJobFactory = springBeanJobFactory;
        this.estadoExposicionJobDetail = estadoExposicionJobDetail;
        this.estadoExposicionTrigger = estadoExposicionTrigger;
    }

    @Bean
    public SchedulerFactoryBean schedulerFactoryBean() {
        SchedulerFactoryBean factory = new SchedulerFactoryBean();
        factory.setJobFactory(springBeanJobFactory);
        factory.setJobDetails(estadoExposicionJobDetail);
        factory.setTriggers(estadoExposicionTrigger);
        return factory;
    }
}
