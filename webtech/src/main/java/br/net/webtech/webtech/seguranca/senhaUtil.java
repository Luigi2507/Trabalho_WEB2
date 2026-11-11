package br.net.webtech.webtech.seguranca;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.HexFormat;

public final class senhaUtil {
    private static final SecureRandom random = new SecureRandom();  // gera de n. aleatórios seguros
    
    private senhaUtil(){}
    
    // Gera um salt aleatório.
    public static String gerarSalt(){
        byte[] bytes = new byte[16]; 
        random.nextBytes(bytes); // Preenche o array com bytes aleatórios
        return HexFormat.of().formatHex(bytes);  // Converte p/ uma representação hexadecimal em stg
    }

     // Gera uma senha de 4 num.
    public static String gerarSenhaNumerica() {
        return String.format("%04d", random.nextInt(10000));
    }
    
    // Gera o hash da senha utilizando o salt.
    public static String gerarHash (String salt, String senha){
        try{
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] resultado = md.digest((salt + senha).getBytes(StandardCharsets.UTF_8)); // junta o salt com a senha, converte o texto para bytes e calcula o hash
            return HexFormat.of().formatHex(resultado);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 indisponível", e); // Se o algoritmo SHA-256 não estiver disponível,
        }
    }

    // Verifica se a senha corresponde ao hash
    public static boolean confere(String salt, String senhaDigitada, String hashGravado) {
        return MessageDigest.isEqual(gerarHash(salt, senhaDigitada).getBytes(StandardCharsets.UTF_8),
        hashGravado.getBytes(StandardCharsets.UTF_8));
    }
}