package hello.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

@Entity
@Table(name="articles")
public class ConcretePage {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "article_id")
	private long Id;

	@Column(name = "title")
	private String title;

	@Column(name = "category")
	private String category;

	private @Version @JsonIgnore
    Long version;

	public String getTitle() {
		return title;
	}

	public void setTitle(String firstName) {
		this.title = firstName;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String lastName) {
		this.category = lastName;
	}

	public long getId(){
		return Id;
	}

	public void setId(long id){
		this.Id = id;
	}
}
