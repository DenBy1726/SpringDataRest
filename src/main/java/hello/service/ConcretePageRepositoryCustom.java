package hello.service;

import hello.model.ConcretePage;

import java.util.ArrayList;
import java.util.List;

public interface ConcretePageRepositoryCustom {
    List<ConcretePage> findTitleLike(String title);
}
