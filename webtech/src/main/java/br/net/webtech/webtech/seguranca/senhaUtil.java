package br.net.webtech.webtech.seguranca;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.HexFormat;

public final class senhaUtil {
    private static final SecureRandom random = new SecureRandom();
    
    private senhaUtil(){}

    public static String gerarSalt(){
        byte[] bytes = new byte[16]; 
        random.nextBytes(bytes);
        return HexFormat.of().formatHex(bytes);
    }

    public static String gerarSenhaNumerica() {
        return String.format("%04d", random.nextInt(10000));
    }

    public static String gerarHash (String salt, String senha){
        try{
            MessageDigest md = MessageDigest.getInstance("SHA-256"); 
            byte[] resultado = md.digest((salt + senha).getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(resultado);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 indisponível", e); 
        }
    }

    public static boolean confere(String salt, String senhaDigitada, String hashGravado) {
        return MessageDigest.isEqual(gerarHash(salt, senhaDigitada).getBytes(StandardCharsets.UTF_8),
        hashGravado.getBytes(StandardCharsets.UTF_8));
    }
}