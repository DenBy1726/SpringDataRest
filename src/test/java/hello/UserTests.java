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

import hello.service.ConcretePageRepository;
import hello.service.UserRepository;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class UserTests {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private UserRepository personRepository;


	@Test
	public void shouldReturnRepositoryIndex() throws Exception {

		mockMvc.perform(get("/api/v1/")).andDo(print()).andExpect(status().isOk()).andExpect(
				jsonPath("$._links.users").exists());
	}

	@Test
	public void shouldCreateEntity() throws Exception {

		mockMvc.perform(post("/api/v1/users").content(
				"{\n" +
						"    \"name\" : \"John\",\n" +
						"    \"lastName\": \"Smith\",\n" +
						"    \"age\": 25,\n" +
						"    \"birthday\": \"1992-10-05\"\n" +
						"}")).andExpect(
						status().isCreated()).andExpect(
								header().string("Location", containsString("users/")));
	}

	@Test
	public void shouldRetrieveEntity() throws Exception {

		MvcResult mvcResult = mockMvc.perform(post("/api/v1/users").content(
				"{\n" +
						"    \"name\" : \"John\",\n" +
						"    \"lastName\": \"Smith\",\n" +
						"    \"age\": 25,\n" +
						"    \"birthday\": \"1992-10-05\"\n" +
						"}")).andExpect(
						status().isCreated()).andReturn();

		String location = mvcResult.getResponse().getHeader("Location");
		mockMvc.perform(get(location)).andExpect(status().isOk()).andExpect(
				jsonPath("$.name").value("John")).andExpect(
						jsonPath("$.lastName").value("Smith"));
	}

	@Test
	public void shouldPartiallyUpdateEntity() throws Exception {

		MvcResult mvcResult = mockMvc.perform(post("/api/v1/users").content(
				"{\n" +
						"    \"name\" : \"John\",\n" +
						"    \"lastName\": \"Smith\",\n" +
						"    \"age\": 30,\n" +
						"    \"birthday\": \"1992-10-05\"\n" +
						"}")).andExpect(
						status().isCreated()).andReturn();

		String location = mvcResult.getResponse().getHeader("Location");

		mockMvc.perform(
				patch(location).content("{\"name\": \"Bilbo Jr.\"}")).andExpect(
						status().isNoContent());

		mockMvc.perform(get(location)).andExpect(status().isOk()).andExpect(
				jsonPath("$.name").value("Bilbo Jr.")).andExpect(
						jsonPath("$.lastName").value("Smith"));
	}

	@Test
	public void shouldDeleteEntity() throws Exception {

		MvcResult mvcResult = mockMvc.perform(post("/api/v1/users").content(
				"{\n" +
						"    \"name\" : \"John\",\n" +
						"    \"lastName\": \"Smith\",\n" +
						"    \"age\": 30,\n" +
						"    \"birthday\": \"1992-10-05\"\n" +
						"}")).andExpect(
						status().isCreated()).andReturn();

		String location = mvcResult.getResponse().getHeader("Location");
		mockMvc.perform(delete(location)).andExpect(status().isNoContent());

		mockMvc.perform(get(location)).andExpect(status().isNotFound());
	}

	@After
    public void Clear(){
	    personRepository.deleteAll();
    }
}