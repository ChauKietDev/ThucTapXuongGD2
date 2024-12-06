package com.example.thuctapxuong.dao;

import com.example.thuctapxuong.entity.BoughtChar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BoughtCharDao extends JpaRepository<BoughtChar, Integer> {
    @Query("select bc from BoughtChar bc " +
            "where bc.player_info.id = :pId")
    List<BoughtChar> findBoughtCharByPlayerInfo(@Param("pId") int pId);

    @Query("select bc from BoughtChar bc " +
            "where bc.player_info.id = :pId and bc.charBuy.id = :cId")
    BoughtChar findByPlayerInfoAndChar(@Param("pId") int pId, @Param("cId") int cId);

    @Query("select bc from BoughtChar bc " +
            "where bc.player_info.id = :pId and bc.isSelected = true")
    BoughtChar findByPlayerInfoIsSelected(@Param("pId") int pId);
}
