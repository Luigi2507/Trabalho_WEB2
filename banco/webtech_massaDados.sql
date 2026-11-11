
USE webtech;
 
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE solicitacao_historico;
TRUNCATE TABLE solicitacao;
TRUNCATE TABLE cliente;
TRUNCATE TABLE funcionario;
TRUNCATE TABLE usuario;
TRUNCATE TABLE endereco;
SET FOREIGN_KEY_CHECKS = 1;
 
-- ENDEREÇOS
INSERT INTO endereco (id, cep, logradouro, numero, complemento, bairro, cidade, estado) VALUES
  (1, '60765-662', 'Travessa Osório Correia', '100', NULL, 'Parque Presidente Vargas', 'Fortaleza', 'CE'),
  (2, '35500-080', 'Rua São Sebastião', '250', 'Apartamento 12', 'Santa Clara', 'Divinópolis', 'MG'),
  (3, '77825-100', 'Rua 4', '75', NULL, 'Vila Couto Magalhães', 'Araguaína', 'TO'),
  (4, '85015-250', 'Rua Coronel Saldanha', '310', 'Casa 2', 'Santa Cruz', 'Guarapuava', 'PR');
 
-- USUÁRIOS (senha_hash = SHA-256(salt + senha))
INSERT INTO usuario (id, nome, email, senha_hash, salt, perfil_id) VALUES 
  (1, 'Maria Oliveira', 'maria@example.com', '2525382dd82e38cdaee2e0092c3166fca3617fd32eafdbc488725269f2d0c9f0', 'ae66928b7b52aafc2c9bed2e6e65cabe', 2), -- 6815
  (2, 'Mário Souza', 'mario@example.com', 'd93149e116e4362efd1a640794947a57e557113d81c8b17eecc1b27b3dbe060f', '569801ba69c4d6ed956329e12c843c14', 2), -- 6721
  (3, 'João Pereira', 'joao@example.com', '381dc979bd1d12d48dc609025a33040d836a6488bb205edd5fd506cecb675349', 'c7ca45ab83406cf15132b74916dea1ac', 1), -- 1385
  (4, 'José Almeida', 'jose@example.com', '5085cd6958d16026e05224c56ef89db98ba8b09b1d66b2fa763bd0bf3fe9b0ae', 'dca7ef83a5d6520d7380180fe42947ac', 1), -- 0295
  (5, 'Joana Costa', 'joana@example.com', '97fedabd05668778a9880febd962166f3ad810949789d92e986c318dbf76babc', '282b84d78ae6cf795515d14be0f691d5', 1), -- 8341
  (6, 'Joaquina Ribeiro', 'joaquina@example.com', 'eb5f9ff13c6c93ab70969554413c5699a0de1b203107881027ad83502852d2c1', '21b15ae3603dd85efa5b8b5b00aedbb0', 1); -- 7783

-- FUNCIONÁRIOS
INSERT INTO funcionario (usuario_id, data_nascimento) VALUES
  (1, '2007-02-10'),
  (2, '2001-12-25');
 
-- CLIENTES
INSERT INTO cliente (usuario_id, cpf, telefone, endereco_id) VALUES
  (3, '409.127.770-52', '(41) 99000-0001', 1),
  (4, '509.414.470-73', '(41) 99000-0002', 2),
  (5, '087.060.240-33', '(41) 99000-0003', 3),
  (6, '582.971.730-11', '(41) 99000-0004', 4);
 
