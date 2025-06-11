package pucp.edu.pe.sgta.job;

import org.quartz.*;
import org.quartz.spi.TriggerFiredBundle;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.quartz.SpringBeanJobFactory;

@Configuration
public class QuartzConfig {
    public static class AutowiringSpringBeanJobFactory extends SpringBeanJobFactory {
        private final AutowireCapableBeanFactory beanFactory;

        public AutowiringSpringBeanJobFactory(AutowireCapableBeanFactory beanFactory) {
            this.beanFactory = beanFactory;
        }

        @Override
        protected Object createJobInstance(TriggerFiredBundle bundle) throws Exception {
            Object job = super.createJobInstance(bundle);
            beanFactory.autowireBean(job);
            return job;
        }

        @Bean
        public JobDetail estadoExposicionJobDetail() {
            return JobBuilder.newJob(EstadoExposicionJob.class)
                    .withIdentity("estadoExposicionJob")
                    .storeDurably()
                    .build();
        }

        @Bean
        public Trigger estadoExposicionTrigger() {
            return TriggerBuilder.newTrigger()
                    .forJob(estadoExposicionJobDetail())
                    .withIdentity("estadoExposicionTrigger")
                    .withSchedule(SimpleScheduleBuilder.simpleSchedule()
                            .withIntervalInMinutes(5)
                            .repeatForever())
                    .build();
        }

        @Bean
        public SpringBeanJobFactory springBeanJobFactory(AutowireCapableBeanFactory beanFactory) {
            return new AutowiringSpringBeanJobFactory(beanFactory);
        }
    }
}
