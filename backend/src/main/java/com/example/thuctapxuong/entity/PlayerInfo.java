package com.example.thuctapxuong.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "player_information")
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class PlayerInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer highestScore = 0;
    private Integer numberOfTurns = 6;
    private Integer currentTurns = 6;
    private LocalDateTime timeUsedTurn;
    private LocalDateTime timeAddTurn;

    @JsonIgnore
    @OneToMany(mappedBy = "playerInfo", fetch = FetchType.EAGER)
    private List<Achievement> achievements;

    @JsonIgnore
    @OneToMany(mappedBy = "player_info", fetch = FetchType.EAGER)
    private List<BoughtChar> boughtChars;

    @ManyToOne
    @JoinColumn(name = "username")
    private User user;

}
