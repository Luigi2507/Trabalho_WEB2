import { Injectable } from '@angular/core';
import { HistoricoItem, Solicitacao } from '../shared/models/solicitacao.model';

const LS_CHAVE = "solicitacoes"

@Injectable({
    providedIn: 'root'
})

//METODOS
export class SolicitacaoService {
    // mostrar todas as soliciatacoes
    listarTodos(): Solicitacao[] {
        const solicitacoes = localStorage[LS_CHAVE];
        if (!solicitacoes) return [];
        const lista = JSON.parse(solicitacoes);
        return lista.map((s: any) => this.reviverDatas(s));
    }

    //inserir uma nova solicitacao
    inserir(solicitacao : Solicitacao) : void{
        const solicitacoes = this.listarTodos()
        solicitacao.id = new Date().getTime() // gera id unico usando a data e hora exata em milissegundos
        solicitacao.dataHora = new Date()
        solicitacao.status = "ABERTA"
        solicitacao.historico = [new HistoricoItem(new Date(), "ABERTA", `${solicitacao.clienteNome} (Cliente)`)]
        solicitacoes.push(solicitacao)
        localStorage[LS_CHAVE] = JSON.stringify(solicitacoes) //armazena no localtorage
    }

    //retornar uma solicitacao por id
    buscarPorID(id : number) : Solicitacao | undefined {
        const solicitacoes = this.listarTodos()
        return solicitacoes.find(solicitacoes => solicitacoes.id === id)
    }

    //atualizar solicitaçao (aprovar /rejeitar orçamento, resgatar e confirmar pagamento)
    atualizar(solicitacao : Solicitacao) : void {
        const solicitacoes = this.listarTodos()
        solicitacoes.forEach((obj, index, objs) => { 
            if ( solicitacao.id === obj.id){
                objs[index] = solicitacao
            }
        });
        localStorage[LS_CHAVE] = JSON.stringify(solicitacoes)
    }
    
    //converte os campos de data do lS para objetos date
    private reviverDatas(s: any): Solicitacao {
        s.dataHora = new Date(s.dataHora);
        s.dataPagamento = s.dataPagamento ? new Date(s.dataPagamento) : null;
        s.dataFinalizacao = s.dataFinalizacao ? new Date(s.dataFinalizacao) : null;
    
        //datas do historico tbm
        s.historico = (s.historico || []).map((h: any) => ({...h,dataHora: new Date(h.dataHora)}));
        return s;
    }
}