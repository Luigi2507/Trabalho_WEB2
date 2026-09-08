export class Solicitacao {
  constructor(
    public id: number = 0,
    public descricaoEquipamento: string = "",
    public categoria: string = "",
    public descricaoDefeito: string = "",
    public dataHora: Date = new Date(),
    public status: string = "ABERTA",
    public orcamento: number = 0,
    public motivoRejeicao: string = "",
    public dataPagamento: Date | null = null,
    public historico: HistoricoItem[] = [] // cada solicitação carrega uma lista de eventos
  ) {}
}

//classe auxliar, RF8
export class HistoricoItem {
  constructor(
    public dataHora: Date = new Date(),
    public status: string = "",
    public funcionario: string = ""
  ) {}
}