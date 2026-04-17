package com.agricultura.repository;

import com.agricultura.domain.MovimentoEstoque;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovimentoEstoqueRepository extends JpaRepository<MovimentoEstoque, Long> {

    @EntityGraph(attributePaths = {"insumo", "user"})
    Page<MovimentoEstoque> findByInsumoId(Long insumoId, Pageable pageable);

    @EntityGraph(attributePaths = {"insumo", "user"})
    Page<MovimentoEstoque> findByInsumoIdAndUserId(Long insumoId, Long userId, Pageable pageable);

    @EntityGraph(attributePaths = {"insumo", "user"})
    Page<MovimentoEstoque> findByUserId(Long userId, Pageable pageable);
}
