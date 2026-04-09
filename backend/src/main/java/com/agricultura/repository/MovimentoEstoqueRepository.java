package com.agricultura.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.agricultura.domain.MovimentoEstoque;

@Repository
public interface MovimentoEstoqueRepository extends JpaRepository<MovimentoEstoque, Long> {

    @EntityGraph(attributePaths = {"insumo", "user"})
    Page<MovimentoEstoque> findByInsumoId(Long insumoId, Pageable pageable);

    @EntityGraph(attributePaths = {"insumo", "user"})
    Page<MovimentoEstoque> findByUserId(Long userId, Pageable pageable);
}
