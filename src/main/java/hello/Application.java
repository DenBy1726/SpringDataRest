package hello;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.*;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.rest.webmvc.config.RepositoryRestMvcConfiguration;

import java.io.IOException;

@SpringBootApplication
//@PropertySource("classpath:application.properties")
public class Application {

	public static void main(String[] args) throws IOException {
	/*	System.getProperties().put( "server.port", 8080 );
        System.getProperties().put( "spring.data.rest.base-path", "/api/v1/" );
        System.getProperties().put("spring.datasource.url","jdbc:postgresql://localhost:5432/postgres");
        System.getProperties().put("spring.datasource.username","postgres");
        System.getProperties().put("spring.datasource.password","root");
        System.getProperties().put("spring.datasource.driverClassName","org.postgresql.Driver");*/
		SpringApplication.run(Application.class, args);
	}


}
