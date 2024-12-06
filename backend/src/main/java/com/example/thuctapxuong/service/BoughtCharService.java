package com.example.thuctapxuong.service;

import com.example.thuctapxuong.dao.BoughtCharDao;
import com.example.thuctapxuong.entity.BoughtChar;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BoughtCharService {
    @Autowired
    BoughtCharDao boughtCharDao;

    public boolean isBought(int pId, int charId) {
        List<BoughtChar> getBoughtChars = boughtCharDao.findBoughtCharByPlayerInfo(pId);
        boolean isBoughtChar = false;
        for (BoughtChar boughtChar : getBoughtChars) {
            if (boughtChar.getCharBuy().getId() == charId) {
                isBoughtChar = true;
                break;
            }
        }
        return isBoughtChar;
    }
}
