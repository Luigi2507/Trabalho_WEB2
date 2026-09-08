import { Injectable } from '@angular/core';
import { HistoricoItem, Solicitacao } from '../shared/models/solicitacao.model';

const LS_CHAVE = "solicitacoes"

@Injectable({
    providedIn: 'root'
})

//METODOS
export class SolicitacaoService {
    // mostrar todas as soliciatacoes
    listarTodos() : Solicitacao[] {
        const solicitacoes = localStorage[LS_CHAVE]
        if (!solicitacoes) return [];

        const parsed = JSON.parse(solicitacoes);
        
        // Garante que as strings venham como instâncias reais de Date
        return parsed.map((s: any) => {
        s.dataHora = new Date(s.dataHora);
        if (s.dataPagamento) s.dataPagamento = new Date(s.dataPagamento);
        if (s.historico) {
            s.historico = s.historico.map((h: any) => new HistoricoItem(new Date(h.dataHora), h.status, h.funcionario));
        }
        return s;
        });
    } 

    //inserir uma nova solicitacao
    inserir(solicitacao : Solicitacao) : void{
        const solicitacoes = this.listarTodos()
        solicitacao.id = new Date().getTime() // gera id unico usando a data e hora exata em milissegundos
        solicitacao.dataHora = new Date()
        solicitacao.status = "ABERTA"
        solicitacao.historico = [new HistoricoItem(new Date(), "ABERTA", "CLIENTE")]
        solicitacoes.push(solicitacao)
        localStorage[LS_CHAVE] = JSON.stringify(solicitacoes) //armazena no localtorage
    }

    //retornar uma solicitacao por id
    buscarPorID(id : number) : Solicitacao | undefined {
        const solicitacoes = this.listarTodos()
        return solicitacoes.find(solicitacoes => solicitacoes.id === id)
    }

    //atualizar solicitaçao (aprovar /rejeitar orçamento, resgatar e confirmar pagamento)
    atualizar(Solicitacao : Solicitacao) : void {
        const solicitacoes = this.listarTodos()
        solicitacoes.forEach((obj, index, objs) => { 
            if ( Solicitacao.id === obj.id){
                objs[index] = Solicitacao
            }
        });
        localStorage[LS_CHAVE] = JSON.stringify(solicitacoes)
    }

}
