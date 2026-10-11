export class Cliente {
  constructor(
    public id: number = 0,
    public cpf: string = "",
    public nome: string = "",
    public email: string = "",
    public telefone: string = "",
    public cep: string = "",
    public logradouro: string = "",
    public numero: string = "",
    public complemento: string = "",
    public bairro: string = "",
    public cidade: string = "",
    public estado: string = "",
    public senha: string = "",
    public perfil: string = "CLIENTE"
  ) {}
}