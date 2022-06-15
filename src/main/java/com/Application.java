package com;

import com.model.User;
import com.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application implements CommandLineRunner {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
    @Autowired
    private UserRepository userRepository;
    @Override
    public void run(String... args) throws Exception {
        this.userRepository.save(new User("Harry",1));
        this.userRepository.save(new User("Ron",2));
        this.userRepository.save(new User("Germiona",3));
    }
}
