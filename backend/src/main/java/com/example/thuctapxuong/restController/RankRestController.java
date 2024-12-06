package com.example.thuctapxuong.restController;

import com.example.thuctapxuong.dao.AchievementDao;
import com.example.thuctapxuong.entity.Achievement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/v1/rank")
public class RankRestController {

    @Autowired
    AchievementDao achieveDao;

    @GetMapping("/getRank")
    public ResponseEntity<List<Achievement>> getRank() {
        if (achieveDao.getTop7OfPlayer().isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        else {
            return ResponseEntity.ok(achieveDao.getTop7OfPlayer());
        }
    }

    @GetMapping("/getAllPlayerRank")
    public ResponseEntity<List<Achievement>> getPlayerRank() {
        if (achieveDao.getAllRankPlayer().isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        else {
            return ResponseEntity.ok(achieveDao.getAllRankPlayer());
        }
    }
}
