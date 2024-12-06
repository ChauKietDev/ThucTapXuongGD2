package com.example.thuctapxuong.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity @Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
public class User {
    @Id
    private String username;
    private String password;

    @JsonIgnore
    @OneToMany(mappedBy = "user")
    private List<PlayerInfo> playerInfos;
//
//    @JsonIgnore
//    @OneToMany(mappedBy = "user")
//    private List<Achievement> achievements;
}
