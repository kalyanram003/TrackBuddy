package com.kalyan.RemoteWorkTracker.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.*;
import java.util.stream.Stream;

import javax.print.Doc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.itextpdf.text.Chunk;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.kalyan.RemoteWorkTracker.Model.Task;

@Service
public class PdfReportService {
    @Autowired
    private TaskService taskService;
    
    public ByteArrayInputStream generatePdfReport(Long userId) throws DocumentException{
        List<Task> tasks = taskService.findByUserId(userId);
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, out);
        document.open();
        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
        Paragraph title = new Paragraph("Task Report", font);
        title.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(title);
        document.add(Chunk.NEWLINE);
        
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);

        Stream.of("ID", "Title", "Description", "Due Time").forEach(headerTitle -> {
            PdfPCell header = new PdfPCell();
            Font headFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
            header.setPhrase(new Phrase(headerTitle, headFont));
            table.addCell(header);
        });

        for(Task task : tasks) {
            table.addCell(task.getDescription());
            table.addCell(task.getDueDate().toString());
            table.addCell(task.getPriority().toString());
            table.addCell(task.getStatus().toString());
        }

        document.add(table);

        document.close();

        return new ByteArrayInputStream(out.toByteArray());

    }

}
