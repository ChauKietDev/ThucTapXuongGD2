package com.example.thuctapxuong.dao;

import com.example.thuctapxuong.entity.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AchievementDao extends JpaRepository<Achievement, Integer> {
//    Xếp hạng 7 người có điểm cao nhất
    @Query("select a from Achievement a \n" +
            "inner join PlayerInfo p on a.playerInfo.id = p.id \n" +
            "order by p.highestScore desc\n" +
            "limit 7")
    List<Achievement> getTop7OfPlayer();
//    Danh sách achievement theo điểm giảm dần
    @Query("select a from Achievement a \n" +
            "inner join PlayerInfo p on a.playerInfo.id = p.id \n" +
            "order by p.highestScore desc")
    List<Achievement> getAllRankPlayer();
}
