package com.example.thuctapxuong.restController;

import com.example.thuctapxuong.dao.*;
import com.example.thuctapxuong.entity.Achievement;
import com.example.thuctapxuong.entity.BoughtChar;
import com.example.thuctapxuong.entity.PlayerInfo;
import com.example.thuctapxuong.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/v1/user")
public class UserRestController {

    @Autowired
    UserDao userDao;
    @Autowired
    PlayerInfoDao playerInfoDao;
    @Autowired
    BoughtCharDao boughtCharDao;
    @Autowired
    CharacterDao characterDao;
    @Autowired
    AchievementDao achievementDao;

    @GetMapping("/{username}")
    public ResponseEntity<User> getUser(@PathVariable String username) {
        if (userDao.findByUsername(username) != null) {
            return ResponseEntity.ok(userDao.findByUsername(username));
        }
        else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/login/{username}-{password}")
    public ResponseEntity<User> login(@PathVariable String username, @PathVariable String password) {
        if (userDao.findByUsername(username) != null) {
            if (userDao.findByUsername(username).getPassword().equals(password)) {
                return ResponseEntity.ok(userDao.findByUsername(username));
            }
            else {
                return ResponseEntity.badRequest().build();
            }
        }
        else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/addUser")
    public ResponseEntity<User> addUser(@RequestBody User user) {
        if (user.getPassword().length() >= 5) {
            userDao.save(user);
            PlayerInfo playerInfo = new PlayerInfo();
            playerInfo.setUser(user);
            playerInfoDao.save(playerInfo);
            Achievement achievement = new Achievement();
            achievement.setPlayerInfo(playerInfo);
            achievementDao.save(achievement);
            BoughtChar boughtChar = new BoughtChar();
            boughtChar.setPlayer_info(playerInfo);
            boughtChar.setCharBuy(characterDao.findById(1).get());
            boughtChar.setIsSelected(true);
            boughtCharDao.save(boughtChar);
            return ResponseEntity.ok(user);
        }
        else {
            return ResponseEntity.badRequest().build();
        }
    }
}
