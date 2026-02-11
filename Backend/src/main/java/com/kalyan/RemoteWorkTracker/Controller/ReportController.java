package com.kalyan.RemoteWorkTracker.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kalyan.RemoteWorkTracker.DTOs.ReportSummaryDTO;
import com.kalyan.RemoteWorkTracker.Service.ReportService;

@RestController
@RequestMapping("/rwt/reports")
public class ReportController {
    
    @Autowired
    private ReportService reportService;
    @GetMapping("/summary/{userId}")
    public ResponseEntity<?> getReportSummary(@PathVariable Long userId) {
        try {
            ReportSummaryDTO report = reportService.generateReport(userId);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error generating report: " + e.getMessage());
        }
    }
}
