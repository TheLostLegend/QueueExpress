package com.model;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(name = "name")
    private String name;
    @Column(name = "queue_num")
    private int queue_num;
    public User() {
    }

    public User(String name, int queue_num) {
        this.name = name;
        this.queue_num = queue_num;
    }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id) &&
                Objects.equals(name, user.name) &&
                Objects.equals(queue_num, user.queue_num);
    }
    @Override
    public int hashCode() {
        return Objects.hash(id, name, queue_num);
    }
    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", queue_num='" + queue_num + '\'' +
                '}';
    }
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getQueue_Num() {
        return queue_num;
    }

    public void setQueue_Num(int queue_num) {
        this.queue_num = queue_num;
    }
}
