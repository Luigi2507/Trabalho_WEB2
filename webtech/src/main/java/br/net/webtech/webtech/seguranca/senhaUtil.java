package br.net.webtech.webtech.seguranca;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.HexFormat;

public final class senhaUtil {
    private static final SecureRandom random = new SecureRandom(); // gerador de números aleatórios criptograficamente seguros

    private senhaUtil(){}

    public static String gerarSalt(){
        byte[] bytes = new byte[16]; //16 bytes é um tamanho seguro para o salt
        random.nextBytes(bytes); //preenchr com valores numéricos aleatórios
        return HexFormat.of().formatHex(bytes);
    }

    public static String gerarSenhaNumerica() {
        return String.format("%04d", random.nextInt(10000));
    }

    public static String gerarHash (String salt, String senha){
        try{
            MessageDigest md = MessageDigest.getInstance("SHA-256"); // Inicializa o gerador de hash usando o algoritmo de criptografia SHA-256.
            byte[] resultado = md.digest((salt + senha).getBytes(StandardCharsets.UTF_8)); // Calcula o hash SHA-256 combinando o salt e a senha convertidos em bytes.
            return HexFormat.of().formatHex(resultado); // Converte o array do hash resultante em string hexadecimal.
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 indisponível", e); // caso o algoritmo não seja encontrado.
        }
    }

      /** Confere a senha digitada com o hash gravado no banco. */
    public static boolean confere(String salt, String senhaDigitada, String hashGravado) {
        return MessageDigest.isEqual(gerarHash(salt, senhaDigitada).getBytes(StandardCharsets.UTF_8),
        hashGravado.getBytes(StandardCharsets.UTF_8));
    }
}