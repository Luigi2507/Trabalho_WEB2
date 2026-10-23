package br.net.webtech.webtech.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String remetente;

    public EmailService(JavaMailSender mailSender, @Value("${spring.mail.username}") String remetente) {
        this.mailSender = mailSender;
        this.remetente = remetente;
    }

    /** Envia a senha gerada. Se falhar, lança MailException (RuntimeException). */
    public void enviarSenha(String destino, String nome, String senha) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(remetente);
        msg.setTo(destino);
        msg.setSubject("WebTech - Seu cadastro foi realizado");
        msg.setText("Olá, " + nome + "!\n\n"
                + "Seu cadastro foi realizado com sucesso.\n"
                + "Sua senha de acesso é: " + senha + "\n\n"
                + "Use o seu e-mail e esta senha para entrar no sistema.");
        mailSender.send(msg);
    }
}
