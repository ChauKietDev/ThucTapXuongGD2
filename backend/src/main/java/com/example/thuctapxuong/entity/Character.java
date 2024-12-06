package com.example.thuctapxuong.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity @Table(name = "characters")
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
public class Character {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private Double coins;
    private String image;
    private String power;
    private String otherDiamond;

    @JsonIgnore
    @OneToMany(mappedBy = "charBuy")
    private List<BoughtChar> boughtChars;
}
