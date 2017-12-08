package hello.repository;

import java.util.List;

import hello.model.ConcretePage;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface ConcretePageRepository extends PagingAndSortingRepository<ConcretePage, Long>,ConcretePageRepositoryCustom {

	List<ConcretePage> findByTitle(@Param("name") String name);

}
