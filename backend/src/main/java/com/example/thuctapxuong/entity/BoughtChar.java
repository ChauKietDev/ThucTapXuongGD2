package com.example.thuctapxuong.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity @Table(name = "bought_chars")
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
public class BoughtChar {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "playerinfoId")
    private PlayerInfo player_info;

    @ManyToOne
    @JoinColumn(name = "charId")
    private Character charBuy;

    private Boolean isSelected = false;
}
