package hello.service;

import hello.model.ConcretePage;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.List;

@Repository
public class ConcretePageRepositoryImpl implements ConcretePageRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<ConcretePage> findTitleLike(String title) {
        Query query = entityManager.createNativeQuery("select e.* from articles e\n" +
                "where e.title LIKE ? ", ConcretePage.class);
        query.setParameter(1, title);
        return query.getResultList();
    }
}
