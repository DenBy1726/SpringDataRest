package hello.service;

import java.util.List;

import hello.model.ConcretePage;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.stereotype.Component;

@RepositoryRestResource
@Component
public interface ConcretePageRepository extends PagingAndSortingRepository<ConcretePage, Long> {

	List<ConcretePage> findByTitle(@Param("name") String name);

}
