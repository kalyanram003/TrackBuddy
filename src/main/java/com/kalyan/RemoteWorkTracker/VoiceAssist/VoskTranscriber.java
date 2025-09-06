package com.kalyan.RemoteWorkTracker.VoiceAssist;

import org.vosk.Model;
import org.vosk.Recognizer;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.io.IOException;

public class VoskTranscriber {
    private static Model model;

    static {
        try {
            model = new Model("model");
        } catch (IOException e) {
            throw new RuntimeException("Failed to load Vosk model", e);
        }
    }

    public static String transcribe(MultipartFile file) throws Exception {
        try (InputStream is = file.getInputStream();
             Recognizer recognizer = new Recognizer(model, 16000)) {

            byte[] buffer = new byte[4096];
            int n;
            while ((n = is.read(buffer)) >= 0) {
                if (recognizer.acceptWaveForm(buffer, n)) {
                    return recognizer.getResult();
                }
            }
            return recognizer.getFinalResult();
        }
    }
}
