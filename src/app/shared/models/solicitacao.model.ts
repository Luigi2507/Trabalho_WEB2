//solicitação de manutencao
export class Solicitacao {
  constructor(
    public id: number = 0,
    public clienteCpf: string = "",
    public clienteNome: string = "",
    public descricaoEquipamento: string = "",
    public categoria: string = "",
    public descricaoDefeito: string = "",
    public dataHora: Date = new Date(),
    public status: string = "ABERTA",
    public orcamento: number = 0,
    public motivoRejeicao: string = "",
    public dataPagamento: Date | null = null,
    public historico: HistoricoItem[] = [], // cada solicitação carrega uma lista de eventos
    public funcionarioOrcamento: string = "",
    public descricaoManutencao: string = "",       
    public orientacoesCliente: string = "",       
    public funcionarioManutencao: string = "",  
    public funcionarioAtual: string = "",   
    public funcionarioFinalizacao: string = "",
    public dataFinalizacao: Date | null = null
  ) {}
}

//classe auxliar para registrar cada evento no histórico
export class HistoricoItem {
  constructor(
    public dataHora: Date = new Date(),
    public status: string = "",
    public funcionario: string = ""
  ) {}
}