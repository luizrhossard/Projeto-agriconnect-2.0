package com.agricultura.repository;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.agricultura.domain.PrecoMercado;

@Repository
public interface PrecoMercadoRepository extends JpaRepository<PrecoMercado, Long> {

    @EntityGraph(attributePaths = {"user"})
    List<PrecoMercado> findByProdutoContainingIgnoreCase(String produto);

    @EntityGraph(attributePaths = {"user"})
    List<PrecoMercado> findByUserId(Long userId);
}
