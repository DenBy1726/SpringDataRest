package hello;

import hello.model.Role;
import hello.repository.CredentialRepository;
import hello.repository.RoleRepository;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import static junit.framework.TestCase.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class AccessTest {

    @Autowired
    private MockMvc mockMvc;


    @Test
    public void accessToConcreteShouldNonAuthorizenAnonim() throws Exception {
        mockMvc.perform(get("/api/v1/concretePages")).andDo(print()).andExpect(status().is(401));
    }

    @Test
    @WithMockUser(username="admin",authorities={"USER"})
    public void accessToConcretePagesAcceptForUser() throws Exception {
        mockMvc.perform(get("/api/v1/concretePages")).andDo(print()).andExpect(status().is(200));
    }

    @Test
    @WithMockUser(username="admin",authorities={"ADMIN"})
    public void accessToConcretePagesDeniedForAdmin() throws Exception {
        mockMvc.perform(get("/api/v1/concretePages")).andDo(print()).andExpect(status().is(403));
    }

    @Test
    @WithMockUser(username="admin",authorities={"MODER"})
    public void accessToConcretePagesAcceptForModer() throws Exception {
        mockMvc.perform(get("/api/v1/concretePages")).andDo(print()).andExpect(status().is(200));
    }

    @Test
    public void accessToUsersShouldNonAuthorizenForAnonim() throws Exception {
        mockMvc.perform(get("/api/v1/users")).andDo(print()).andExpect(status().is(401));
    }

    @Test
    @WithMockUser(username="admin",authorities={"USER"})
    public void accessToUsersDeniedForUser() throws Exception {
        mockMvc.perform(get("/api/v1/users")).andDo(print()).andExpect(status().is(403));
    }

    @Test
    @WithMockUser(username="admin",authorities={"ADMIN"})
    public void accessToUsersDeniedForAdmin() throws Exception {
        mockMvc.perform(get("/api/v1/users")).andDo(print()).andExpect(status().is(403));
    }

    @Test
    @WithMockUser(username="admin",authorities={"MODER"})
    public void accessToUsersAcceptForModer() throws Exception {
        mockMvc.perform(get("/api/v1/users")).andDo(print()).andExpect(status().is(200));
    }

    @Test
    public void accessToCredentialShouldNonAuthorizenAnonim() throws Exception {
        mockMvc.perform(get("/api/v1/credentials")).andDo(print()).andExpect(status().is(401));
    }

    @Test
    @WithMockUser(username="admin",authorities={"USER"})
    public void accessToCredentialsDeniedForUser() throws Exception {
        mockMvc.perform(get("/api/v1/credentials")).andDo(print()).andExpect(status().is(403));
    }

    @Test
    @WithMockUser(username="admin",authorities={"ADMIN"})
    public void accessToCredentialsAcceptForAdmin() throws Exception {
        mockMvc.perform(get("/api/v1/credentials")).andDo(print()).andExpect(status().is(200));
    }

    @Test
    @WithMockUser(username="admin",authorities={"MODER"})
    public void accessToCredentialsDeniedForModer() throws Exception {
        mockMvc.perform(get("/api/v1/credentials")).andDo(print()).andExpect(status().is(403));
    }

}
