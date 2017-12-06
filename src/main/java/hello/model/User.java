package hello.model;

import net.bytebuddy.implementation.bind.annotation.Default;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

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
    
    public Role getRole() {
        return role;
    }

    public User(){
        this.role = new Role();
        role.setId(1);
    }

    public void setRole(Role role) {
        this.role = role;
    }


    @ManyToOne
    @JoinColumn(name = "role",referencedColumnName = "id",nullable = true)
    private Role role;

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
