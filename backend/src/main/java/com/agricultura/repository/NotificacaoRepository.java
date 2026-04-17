package com.agricultura.repository;

import com.agricultura.domain.Notificacao;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificacaoRepository extends JpaRepository<Notificacao, Long> {

    List<Notificacao> findByUsuarioIdOrderByDataCriacaoDesc(Long usuarioId);

    List<Notificacao> findByUsuarioIdAndLidaFalseOrderByDataCriacaoDesc(Long usuarioId);

    Long countByUsuarioIdAndLidaFalse(Long usuarioId);

    Optional<Notificacao> findByIdAndUsuarioId(Long id, Long usuarioId);
}
