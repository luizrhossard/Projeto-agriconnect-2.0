package com.agricultura.repository;

import com.agricultura.domain.Cultura;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CulturaRepository extends JpaRepository<Cultura, Long> {

    @EntityGraph(attributePaths = {"user"})
    List<Cultura> findByUserId(Long userId);
}
