package hello.service;

import java.util.List;

import hello.model.ConcretePage;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

public interface ConcretePageRepository extends PagingAndSortingRepository<ConcretePage, Long>,ConcretePageRepositoryCustom {

	List<ConcretePage> findByTitle(@Param("name") String name);

}