-- SOLICITAÇÕES (26, em todos os estados)
INSERT INTO solicitacao (id, cliente_id, categoria_equipamento_id, descricao_equipamento, descricao_defeito, status_id, data_hora_abertura, valor_orcamento, orcamento_funcionario_id, data_hora_orcamento, motivo_rejeicao, descricao_manutencao, orientacoes_cliente, manutencao_funcionario_id, data_hora_manutencao, funcionario_atual_id, data_hora_pagamento, finalizacao_funcionario_id, data_hora_finalizacao) VALUES
  (1, 3, 1, 'Notebook Dell', 'Não liga, luz de carregamento piscando', 8, '2026-09-14 09:10:00', 350.00, 1, '2026-09-14 15:40:00', NULL, 'Troca do conector de carga', 'Usar apenas o carregador original e evitar dobrar o cabo.', 1, '2026-09-16 14:20:00', 1, '2026-09-17 11:00:00', 1, '2026-09-18 09:30:00'),
  (2, 4, 3, 'Impressora Epson', 'Papel enrosca e sai manchado', 8, '2026-09-15 10:30:00', 180.00, 2, '2026-09-15 16:10:00', NULL, 'Substituição do rolo de tração e limpeza do fusor.', 'Evitar papel úmido.', 2, '2026-09-17 15:00:00', 2, '2026-09-18 10:20:00', 2, '2026-09-21 08:50:00'),
  (3, 5, 2, 'Desktop Positivo', 'Reinicia sozinho', 8, '2026-09-18 08:25:00', 420.00, 1, '2026-09-18 14:00:00', NULL, 'Troca da pasta térmica.', 'Manter o gabinete em local ventilado.', 2, '2026-09-22 16:00:00', 2, '2026-09-23 10:15:00', 1, '2026-09-24 09:00:00'),
  (4, 6, 5, 'Teclado mecânico ', 'Várias teclas não respondem', 8, '2026-09-22 13:45:00', 90.00, 2, '2026-09-22 17:20:00', NULL, 'Troca de três switches e limpeza da placa.', 'Evitar apertar forte as teclas.', 2, '2026-09-24 10:50:00', 2, '2026-09-25 14:05:00', 2, '2026-09-28 09:40:00'),
  (5, 3, 4, 'mouse microswitch', 'Botão esquerdo clicando duas vezes', 8, '2026-09-25 11:15:00', 45.00, 1, '2026-09-25 15:30:00', NULL, 'Substituição do microswitch do botão esquerdo.', 'Não pressionar os botões com força.', 1, '2026-09-28 14:30:00', 1, '2026-09-29 10:10:00', 1, '2026-09-30 11:20:00'),
  (6, 4, 1, 'Notebook Lenovo IdeaPad 3', 'Tela quebrada após queda', 7, '2026-10-01 09:30:00', 780.00, 1, '2026-10-01 14:45:00', NULL, 'Substituição do painel.', 'Evitar deixar cair', 1, '2026-10-05 15:20:00', 1, '2026-10-06 11:40:00', NULL, NULL),
  (7, 5, 3, 'Impressora HP', 'Cabeça de impressão entupida', 7, '2026-10-02 10:10:00', 210.00, 2, '2026-10-02 16:30:00', NULL, 'Limpeza e troca das borrachas.', 'Imprimir ao menos uma página por semana para evitar entupimento.', 2, '2026-10-06 14:00:00', 2, '2026-10-07 09:50:00', NULL, NULL),
  (8, 6, 3, 'Impressora Smart', 'Não puxa o papel', 4, '2026-10-05 14:10:00', 340.00, 1, '2026-10-05 17:25:00', 'Valor acima do esperado.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  (9, 6, 2, 'PC Gamer', 'Superaquecimento e desligamento durante jogos', 7, '2026-10-05 15:00:00', 320.00, 1, '2026-10-06 10:35:00', NULL, 'Troca do processador e reaplicação de pasta térmica.', 'Limpar os filtros de poeira a cada três meses.', 1, '2026-10-08 11:10:00', 1, '2026-10-09 16:25:00', NULL, NULL),
  (10, 4, 4, 'Mouse Microsoft sem fio', 'Não conecta no receptor USB', 8, '2026-10-06 09:00:00', 60.00, 2, '2026-10-06 13:15:00', NULL, 'Troca do receptor USB e reconfiguração do pareamento.', 'Guardar o receptor na porta USB do próprio mouse.', 2, '2026-10-07 17:00:00', 2, '2026-10-08 10:00:00', 1, '2026-10-09 09:15:00'),
  (11, 3, 5, 'Teclado Katta', 'Líquido derramado, teclas travando', 6, '2026-10-07 10:20:00', 70.00, 1, '2026-10-07 15:45:00', NULL, 'Limpeza com álcool isopropílico e secagem completa.', 'Não usar o teclado por 24 horas após a retirada.', 1, '2026-10-12 14:50:00', 1, NULL, NULL, NULL),
  (12, 6, 1, 'Notebook Acer', 'Bateria não segura carga', 6, '2026-10-08 08:55:00', 290.00, 2, '2026-10-08 13:20:00', NULL, 'Substituição da bateria e calibragem do medidor de carga.', 'Fazer um ciclo completo de carga e descarga na primeira semana.', 2, '2026-10-13 11:25:00', 2, NULL, NULL, NULL),
  (13, 4, 2, 'PC Montado', 'Fonte queimada', 3, '2026-10-08 16:40:00', 550.00, 2, '2026-10-09 09:20:00', 'Encontrei um valor menor em outro lugar', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  (14, 5, 2, 'Desktop Dell', 'Não dá vídeo ao ligar', 5, '2026-10-09 11:30:00', 150.00, 1, '2026-10-09 16:00:00', NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL),
  (15, 3, 1, 'Notebook Samsung', 'Teclado e touchpad não funcionam', 4, '2026-10-10 10:05:00', 260.00, 1, '2026-10-10 14:30:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  (16, 4, 3, 'Impressora Multifuncional', 'Erro de toner mesmo com toner novo', 5, '2026-10-12 09:50:00', 130.00, 2, '2026-10-12 15:10:00', NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL),
  (17, 5, 5, 'Teclado gamer tgt', 'Teclas com letras apagadas', 3, '2026-10-12 12:10:00', 120.00, 1, '2026-10-13 10:30:00', 'O conserto custa mais que um teclado novo', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  (18, 3, 1, 'Notebook Apple', 'Sistema operacional corrompido', 3, '2026-10-14 08:40:00', 400.00, 2, '2026-10-14 13:55:00', 'Prefiro formatar em casa', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  (19, 5, 4, 'Mouse ergonomico', 'Cursor travando', 4, '2026-10-14 09:25:00', 85.00, 2, '2026-10-14 11:50:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  (20, 6, 4, 'Mouse logiTech', 'Scroll não funciona', 2, '2026-10-15 10:20:00', 35.00, 1, '2026-10-16 09:40:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  (21, 4, 1, 'Notebook Asus', 'Dobradiça quebrada', 2, '2026-10-16 11:30:00', 230.00, 2, '2026-10-16 16:45:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  (22, 5, 2, 'Desktop Lenovo', 'Lentidão extrema e travamentos', 2, '2026-10-17 08:50:00', 190.00, 1, '2026-10-19 10:30:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  (23, 3, 3, 'Impressora Samsung', 'Imprime com listras pretas', 1, '2026-10-19 15:20:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  (24, 6, 1, 'Notebook mac', 'Wi-Fi não conecta', 1, '2026-10-20 08:15:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  (25, 4, 5, 'Teclado ajjaz', 'Não pareia com o computador', 1, '2026-10-20 09:40:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  (26, 5, 2, 'PC', 'Ruído alto no cooler', 1, '2026-10-20 10:55:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
 
-- HISTÓRICO DE ALTERAÇÕES DE ESTADO
INSERT INTO solicitacao_historico (solicitacao_id, status_id, usuario_id, usuario_destino_id, data_hora) VALUES
  (1, 1, 3, NULL, '2026-09-14 09:10:00'),
  (1, 2, 1, NULL, '2026-09-14 15:40:00'),
  (1, 4, 3, NULL, '2026-09-15 10:05:00'),
  (1, 6, 1, NULL, '2026-09-16 14:20:00'),
  (1, 7, 3, NULL, '2026-09-17 11:00:00'),
  (1, 8, 1, NULL, '2026-09-18 09:30:00'),
  (2, 1, 4, NULL, '2026-09-15 10:30:00'),
  (2, 2, 2, NULL, '2026-09-15 16:10:00'),
  (2, 4, 4, NULL, '2026-09-16 09:45:00'),
  (2, 6, 2, NULL, '2026-09-17 15:00:00'),
  (2, 7, 4, NULL, '2026-09-18 10:20:00'),
  (2, 8, 2, NULL, '2026-09-21 08:50:00'),
  (3, 1, 5, NULL, '2026-09-18 08:25:00'),
  (3, 2, 1, NULL, '2026-09-18 14:00:00'),
  (3, 4, 5, NULL, '2026-09-19 09:10:00'),
  (3, 5, 1, 2, '2026-09-21 11:35:00'),
  (3, 6, 2, NULL, '2026-09-22 16:00:00'),
  (3, 7, 5, NULL, '2026-09-23 10:15:00'),
  (3, 8, 1, NULL, '2026-09-24 09:00:00'),
  (4, 1, 6, NULL, '2026-09-22 13:45:00'),
  (4, 2, 2, NULL, '2026-09-22 17:20:00'),
  (4, 4, 6, NULL, '2026-09-23 08:40:00'),
  (4, 6, 2, NULL, '2026-09-24 10:50:00'),
  (4, 7, 6, NULL, '2026-09-25 14:05:00'),
  (4, 8, 2, NULL, '2026-09-28 09:40:00'),
  (5, 1, 3, NULL, '2026-09-25 11:15:00'),
  (5, 2, 1, NULL, '2026-09-25 15:30:00'),
  (5, 4, 3, NULL, '2026-09-26 09:00:00'),
  (5, 6, 1, NULL, '2026-09-28 14:30:00'),
  (5, 7, 3, NULL, '2026-09-29 10:10:00'),
  (5, 8, 1, NULL, '2026-09-30 11:20:00'),
  (6, 1, 4, NULL, '2026-10-01 09:30:00'),
  (6, 2, 1, NULL, '2026-10-01 14:45:00'),
  (6, 4, 4, NULL, '2026-10-02 10:00:00'),
  (6, 6, 1, NULL, '2026-10-05 15:20:00'),
  (6, 7, 4, NULL, '2026-10-06 11:40:00'),
  (7, 1, 5, NULL, '2026-10-02 10:10:00'),
  (7, 2, 2, NULL, '2026-10-02 16:30:00'),
  (7, 4, 5, NULL, '2026-10-05 09:25:00'),
  (7, 6, 2, NULL, '2026-10-06 14:00:00'),
  (7, 7, 5, NULL, '2026-10-07 09:50:00'),
  (8, 1, 6, NULL, '2026-10-05 14:10:00'),
  (8, 2, 1, NULL, '2026-10-05 17:25:00'),
  (8, 3, 6, NULL, '2026-10-06 09:30:00'),
  (8, 4, 6, NULL, '2026-10-14 15:15:00'),
  (9, 1, 6, NULL, '2026-10-05 15:00:00'),
  (9, 2, 1, NULL, '2026-10-06 10:35:00'),
  (9, 4, 6, NULL, '2026-10-06 18:00:00'),
  (9, 6, 1, NULL, '2026-10-08 11:10:00'),
  (9, 7, 6, NULL, '2026-10-09 16:25:00'),
  (10, 1, 4, NULL, '2026-10-06 09:00:00'),
  (10, 2, 2, NULL, '2026-10-06 13:15:00'),
  (10, 4, 4, NULL, '2026-10-07 08:30:00'),
  (10, 6, 2, NULL, '2026-10-07 17:00:00'),
  (10, 7, 4, NULL, '2026-10-08 10:00:00'),
  (10, 8, 1, NULL, '2026-10-09 09:15:00'),
  (11, 1, 3, NULL, '2026-10-07 10:20:00'),
  (11, 2, 1, NULL, '2026-10-07 15:45:00'),
  (11, 4, 3, NULL, '2026-10-08 09:35:00'),
  (11, 6, 1, NULL, '2026-10-12 14:50:00'),
  (12, 1, 6, NULL, '2026-10-08 08:55:00'),
  (12, 2, 2, NULL, '2026-10-08 13:20:00'),
  (12, 4, 6, NULL, '2026-10-09 10:40:00'),
  (12, 6, 2, NULL, '2026-10-13 11:25:00'),
  (13, 1, 4, NULL, '2026-10-08 16:40:00'),
  (13, 2, 2, NULL, '2026-10-09 09:20:00'),
  (13, 3, 4, NULL, '2026-10-09 18:10:00'),
  (14, 1, 5, NULL, '2026-10-09 11:30:00'),
  (14, 2, 1, NULL, '2026-10-09 16:00:00'),
  (14, 4, 5, NULL, '2026-10-13 09:15:00'),
  (14, 5, 1, 2, '2026-10-14 10:40:00'),
  (15, 1, 3, NULL, '2026-10-10 10:05:00'),
  (15, 2, 1, NULL, '2026-10-10 14:30:00'),
  (15, 4, 3, NULL, '2026-10-13 16:00:00'),
  (16, 1, 4, NULL, '2026-10-12 09:50:00'),
  (16, 2, 2, NULL, '2026-10-12 15:10:00'),
  (16, 4, 4, NULL, '2026-10-13 08:20:00'),
  (16, 5, 2, 1, '2026-10-14 14:35:00'),
  (16, 5, 1, 2, '2026-10-15 09:45:00'),
  (16, 5, 2, 1, '2026-10-16 11:05:00'),
  (17, 1, 5, NULL, '2026-10-12 12:10:00'),
  (17, 2, 1, NULL, '2026-10-13 10:30:00'),
  (17, 3, 5, NULL, '2026-10-14 09:05:00'),
  (18, 1, 3, NULL, '2026-10-14 08:40:00'),
  (18, 2, 2, NULL, '2026-10-14 13:55:00'),
  (18, 3, 3, NULL, '2026-10-15 10:15:00'),
  (19, 1, 5, NULL, '2026-10-14 09:25:00'),
  (19, 2, 2, NULL, '2026-10-14 11:50:00'),
  (19, 4, 5, NULL, '2026-10-15 08:45:00'),
  (20, 1, 6, NULL, '2026-10-15 10:20:00'),
  (20, 2, 1, NULL, '2026-10-16 09:40:00'),
  (21, 1, 4, NULL, '2026-10-16 11:30:00'),
  (21, 2, 2, NULL, '2026-10-16 16:45:00'),
  (22, 1, 5, NULL, '2026-10-17 08:50:00'),
  (22, 2, 1, NULL, '2026-10-19 10:30:00'),
  (23, 1, 3, NULL, '2026-10-19 15:20:00'),
  (24, 1, 6, NULL, '2026-10-20 08:15:00'),
  (25, 1, 4, NULL, '2026-10-20 09:40:00'),
  (26, 1, 5, NULL, '2026-10-20 10:55:00');
 