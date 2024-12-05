package com.example.thuctapxuong.dao;

import com.example.thuctapxuong.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserDao extends JpaRepository<User, Integer> {
    User findByUsername(String username);
}

