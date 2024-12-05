package com.example.thuctapxuong.dao;

import com.example.thuctapxuong.entity.PlayerInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PlayerInfoDao extends JpaRepository<PlayerInfo, Integer> {
//    Tìm thông tin user
    @Query("select p from PlayerInfo p " +
            "where p.user.username = :username")
    PlayerInfo findByUsername(@Param("username") String username);
}
