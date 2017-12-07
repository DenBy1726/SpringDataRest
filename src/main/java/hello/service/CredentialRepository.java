package hello.service;


import hello.model.Credential;
import hello.model.User;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface CredentialRepository extends PagingAndSortingRepository<Credential, Long> {

}

