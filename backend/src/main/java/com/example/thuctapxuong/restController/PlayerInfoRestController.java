package com.example.thuctapxuong.restController;

import com.example.thuctapxuong.dao.PlayerInfoDao;
import com.example.thuctapxuong.entity.PlayerInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Date;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/v1/playerinfo")
public class PlayerInfoRestController {

    @Autowired
    PlayerInfoDao playerInfoDao;

    int currentTurns;

    @GetMapping("/{id}")
    public ResponseEntity<PlayerInfo> getPlayerInfo(@PathVariable int id) {
        if (playerInfoDao.existsById(id)) {
            return ResponseEntity.ok(playerInfoDao.getById(id));
        }
        else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/getInfo/username-{username}")
    public ResponseEntity<PlayerInfo> getInfo(@PathVariable String username) {
        if (playerInfoDao.findByUsername(username) != null) {
            return ResponseEntity.ok(playerInfoDao.findByUsername(username));
        }
        else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/updateInfor/{id}")
    public ResponseEntity<PlayerInfo> updateInfo(@PathVariable int id, @RequestBody PlayerInfo playerInfo) {
        if (playerInfoDao.existsById(id)) {
//            PlayerInfo curPlayerInfo = playerInfoDao.findById(id).get();
//            curPlayerInfo.setHighestScore(playerInfo.getHighestScore() + playerInfo.getHighestScore());
            return ResponseEntity.ok(playerInfoDao.save(playerInfo));
        }
        else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/updateTurns/{id}-isPlayed={isPlayed}")
    public ResponseEntity<PlayerInfo> updateTurns(@PathVariable int id, @PathVariable boolean isPlayed) {
        if (playerInfoDao.findById(id) != null) {
            PlayerInfo playerInfo = playerInfoDao.findById(id).get();
            if (isPlayed) {
                currentTurns = playerInfo.getCurrentTurns();
                playerInfo.setCurrentTurns(currentTurns - 1);
                playerInfo.setTimeUsedTurn(LocalDateTime.now());
                playerInfo.setTimeAddTurn(playerInfo.getTimeUsedTurn().plusHours(1));
            }
            else
                if (playerInfo.getCurrentTurns() < playerInfo.getNumberOfTurns()) {
                    System.out.println(playerInfo.getTimeAddTurn() + " " + LocalDateTime.now());
                    if (LocalDateTime.now().compareTo(playerInfo.getTimeAddTurn()) >= 0) {
                        currentTurns = playerInfo.getCurrentTurns();
                        playerInfo.setCurrentTurns(currentTurns + 1);
                        playerInfo.setTimeUsedTurn(playerInfo.getTimeAddTurn());
                    }
                    else if (playerInfo.getTimeUsedTurn() == null) {
                        playerInfo.setTimeUsedTurn(LocalDateTime.now());
                        System.out.println("Auto create date");
                    }
                    playerInfo.setTimeAddTurn(playerInfo.getTimeUsedTurn().plusHours(1));
                    System.out.println("Updated");
                }
            return ResponseEntity.ok(playerInfoDao.save(playerInfo));
        }
        else {
            return ResponseEntity.notFound().build();
        }
    }
}
