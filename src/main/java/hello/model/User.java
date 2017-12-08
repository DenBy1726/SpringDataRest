package hello.model;

import net.bytebuddy.implementation.bind.annotation.Default;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name="users")
public class User {
    @javax.persistence.Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long Id;

    @Column(name = "name")
    private String name;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "age")
    private long age;

    @Column(name = "birthday")
    @Temporal(TemporalType.DATE)
    private Date birthday;


    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "register_on")
    private Date register_on;

    @ManyToMany(cascade = { CascadeType.REFRESH },fetch = FetchType.EAGER)
    @JoinTable(
            name = "role_users",
            joinColumns = { @JoinColumn(name = "id") },
            inverseJoinColumns = { @JoinColumn(name = "role") }
    )
    private Set<Role> role = new HashSet<>();

    public User(){
        Role anonim = new Role();
        anonim.setId(0);
        role.add(anonim);
    }

    public Set<Role> getRole() {
        return role;
    }



    public void setRole(Set<Role> role) {
        this.role = role;
    }




    public long getId() {
        return Id;
    }

    public void setId(long id) {
        Id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public long getAge() {
        return age;
    }

    public void setAge(long age) {
        this.age = age;
    }

    public Date getBirthday() {
        return birthday;
    }

    public void setBirthday(Date birthday) {
        this.birthday = birthday;
    }

    public Date getRegister_on() {
        return register_on;
    }

    public void setRegister_on(Date register_on) {
        this.register_on = register_on;
    }


}
