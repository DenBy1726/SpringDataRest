package hello.repository;


import hello.model.Credential;
import hello.model.Role;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported = false)
public interface RoleRepository extends PagingAndSortingRepository<Role, Long> {
    Role findByName(String name);
}

