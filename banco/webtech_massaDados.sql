
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
  (1, '80010-100', 'Rua das Flores', '100', NULL, 'Centro', 'Curitiba', 'PR'),
  (2, '80020-200', 'Avenida das Palmeiras', '250', 'Apto 12', 'Batel', 'Curitiba', 'PR'),
  (3, '80030-300', 'Rua do Comércio', '75', NULL, 'Água Verde', 'Curitiba', 'PR'),
  (4, '80040-400', 'Travessa dos Ipês', '310', 'Casa 2', 'Portão', 'Curitiba', 'PR');
 
-- USUÁRIOS (senha_hash = SHA-256(salt + senha))
INSERT INTO usuario (id, nome, email, senha_hash, salt, perfil_id) VALUES
  (1, 'Maria Oliveira', 'maria@gmail.com', 'cd52399461c67b17a62b9e696df6c169b7b4128c65131044cb30c09311de0310', 'ae66928b7b52aafc2c9bed2e6e65cabe', 2),
  (2, 'Mário Souza', 'mario@gmail.com', 'ebafe7fc645921dacd18434683bfd4bad4d45419c3fc665c7e41995943a56e9a', '569801ba69c4d6ed956329e12c843c14', 2),
  (3, 'João Pereira', 'joao@gmail.com', '2773b1f9e84446c57f4e9c6783f837e0bb59528ce7e920a85b553b33c5402d13', 'c7ca45ab83406cf15132b74916dea1ac', 1),
  (4, 'José Almeida', 'jose@email.com', 'aa610345716778826ecae73f7f424255b5ef1c41ff958c9e84782a95ade43d8d', 'dca7ef83a5d6520d7380180fe42947ac', 1),
  (5, 'Joana Costa', 'joana@email.com', 'd9e07366809840c8a5cc3b86f5a6a1e1f830a03d5f0c5e4d7338b615a22e90ae', '282b84d78ae6cf795515d14be0f691d5', 1),
  (6, 'Joaquina Ribeiro', 'joaquina@email.com', 'ca1e6fdfbc36bbfd49dffdcc0050762e1cbf1cce1d36e50e0a8e1b00d84377c1', '21b15ae3603dd85efa5b8b5b00aedbb0', 1);
 
-- FUNCIONÁRIOS
INSERT INTO funcionario (usuario_id, data_nascimento) VALUES
  (1, '1988-03-12'),
  (2, '1985-07-25');
 
-- CLIENTES
INSERT INTO cliente (usuario_id, cpf, telefone, endereco_id) VALUES
  (3, '111.444.777-35', '(41) 99100-0001', 1),
  (4, '222.333.444-05', '(41) 99100-0002', 2),
  (5, '333.222.111-69', '(41) 99100-0003', 3),
  (6, '444.555.666-19', '(41) 99100-0004', 4);
 
