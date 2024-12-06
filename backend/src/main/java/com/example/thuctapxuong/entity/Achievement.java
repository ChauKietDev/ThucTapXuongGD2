package com.example.thuctapxuong.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity @Table(name = "achievements")
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
public class Achievement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "playerInfoId")
    private PlayerInfo playerInfo;
}
