package com.example.thuctapxuong.restController;

import com.example.thuctapxuong.dao.BoughtCharDao;
import com.example.thuctapxuong.dao.CharacterDao;
import com.example.thuctapxuong.dao.PlayerInfoDao;
import com.example.thuctapxuong.entity.BoughtChar;
import com.example.thuctapxuong.entity.Character;
import com.example.thuctapxuong.entity.PlayerInfo;
import com.example.thuctapxuong.service.BoughtCharService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/v1/shop")
public class ShopRestController {

    @Autowired
    CharacterDao characterDao;
    @Autowired
    BoughtCharDao boughtCharDao;
    @Autowired
    PlayerInfoDao playerInfoDao;

    @GetMapping("/getAllChar")
    public ResponseEntity<List<Character>> getAllChar() {
        if (!characterDao.findAll().isEmpty()) {
            return ResponseEntity.ok(characterDao.findAll());
        }
        else {
            return ResponseEntity.noContent().build();
        }
    }

    @GetMapping("/pagination/start-{position}/limit-{itemNumber}")
    public ResponseEntity<List<Character>> getCharByPosition(@PathVariable("position") int pos, @PathVariable int itemNumber) {
        if (!characterDao.pagination(itemNumber, pos).isEmpty()) {
            return ResponseEntity.ok(characterDao.pagination(itemNumber, pos));
        }
        else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/boughtchar/{pId}")
    public ResponseEntity<List<BoughtChar>> getBoughtChar(@PathVariable("pId") int pId) {
        if (!boughtCharDao.findBoughtCharByPlayerInfo(pId).isEmpty()) {
            return ResponseEntity.ok(boughtCharDao.findBoughtCharByPlayerInfo(pId));
        }
        else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/boughtChar/{pId}-{charId}")
    public ResponseEntity<BoughtChar> getBoughtCharById(@PathVariable("pId") int pId, @PathVariable("charId") int charId) {
        if (boughtCharDao.findByPlayerInfoAndChar(pId, charId) != null) {
            return ResponseEntity.ok(boughtCharDao.findByPlayerInfoAndChar(pId, charId));
        }
        else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/boughtChar/selectedChar/playerId-{pId}")
    public ResponseEntity<BoughtChar> getSelectedCharByPlayerId(@PathVariable("pId") int pId) {
        if (boughtCharDao.findByPlayerInfoIsSelected(pId) != null) {
            return ResponseEntity.ok(boughtCharDao.findByPlayerInfoIsSelected(pId));
        }
        else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/buyChar/playerId-{pId}/charId-{cId}")
    public ResponseEntity<BoughtChar> addBoughtChar(@PathVariable("pId") int pId, @PathVariable("cId") int cId) {
//        if (boughtCharDao.findByPlayerInfoAndChar(pId, cId) == null) {
            BoughtChar bc = new BoughtChar();
            PlayerInfo curPlayerInfo = playerInfoDao.findById(pId).get();
            Character charBuy = characterDao.findById(cId).get();
            bc.setPlayer_info(curPlayerInfo);
            bc.setCharBuy(charBuy);
            return ResponseEntity.ok(boughtCharDao.save(bc));
//        }
//        else {
//            return ResponseEntity.badRequest().build();
//        }
    }

    @PutMapping("/boughtChar/updateStatus/playerId-{pId}/charId-{cId}/selected-{isSelected}")
    public ResponseEntity<BoughtChar> updateBoughtChar(@PathVariable("pId") int pId, @PathVariable("cId") int cId, @PathVariable("isSelected") boolean isSelected) {
        if (boughtCharDao.findByPlayerInfoAndChar(pId, cId) != null) {
            BoughtChar selectBoughtChar = boughtCharDao.findByPlayerInfoAndChar(pId, cId);
            selectBoughtChar.setIsSelected(isSelected);
            return ResponseEntity.ok(boughtCharDao.save(selectBoughtChar));
        }
        else {
            return ResponseEntity.notFound().build();
        }
    }
}
