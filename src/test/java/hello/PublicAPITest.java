/*
 * Copyright 2016 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package hello;

import hello.model.Role;
import hello.repository.ConcretePageRepository;
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
import org.springframework.test.web.servlet.MvcResult;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import static junit.framework.TestCase.assertTrue;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class PublicAPITest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private CredentialRepository credentialRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Before
	public void Before(){
		Set<Role> roles = new HashSet<>();
		Role role = roleRepository.findByName("ADMIN");
		roles.add(role);

		hello.model.User user = new hello.model.User();
		user.setRegister_on(new Date());
		user.setBirthday(new Date());
		user.setId(0);
		user.setName("admin");
		user.setLastName("admin");
		user.setRole(roles);

		hello.model.Credential cr = new hello.model.Credential();
		cr.setId(0);
		cr.setLogin("admin");
		cr.setPassword("password");
		cr.setUser(user);

		credentialRepository.save(cr);
	}

	@Test
	public void shouldReturnAnonimRole() throws Exception {
		assertTrue(mockMvc.perform(get("/auth/v1/me")).andDo(print()).andExpect(status().isOk())
				.andReturn().getResponse()
				.getContentAsString()
				.contains("\"role\":[{\"name\":\"ANONIM\",\"id\":0}]"));
	}

	@Test
	@WithMockUser(username="admin",authorities={"ADMIN"})
	public void shouldLogOut() throws Exception {

		assertTrue(mockMvc.perform(get("/auth/v1/me")).andDo(print()).andExpect(status().isOk())
				.andReturn().getResponse()
				.getContentAsString()
				.contains("\"role\":[{\"name\":\"ADMIN\",\"id\":3}]"));
		mockMvc.perform(get("/auth/v1/logout")).andDo(print()).andExpect(status().is(302));
		assertTrue(mockMvc.perform(get("/auth/v1/me")).andDo(print()).andExpect(status().isOk())
				.andReturn().getResponse()
				.getContentAsString()
				.contains("\"role\":[{\"name\":\"ANONIM\",\"id\":0}]"));
	}


	@After
	public void After(){
		credentialRepository.deleteAll();
	}
}