package com.agricultura.repository;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.agricultura.domain.Tarefa;

@Repository
public interface TarefaRepository extends JpaRepository<Tarefa, Long> {

    @EntityGraph(attributePaths = {"user", "cultura"})
    List<Tarefa> findByUserId(Long userId);

    @EntityGraph(attributePaths = {"user", "cultura"})
    List<Tarefa> findByCulturaId(Long culturaId);
}