-- SOLICITAÇÕES (26, em todos os estados)
INSERT INTO solicitacao (id, cliente_id, categoria_equipamento_id, descricao_equipamento, descricao_defeito, status_id, data_hora_abertura, valor_orcamento, orcamento_funcionario_id, data_hora_orcamento, motivo_rejeicao, descricao_manutencao, orientacoes_cliente, manutencao_funcionario_id, data_hora_manutencao, funcionario_atual_id, data_hora_pagamento, finalizacao_funcionario_id, data_hora_finalizacao) VALUES
  (1, 3, 1, 'Notebook Dell Inspiron 15', 'Não liga, luz de carregamento piscando', 8, '2026-09-14 09:10:00', 350.00, 1, '2026-09-14 15:40:00', NULL, 'Troca do conector de carga e limpeza da placa.', 'Usar apenas o carregador original e evitar dobrar o cabo.', 1, '2026-09-16 14:20:00', 1, '2026-09-17 11:00:00', 1, '2026-09-18 09:30:00'),
  (2, 4, 3, 'Impressora HP LaserJet P1102', 'Papel enrosca e sai manchado', 8, '2026-09-15 10:30:00', 180.00, 2, '2026-09-15 16:10:00', NULL, 'Substituição do rolo de tração e limpeza do fusor.', 'Evitar papel úmido ou muito fino.', 2, '2026-09-17 15:00:00', 2, '2026-09-18 10:20:00', 2, '2026-09-21 08:50:00'),
  (3, 5, 2, 'Desktop Positivo Master', 'Reinicia sozinho após alguns minutos', 8, '2026-09-18 08:25:00', 420.00, 1, '2026-09-18 14:00:00', NULL, 'Troca da fonte de alimentação e da pasta térmica.', 'Manter o gabinete em local ventilado.', 2, '2026-09-22 16:00:00', 2, '2026-09-23 10:15:00', 1, '2026-09-24 09:00:00'),
  (4, 6, 5, 'Teclado mecânico Redragon', 'Várias teclas não respondem', 8, '2026-09-22 13:45:00', 90.00, 2, '2026-09-22 17:20:00', NULL, 'Troca de três switches e limpeza da placa.', 'Evitar consumir alimentos sobre o teclado.', 2, '2026-09-24 10:50:00', 2, '2026-09-25 14:05:00', 2, '2026-09-28 09:40:00'),
  (5, 3, 4, 'Mouse Logitech M170', 'Botão esquerdo clicando duas vezes', 8, '2026-09-25 11:15:00', 45.00, 1, '2026-09-25 15:30:00', NULL, 'Substituição do microswitch do botão esquerdo.', 'Não pressionar os botões com força excessiva.', 1, '2026-09-28 14:30:00', 1, '2026-09-29 10:10:00', 1, '2026-09-30 11:20:00'),
  (6, 4, 1, 'Notebook Lenovo IdeaPad 3', 'Tela quebrada após queda', 7, '2026-10-01 09:30:00', 780.00, 1, '2026-10-01 14:45:00', NULL, 'Substituição do painel LCD e teste de brilho e cores.', 'Transportar o notebook em mochila acolchoada.', 1, '2026-10-05 15:20:00', 1, '2026-10-06 11:40:00', NULL, NULL),
  (7, 5, 3, 'Impressora Epson L3150', 'Cabeça de impressão entupida', 7, '2026-10-02 10:10:00', 210.00, 2, '2026-10-02 16:30:00', NULL, 'Limpeza química da cabeça de impressão e troca das borrachas.', 'Imprimir ao menos uma página por semana para evitar entupimento.', 2, '2026-10-06 14:00:00', 2, '2026-10-07 09:50:00', NULL, NULL),
  (8, 6, 3, 'Impressora Canon G3110', 'Não puxa o papel', 4, '2026-10-05 14:10:00', 340.00, 1, '2026-10-05 17:25:00', 'Valor acima do esperado, preciso pensar melhor', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  (9, 6, 2, 'PC Gamer Ryzen 5', 'Superaquecimento e desligamento durante jogos', 7, '2026-10-05 15:00:00', 320.00, 1, '2026-10-06 10:35:00', NULL, 'Troca do cooler do processador e reaplicação de pasta térmica.', 'Limpar os filtros de poeira a cada três meses.', 1, '2026-10-08 11:10:00', 1, '2026-10-09 16:25:00', NULL, NULL),
  (10, 4, 4, 'Mouse Microsoft sem fio', 'Não conecta no receptor USB', 8, '2026-10-06 09:00:00', 60.00, 2, '2026-10-06 13:15:00', NULL, 'Troca do receptor USB e reconfiguração do pareamento.', 'Guardar o receptor na porta USB do próprio mouse.', 2, '2026-10-07 17:00:00', 2, '2026-10-08 10:00:00', 1, '2026-10-09 09:15:00'),
  (11, 3, 5, 'Teclado Dell KB216', 'Líquido derramado, teclas travando', 6, '2026-10-07 10:20:00', 70.00, 1, '2026-10-07 15:45:00', NULL, 'Limpeza com álcool isopropílico e secagem completa da membrana.', 'Não usar o teclado por 24 horas após a retirada.', 1, '2026-10-12 14:50:00', 1, NULL, NULL, NULL),
  (12, 6, 1, 'Notebook Acer Aspire 5', 'Bateria não segura carga', 6, '2026-10-08 08:55:00', 290.00, 2, '2026-10-08 13:20:00', NULL, 'Substituição da bateria e calibragem do medidor de carga.', 'Fazer um ciclo completo de carga e descarga na primeira semana.', 2, '2026-10-13 11:25:00', 2, NULL, NULL, NULL),
  (13, 4, 2, 'PC Montado i5', 'Fonte queimada', 3, '2026-10-08 16:40:00', 550.00, 2, '2026-10-09 09:20:00', 'Encontrei um valor menor em outra assistência', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  (14, 5, 2, 'Desktop Dell OptiPlex 3020', 'Não dá vídeo ao ligar', 5, '2026-10-09 11:30:00', 150.00, 1, '2026-10-09 16:00:00', NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL),
  (15, 3, 1, 'Notebook Samsung Book', 'Teclado e touchpad não funcionam', 4, '2026-10-10 10:05:00', 260.00, 1, '2026-10-10 14:30:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  (16, 4, 3, 'Impressora Brother DCP-L2540', 'Erro de toner mesmo com toner novo', 5, '2026-10-12 09:50:00', 130.00, 2, '2026-10-12 15:10:00', NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL),
  (17, 5, 5, 'Teclado Logitech K120', 'Teclas com letras apagadas', 3, '2026-10-12 12:10:00', 120.00, 1, '2026-10-13 10:30:00', 'O conserto custa mais que um teclado novo', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  (18, 3, 1, 'Notebook HP Pavilion', 'Sistema operacional corrompido', 3, '2026-10-14 08:40:00', 400.00, 2, '2026-10-14 13:55:00', 'Prefiro formatar por conta própria', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  (19, 5, 4, 'Mouse Gamer Razer', 'Cursor travando', 4, '2026-10-14 09:25:00', 85.00, 2, '2026-10-14 11:50:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  (20, 6, 4, 'Mouse Multilaser sem fio', 'Scroll não funciona', 2, '2026-10-15 10:20:00', 35.00, 1, '2026-10-16 09:40:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  (21, 4, 1, 'Notebook Asus VivoBook', 'Dobradiça quebrada', 2, '2026-10-16 11:30:00', 230.00, 2, '2026-10-16 16:45:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  (22, 5, 2, 'Desktop All-in-One Lenovo', 'Lentidão extrema e travamentos', 2, '2026-10-17 08:50:00', 190.00, 1, '2026-10-19 10:30:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  (23, 3, 3, 'Impressora Samsung Xpress', 'Imprime com listras pretas', 1, '2026-10-19 15:20:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  (24, 6, 1, 'Notebook Positivo Motion', 'Wi-Fi não conecta', 1, '2026-10-20 08:15:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  (25, 4, 5, 'Teclado sem fio Multilaser', 'Não pareia com o computador', 1, '2026-10-20 09:40:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  (26, 5, 2, 'PC Workstation', 'Ruído alto no cooler', 1, '2026-10-20 10:55:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
 
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
 