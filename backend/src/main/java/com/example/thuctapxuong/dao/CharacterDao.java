package com.example.thuctapxuong.dao;

import com.example.thuctapxuong.entity.Character;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CharacterDao extends JpaRepository<Character, Integer> {
    @Query("select c from Character c " +
            "order by c.id " +
            "limit :items " +
            "offset :position")
    List<Character> pagination(int items, int position);
}
