package pucp.edu.pe.sgta.service.imp;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xddf.usermodel.chart.*;
import org.apache.poi.xddf.usermodel.chart.BarDirection;
import org.apache.poi.xddf.usermodel.chart.BarGrouping;
import org.apache.poi.xddf.usermodel.chart.AxisPosition;
import org.apache.poi.xddf.usermodel.chart.AxisCrosses;
import org.apache.poi.xddf.usermodel.chart.AxisTickLabelPosition;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.*;
import pucp.edu.pe.sgta.service.inter.IReportService;
import pucp.edu.pe.sgta.service.inter.IExcelExportService;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Implementación del servicio para generar archivos Excel con gráficos embebidos
 * para reportes de coordinador
 */
@Service
public class ExcelExportServiceImpl implements IExcelExportService {

    private final IReportService reportService;

    public ExcelExportServiceImpl(IReportService reportService) {
        this.reportService = reportService;
    }

    /**
     * Genera un archivo Excel con datos y gráficos embebidos
     */
    @Override
    public ByteArrayOutputStream generateExcelWithCharts(ExcelExportConfigDto config, String cognitoSub, String ciclo) throws Exception {
        
        
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            
            // Crear estilos
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle titleStyle = createTitleStyle(workbook);
            CellStyle dataStyle = createDataStyle(workbook);

            // Generar hojas según la configuración
            if (config.getSections().contains("topics")) {
                createTopicsSheet(workbook, cognitoSub, ciclo, config, headerStyle, titleStyle, dataStyle);
            }
            
            if (config.getSections().contains("distribution")) {
                createDistributionSheet(workbook, cognitoSub, ciclo, config, headerStyle, titleStyle, dataStyle);
            }
            
            if (config.getSections().contains("performance")) {
                createPerformanceSheet(workbook, cognitoSub, ciclo, config, headerStyle, titleStyle, dataStyle);
            }

            // Escribir a ByteArrayOutputStream
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream;
        }
    }

    /**
     * Genera un archivo Excel solo con datos tabulares
     */
    @Override
    public ByteArrayOutputStream generateExcelWithTables(ExcelExportConfigDto config, String cognitoSub, String ciclo) throws Exception {
        
        
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            
            // Crear estilos
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle titleStyle = createTitleStyle(workbook);
            CellStyle dataStyle = createDataStyle(workbook);

            // Generar hojas según la configuración (solo tablas)
            if (config.getSections().contains("topics")) {
                createTopicsSheetTablesOnly(workbook, cognitoSub, ciclo, config, headerStyle, titleStyle, dataStyle);
            }
            
            if (config.getSections().contains("distribution")) {
                createDistributionSheetTablesOnly(workbook, cognitoSub, ciclo, config, headerStyle, titleStyle, dataStyle);
            }
            
            if (config.getSections().contains("performance")) {
                createPerformanceSheetTablesOnly(workbook, cognitoSub, ciclo, config, headerStyle, titleStyle, dataStyle);
            }

            // Escribir a ByteArrayOutputStream
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream;
        }
    }

    /**
     * Método legacy para compatibilidad
     */
    public byte[] generateExcelReport(String cognitoSub, String ciclo, ExcelExportConfigDto config) throws IOException {
        try (ByteArrayOutputStream outputStream = generateExcelWithCharts(config, cognitoSub, ciclo)) {
            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new IOException("Error generating Excel report", e);
        }
    }

    private void createTopicsSheet(XSSFWorkbook workbook, String cognitoSub, String ciclo, 
                                 ExcelExportConfigDto config, CellStyle headerStyle, 
                                 CellStyle titleStyle, CellStyle dataStyle) {
        
        XSSFSheet sheet = workbook.createSheet("Temas y Áreas");
        
        // Obtener datos
        List<TopicAreaStatsDTO> topicsData = reportService.getTopicAreaStatistics(cognitoSub, ciclo);
        List<TopicTrendDTO> trendsData = reportService.getTopicTrendsByYear(cognitoSub);
        
        int rowNum = 0;
        
        // Título principal
        Row titleRow = sheet.createRow(rowNum++);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("Reporte de Temas por Área - Ciclo " + ciclo);
        titleCell.setCellStyle(titleStyle);
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 3));
        
        rowNum++; // Línea en blanco
        
        if (!"charts".equals(config.getContentType())) {
            // Tabla de datos
            Row headerRow = sheet.createRow(rowNum++);
            String[] headers = {"Área de Conocimiento", "Cantidad de Temas", "Porcentaje"};
            
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }
            
            // Datos de la tabla
            for (TopicAreaStatsDTO topic : topicsData) {
                Row dataRow = sheet.createRow(rowNum++);
                
                dataRow.createCell(0).setCellValue(topic.getAreaName());
                dataRow.createCell(1).setCellValue(topic.getTopicCount());
                
                // Calcular porcentaje
                double total = topicsData.stream().mapToInt(TopicAreaStatsDTO::getTopicCount).sum();
                double percentage = total > 0 ? (topic.getTopicCount() * 100.0 / total) : 0;
                dataRow.createCell(2).setCellValue(String.format("%.1f%%", percentage));
                
                // Aplicar estilos
                for (int i = 0; i < 3; i++) {
                    dataRow.getCell(i).setCellStyle(dataStyle);
                }
            }
            
            rowNum += 2; // Espacio para gráfico
        }
        
        if ("charts".equals(config.getContentType()) || "both".equals(config.getContentType())) {
            // Crear gráfico de barras embebido
            createBarChart(sheet, topicsData, rowNum, "Distribución de Temas por Área");
        }
        
        // Ajustar ancho de columnas
        sheet.setColumnWidth(0, 35 * 256);
        sheet.setColumnWidth(1, 20 * 256);
        sheet.setColumnWidth(2, 15 * 256);
    }

    private void createTopicsSheetTablesOnly(XSSFWorkbook workbook, String cognitoSub, String ciclo, 
                                           ExcelExportConfigDto config, CellStyle headerStyle, 
                                           CellStyle titleStyle, CellStyle dataStyle) {
        
        XSSFSheet sheet = workbook.createSheet("Temas y Áreas");
        
        // Obtener datos
        List<TopicAreaStatsDTO> topicsData = reportService.getTopicAreaStatistics(cognitoSub, ciclo);
        
        int rowNum = 0;
        
        // Título principal
        Row titleRow = sheet.createRow(rowNum++);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("Reporte de Temas por Área - Ciclo " + ciclo);
        titleCell.setCellStyle(titleStyle);
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 3));
        
        rowNum++; // Línea en blanco
        
        // Tabla de datos
        Row headerRow = sheet.createRow(rowNum++);
        String[] headers = {"Área de Conocimiento", "Cantidad de Temas", "Porcentaje"};
        
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }
        
        // Datos de la tabla
        for (TopicAreaStatsDTO topic : topicsData) {
            Row dataRow = sheet.createRow(rowNum++);
            
            dataRow.createCell(0).setCellValue(topic.getAreaName());
            dataRow.createCell(1).setCellValue(topic.getTopicCount());
            
            // Calcular porcentaje
            double total = topicsData.stream().mapToInt(TopicAreaStatsDTO::getTopicCount).sum();
            double percentage = total > 0 ? (topic.getTopicCount() * 100.0 / total) : 0;
            dataRow.createCell(2).setCellValue(String.format("%.1f%%", percentage));
            
            // Aplicar estilos
            for (int i = 0; i < 3; i++) {
                dataRow.getCell(i).setCellStyle(dataStyle);
            }
        }
        
        // Ajustar ancho de columnas
        sheet.setColumnWidth(0, 35 * 256);
        sheet.setColumnWidth(1, 20 * 256);
        sheet.setColumnWidth(2, 15 * 256);
    }

    private void createDistributionSheet(XSSFWorkbook workbook, String cognitoSub, String ciclo,
                                       ExcelExportConfigDto config, CellStyle headerStyle,
                                       CellStyle titleStyle, CellStyle dataStyle) {
        
        XSSFSheet sheet = workbook.createSheet("Distribución de Carga");
        
        // Obtener datos
        List<TeacherCountDTO> advisorsData = reportService.getAdvisorDistribution(cognitoSub, ciclo);
        List<TeacherCountDTO> jurorsData = reportService.getJurorDistribution(cognitoSub, ciclo);
        
        int rowNum = 0;
        
        // Título principal
        Row titleRow = sheet.createRow(rowNum++);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("Distribución de Carga Académica - Ciclo " + ciclo);
        titleCell.setCellStyle(titleStyle);
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 4));
        
        rowNum++; // Línea en blanco
        
        if (!"charts".equals(config.getContentType())) {
            // Tabla de datos
            Row headerRow = sheet.createRow(rowNum++);
            String[] headers = {"Docente", "Área", "Asesorías", "Jurados", "Total"};
            
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }
            
            // Combinar datos de asesores y jurados
            Map<String, TeacherCountDTO> advisorsMap = advisorsData.stream()
                .collect(java.util.stream.Collectors.toMap(TeacherCountDTO::getTeacherName, a -> a));
            
            Map<String, TeacherCountDTO> jurorsMap = jurorsData.stream()
                .collect(java.util.stream.Collectors.toMap(TeacherCountDTO::getTeacherName, j -> j));
            
            // Crear lista combinada
            java.util.Set<String> allTeachers = new java.util.HashSet<>();
            allTeachers.addAll(advisorsMap.keySet());
            allTeachers.addAll(jurorsMap.keySet());
            
            for (String teacherName : allTeachers.stream().sorted().toList()) {
                Row dataRow = sheet.createRow(rowNum++);
                
                TeacherCountDTO advisor = advisorsMap.get(teacherName);
                TeacherCountDTO juror = jurorsMap.get(teacherName);
                
                dataRow.createCell(0).setCellValue(teacherName);
                dataRow.createCell(1).setCellValue(advisor != null ? advisor.getAreaName() : juror.getAreaName());
                dataRow.createCell(2).setCellValue(advisor != null ? advisor.getCount() : 0);
                dataRow.createCell(3).setCellValue(juror != null ? juror.getCount() : 0);
                dataRow.createCell(4).setCellValue((advisor != null ? advisor.getCount() : 0) + (juror != null ? juror.getCount() : 0));
                
                for (int i = 0; i < 5; i++) {
                    dataRow.getCell(i).setCellStyle(dataStyle);
                }
            }
            
            rowNum += 2; // Espacio para gráfico
        }
        
        if ("charts".equals(config.getContentType()) || "both".equals(config.getContentType())) {
            // Crear gráfico de barras agrupadas
            createGroupedBarChart(sheet, advisorsData, jurorsData, rowNum, "Distribución de Carga por Docente");
        }
        
        // Ajustar ancho de columnas
        sheet.setColumnWidth(0, 35 * 256);
        sheet.setColumnWidth(1, 25 * 256);
        sheet.setColumnWidth(2, 15 * 256);
        sheet.setColumnWidth(3, 15 * 256);
        sheet.setColumnWidth(4, 15 * 256);
    }

    private void createDistributionSheetTablesOnly(XSSFWorkbook workbook, String cognitoSub, String ciclo,
                                               ExcelExportConfigDto config, CellStyle headerStyle,
                                               CellStyle titleStyle, CellStyle dataStyle) {
        
        XSSFSheet sheet = workbook.createSheet("Distribución de Carga");
        
        // Obtener datos
        List<TeacherCountDTO> advisorsData = reportService.getAdvisorDistribution(cognitoSub, ciclo);
        List<TeacherCountDTO> jurorsData = reportService.getJurorDistribution(cognitoSub, ciclo);
        
        int rowNum = 0;
        
        // Título principal
        Row titleRow = sheet.createRow(rowNum++);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("Distribución de Carga Académica - Ciclo " + ciclo);
        titleCell.setCellStyle(titleStyle);
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 4));
        
        rowNum++; // Línea en blanco
        
        // Tabla de datos
        Row headerRow = sheet.createRow(rowNum++);
        String[] headers = {"Docente", "Área", "Asesorías", "Jurados", "Total"};
        
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }
        
        // Datos de la tabla
        for (TeacherCountDTO advisor : advisorsData) {
            Row dataRow = sheet.createRow(rowNum++);
            
            dataRow.createCell(0).setCellValue(advisor.getTeacherName());
            dataRow.createCell(1).setCellValue(advisor.getAreaName());
            dataRow.createCell(2).setCellValue(advisor.getCount());
            
            // Combinar datos con jurados
            TeacherCountDTO juror = jurorsData.stream()
                .filter(j -> j.getTeacherName().equals(advisor.getTeacherName()))
                .findFirst()
                .orElse(null);
            
            dataRow.createCell(3).setCellValue(juror != null ? juror.getCount() : 0);
            dataRow.createCell(4).setCellValue(advisor.getCount() + (juror != null ? juror.getCount() : 0));
            
            // Aplicar estilos
            for (int i = 0; i < 5; i++) {
                dataRow.getCell(i).setCellStyle(dataStyle);
            }
        }
        
        // Ajustar ancho de columnas
        sheet.setColumnWidth(0, 35 * 256);
        sheet.setColumnWidth(1, 25 * 256);
        sheet.setColumnWidth(2, 15 * 256);
        sheet.setColumnWidth(3, 15 * 256);
        sheet.setColumnWidth(4, 15 * 256);
    }

    private void createPerformanceSheet(XSSFWorkbook workbook, String cognitoSub, String ciclo,
                                      ExcelExportConfigDto config, CellStyle headerStyle,
                                      CellStyle titleStyle, CellStyle dataStyle) {
        
        XSSFSheet sheet = workbook.createSheet("Desempeño de Asesores");
        
        // Obtener datos
        List<AdvisorPerformanceDto> performanceData = reportService.getAdvisorPerformance(cognitoSub, ciclo);
        
        int rowNum = 0;
        
        // Título principal
        Row titleRow = sheet.createRow(rowNum++);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("Desempeño de Asesores - Ciclo " + ciclo);
        titleCell.setCellStyle(titleStyle);
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 4));
        
        rowNum++; // Línea en blanco
        
        if (!"charts".equals(config.getContentType())) {
            // Tabla de datos
            Row headerRow = sheet.createRow(rowNum++);
            String[] headers = {"Asesor", "Área", "Progreso (%)", "Cantidad de Tesistas", "Estado"};
            
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }
            
            // Datos de la tabla
            for (AdvisorPerformanceDto advisor : performanceData) {
                Row dataRow = sheet.createRow(rowNum++);
                
                dataRow.createCell(0).setCellValue(advisor.getAdvisorName());
                dataRow.createCell(1).setCellValue(advisor.getAreaName());
                dataRow.createCell(2).setCellValue(advisor.getPerformancePercentage());
                dataRow.createCell(3).setCellValue(advisor.getTotalStudents());
                
                // Determinar estado
                String estado;
                if (advisor.getPerformancePercentage() >= 80) {
                    estado = "Excelente";
                } else if (advisor.getPerformancePercentage() >= 60) {
                    estado = "Bueno";
                } else if (advisor.getPerformancePercentage() >= 40) {
                    estado = "Regular";
                } else {
                    estado = "Necesita Atención";
                }
                dataRow.createCell(4).setCellValue(estado);
                
                // Aplicar estilos
                for (int i = 0; i < 5; i++) {
                    dataRow.getCell(i).setCellStyle(dataStyle);
                }
            }
            
            rowNum += 2; // Espacio para gráfico
        }
        
        if ("charts".equals(config.getContentType()) || "both".equals(config.getContentType())) {
            // Crear gráfico de rendimiento
            createPerformanceChart(sheet, performanceData, rowNum, "Desempeño de Asesores");
        }
        
        // Ajustar ancho de columnas
        sheet.setColumnWidth(0, 35 * 256);
        sheet.setColumnWidth(1, 25 * 256);
        sheet.setColumnWidth(2, 15 * 256);
        sheet.setColumnWidth(3, 20 * 256);
        sheet.setColumnWidth(4, 18 * 256);
    }

    private void createPerformanceSheetTablesOnly(XSSFWorkbook workbook, String cognitoSub, String ciclo,
                                               ExcelExportConfigDto config, CellStyle headerStyle,
                                               CellStyle titleStyle, CellStyle dataStyle) {
        
        XSSFSheet sheet = workbook.createSheet("Desempeño de Asesores");
        
        // Obtener datos
        List<AdvisorPerformanceDto> performanceData = reportService.getAdvisorPerformance(cognitoSub, ciclo);
        
        int rowNum = 0;
        
        // Título principal
        Row titleRow = sheet.createRow(rowNum++);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("Desempeño de Asesores - Ciclo " + ciclo);
        titleCell.setCellStyle(titleStyle);
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 4));
        
        rowNum++; // Línea en blanco
        
        // Tabla de datos
        Row headerRow = sheet.createRow(rowNum++);
        String[] headers = {"Asesor", "Área", "Progreso (%)", "Cantidad de Tesistas", "Estado"};
        
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }
        
        // Datos de la tabla
        for (AdvisorPerformanceDto advisor : performanceData) {
            Row dataRow = sheet.createRow(rowNum++);
            
            dataRow.createCell(0).setCellValue(advisor.getAdvisorName());
            dataRow.createCell(1).setCellValue(advisor.getAreaName());
            dataRow.createCell(2).setCellValue(advisor.getPerformancePercentage());
            dataRow.createCell(3).setCellValue(advisor.getTotalStudents());
            
            // Determinar estado
            String estado;
            if (advisor.getPerformancePercentage() >= 80) {
                estado = "Excelente";
            } else if (advisor.getPerformancePercentage() >= 60) {
                estado = "Bueno";
            } else if (advisor.getPerformancePercentage() >= 40) {
                estado = "Regular";
            } else {
                estado = "Necesita Atención";
            }
            dataRow.createCell(4).setCellValue(estado);
            
            // Aplicar estilos
            for (int i = 0; i < 5; i++) {
                dataRow.getCell(i).setCellStyle(dataStyle);
            }
        }
        
        // Ajustar ancho de columnas
        sheet.setColumnWidth(0, 35 * 256);
        sheet.setColumnWidth(1, 25 * 256);
        sheet.setColumnWidth(2, 15 * 256);
        sheet.setColumnWidth(3, 20 * 256);
        sheet.setColumnWidth(4, 18 * 256);
    }

    /**
     * Crea un gráfico de barras embebido usando la API moderna XDDF
     */
    private void createBarChart(XSSFSheet sheet, List<TopicAreaStatsDTO> data, int startRow, String title) {
        try {
            int dataStartRow = startRow + 2;
            Row headerRow = sheet.createRow(dataStartRow - 1);
            headerRow.createCell(0).setCellValue("Área");
            headerRow.createCell(1).setCellValue("Cantidad");
            for (int i = 0; i < data.size(); i++) {
                Row dataRow = sheet.createRow(dataStartRow + i);
                dataRow.createCell(0).setCellValue(data.get(i).getAreaName());
                dataRow.createCell(1).setCellValue(data.get(i).getTopicCount());
            }

            XSSFDrawing drawing = sheet.createDrawingPatriarch();
            XSSFClientAnchor anchor = drawing.createAnchor(0, 0, 0, 0, 3, startRow, 10, startRow + 15);
            XSSFChart chart = drawing.createChart(anchor);
            chart.setTitleText(title);

            XDDFCategoryAxis bottomAxis = chart.createCategoryAxis(AxisPosition.BOTTOM);
            XDDFValueAxis leftAxis = chart.createValueAxis(AxisPosition.LEFT);

            XDDFDataSource<String> categories = XDDFDataSourcesFactory.fromStringCellRange(
                sheet, new CellRangeAddress(dataStartRow, dataStartRow + data.size() - 1, 0, 0));
            XDDFNumericalDataSource<Double> values = XDDFDataSourcesFactory.fromNumericCellRange(
                sheet, new CellRangeAddress(dataStartRow, dataStartRow + data.size() - 1, 1, 1));

            XDDFBarChartData barChart = (XDDFBarChartData) chart.createData(ChartTypes.BAR, bottomAxis, leftAxis);
            barChart.setBarDirection(BarDirection.COL);
            barChart.setBarGrouping(BarGrouping.CLUSTERED);

            barChart.addSeries(categories, values).setTitle(title, null);

            chart.plot(barChart);
        } catch (Exception e) {
            addManualChartData(sheet, data, startRow, title);
        }
    }

    /**
     * Crea un gráfico de barras agrupadas usando la API moderna XDDF
     */
    private void createGroupedBarChart(XSSFSheet sheet, List<TeacherCountDTO> advisorsData, 
                                     List<TeacherCountDTO> jurorsData, int startRow, String title) {
        try {
            int dataStartRow = startRow + 2;
            Row headerRow = sheet.createRow(dataStartRow - 1);
            headerRow.createCell(0).setCellValue("Docente");
            headerRow.createCell(1).setCellValue("Asesorías");
            headerRow.createCell(2).setCellValue("Jurados");

            Map<String, TeacherCountDTO> advisorsMap = advisorsData.stream()
                .collect(java.util.stream.Collectors.toMap(TeacherCountDTO::getTeacherName, a -> a));
            Map<String, TeacherCountDTO> jurorsMap = jurorsData.stream()
                .collect(java.util.stream.Collectors.toMap(TeacherCountDTO::getTeacherName, j -> j));
            java.util.Set<String> allTeachers = new java.util.HashSet<>();
            allTeachers.addAll(advisorsMap.keySet());
            allTeachers.addAll(jurorsMap.keySet());

            int rowIndex = 0;
            for (String teacherName : allTeachers.stream().sorted().toList()) {
                Row dataRow = sheet.createRow(dataStartRow + rowIndex);
                TeacherCountDTO advisor = advisorsMap.get(teacherName);
                TeacherCountDTO juror = jurorsMap.get(teacherName);
                dataRow.createCell(0).setCellValue(teacherName);
                dataRow.createCell(1).setCellValue(advisor != null ? advisor.getCount() : 0);
                dataRow.createCell(2).setCellValue(juror != null ? juror.getCount() : 0);
                rowIndex++;
            }

            XSSFDrawing drawing = sheet.createDrawingPatriarch();
            XSSFClientAnchor anchor = drawing.createAnchor(0, 0, 0, 0, 4, startRow, 12, startRow + 15);
            XSSFChart chart = drawing.createChart(anchor);
            chart.setTitleText(title);

            XDDFCategoryAxis bottomAxis = chart.createCategoryAxis(AxisPosition.BOTTOM);
            XDDFValueAxis leftAxis = chart.createValueAxis(AxisPosition.LEFT);

            XDDFDataSource<String> categories = XDDFDataSourcesFactory.fromStringCellRange(
                sheet, new CellRangeAddress(dataStartRow, dataStartRow + rowIndex - 1, 0, 0));
            XDDFNumericalDataSource<Double> advisorsValues = XDDFDataSourcesFactory.fromNumericCellRange(
                sheet, new CellRangeAddress(dataStartRow, dataStartRow + rowIndex - 1, 1, 1));
            XDDFNumericalDataSource<Double> jurorsValues = XDDFDataSourcesFactory.fromNumericCellRange(
                sheet, new CellRangeAddress(dataStartRow, dataStartRow + rowIndex - 1, 2, 2));

            XDDFBarChartData barChart = (XDDFBarChartData) chart.createData(ChartTypes.BAR, bottomAxis, leftAxis);
            barChart.setBarDirection(BarDirection.COL);
            barChart.setBarGrouping(BarGrouping.CLUSTERED);

            barChart.addSeries(categories, advisorsValues).setTitle("Asesorías", null);
            barChart.addSeries(categories, jurorsValues).setTitle("Jurados", null);

            chart.plot(barChart);
        } catch (Exception e) {
            addManualGroupedChartData(sheet, advisorsData, jurorsData, startRow, title);
        }
    }

    /**
     * Crea un gráfico de desempeño usando la API moderna XDDF
     */
    private void createPerformanceChart(XSSFSheet sheet, List<AdvisorPerformanceDto> data, int startRow, String title) {
        try {
            int dataStartRow = startRow + 2;
            Row headerRow = sheet.createRow(dataStartRow - 1);
            headerRow.createCell(0).setCellValue("Asesor");
            headerRow.createCell(1).setCellValue("Progreso (%)");
            headerRow.createCell(2).setCellValue("Cantidad de Tesistas");
            for (int i = 0; i < data.size(); i++) {
                Row dataRow = sheet.createRow(dataStartRow + i);
                dataRow.createCell(0).setCellValue(data.get(i).getAdvisorName());
                dataRow.createCell(1).setCellValue(data.get(i).getPerformancePercentage());
                dataRow.createCell(2).setCellValue(data.get(i).getTotalStudents());
            }

            XSSFDrawing drawing = sheet.createDrawingPatriarch();
            XSSFClientAnchor anchor = drawing.createAnchor(0, 0, 0, 0, 3, startRow, 10, startRow + 15);
            XSSFChart chart = drawing.createChart(anchor);
            chart.setTitleText(title);

            XDDFCategoryAxis bottomAxis = chart.createCategoryAxis(AxisPosition.BOTTOM);
            XDDFValueAxis leftAxis = chart.createValueAxis(AxisPosition.LEFT);

            XDDFDataSource<String> categories = XDDFDataSourcesFactory.fromStringCellRange(
                sheet, new CellRangeAddress(dataStartRow, dataStartRow + data.size() - 1, 0, 0));
            XDDFNumericalDataSource<Double> values = XDDFDataSourcesFactory.fromNumericCellRange(
                sheet, new CellRangeAddress(dataStartRow, dataStartRow + data.size() - 1, 1, 1));

            XDDFBarChartData barChart = (XDDFBarChartData) chart.createData(ChartTypes.BAR, bottomAxis, leftAxis);
            barChart.setBarDirection(BarDirection.COL);
            barChart.setBarGrouping(BarGrouping.CLUSTERED);

            barChart.addSeries(categories, values).setTitle(title, null);

            chart.plot(barChart);
        } catch (Exception e) {
            addManualPerformanceChartData(sheet, data, startRow, title);
        }
    }

    /**
     * Agrega datos para gráfico manual (fallback)
     */
    private void addManualChartData(XSSFSheet sheet, List<TopicAreaStatsDTO> data, int startRow, String title) {
        Row titleRow = sheet.createRow(startRow);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("Datos para Gráfico: " + title);
        titleCell.setCellStyle(createTitleStyle(sheet.getWorkbook()));
        sheet.addMergedRegion(new CellRangeAddress(startRow, startRow, 0, 2));
        
        Row headerRow = sheet.createRow(startRow + 1);
        headerRow.createCell(0).setCellValue("Área");
        headerRow.createCell(1).setCellValue("Cantidad");
        headerRow.createCell(2).setCellValue("Porcentaje");
        
        for (int i = 0; i < data.size(); i++) {
            Row dataRow = sheet.createRow(startRow + 2 + i);
            dataRow.createCell(0).setCellValue(data.get(i).getAreaName());
            dataRow.createCell(1).setCellValue(data.get(i).getTopicCount());
            
            double total = data.stream().mapToInt(TopicAreaStatsDTO::getTopicCount).sum();
            double percentage = total > 0 ? (data.get(i).getTopicCount() * 100.0 / total) : 0;
            dataRow.createCell(2).setCellValue(percentage);
        }
        
        // Instrucciones
        Row instructionRow = sheet.createRow(startRow + 3 + data.size());
        Cell instructionCell = instructionRow.createCell(0);
        instructionCell.setCellValue("Para crear un gráfico: Selecciona los datos de arriba → Insertar → Gráfico de Barras");
        instructionCell.setCellStyle(createInstructionStyle(sheet.getWorkbook()));
        sheet.addMergedRegion(new CellRangeAddress(startRow + 3 + data.size(), startRow + 3 + data.size(), 0, 2));
    }

    private void addManualGroupedChartData(XSSFSheet sheet, List<TeacherCountDTO> advisorsData, 
                                         List<TeacherCountDTO> jurorsData, int startRow, String title) {
        Row titleRow = sheet.createRow(startRow);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("Datos para Gráfico: " + title);
        titleCell.setCellStyle(createTitleStyle(sheet.getWorkbook()));
        sheet.addMergedRegion(new CellRangeAddress(startRow, startRow, 0, 2));
        
        Row headerRow = sheet.createRow(startRow + 1);
        headerRow.createCell(0).setCellValue("Docente");
        headerRow.createCell(1).setCellValue("Asesorías");
        headerRow.createCell(2).setCellValue("Jurados");
        
        Map<String, TeacherCountDTO> advisorsMap = advisorsData.stream()
            .collect(java.util.stream.Collectors.toMap(TeacherCountDTO::getTeacherName, a -> a));
        Map<String, TeacherCountDTO> jurorsMap = jurorsData.stream()
            .collect(java.util.stream.Collectors.toMap(TeacherCountDTO::getTeacherName, j -> j));
        
        java.util.Set<String> allTeachers = new java.util.HashSet<>();
        allTeachers.addAll(advisorsMap.keySet());
        allTeachers.addAll(jurorsMap.keySet());
        
        int rowIndex = 0;
        for (String teacherName : allTeachers.stream().sorted().toList()) {
            Row dataRow = sheet.createRow(startRow + 2 + rowIndex);
            
            TeacherCountDTO advisor = advisorsMap.get(teacherName);
            TeacherCountDTO juror = jurorsMap.get(teacherName);
            
            dataRow.createCell(0).setCellValue(teacherName);
            dataRow.createCell(1).setCellValue(advisor != null ? advisor.getCount() : 0);
            dataRow.createCell(2).setCellValue(juror != null ? juror.getCount() : 0);
            
            rowIndex++;
        }
        
        // Instrucciones
        Row instructionRow = sheet.createRow(startRow + 3 + rowIndex);
        Cell instructionCell = instructionRow.createCell(0);
        instructionCell.setCellValue("Para crear un gráfico: Selecciona los datos de arriba → Insertar → Gráfico de Barras Agrupadas");
        instructionCell.setCellStyle(createInstructionStyle(sheet.getWorkbook()));
        sheet.addMergedRegion(new CellRangeAddress(startRow + 3 + rowIndex, startRow + 3 + rowIndex, 0, 2));
    }

    private void addManualPerformanceChartData(XSSFSheet sheet, List<AdvisorPerformanceDto> data, int startRow, String title) {
        Row titleRow = sheet.createRow(startRow);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("Datos para Gráfico: " + title);
        titleCell.setCellStyle(createTitleStyle(sheet.getWorkbook()));
        sheet.addMergedRegion(new CellRangeAddress(startRow, startRow, 0, 2));
        
        Row headerRow = sheet.createRow(startRow + 1);
        headerRow.createCell(0).setCellValue("Asesor");
        headerRow.createCell(1).setCellValue("Progreso (%)");
        headerRow.createCell(2).setCellValue("Cantidad de Tesistas");
        
        for (int i = 0; i < data.size(); i++) {
            Row dataRow = sheet.createRow(startRow + 2 + i);
            dataRow.createCell(0).setCellValue(data.get(i).getAdvisorName());
            dataRow.createCell(1).setCellValue(data.get(i).getPerformancePercentage());
            dataRow.createCell(2).setCellValue(data.get(i).getTotalStudents());
        }
        
        // Instrucciones
        Row instructionRow = sheet.createRow(startRow + 3 + data.size());
        Cell instructionCell = instructionRow.createCell(0);
        instructionCell.setCellValue("Para crear un gráfico: Selecciona los datos de arriba → Insertar → Gráfico de Barras");
        instructionCell.setCellStyle(createInstructionStyle(sheet.getWorkbook()));
        sheet.addMergedRegion(new CellRangeAddress(startRow + 3 + data.size(), startRow + 3 + data.size(), 0, 2));
    }

    private CellStyle createHeaderStyle(XSSFWorkbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setAlignment(HorizontalAlignment.CENTER);
        return style;
    }

    private CellStyle createTitleStyle(XSSFWorkbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 14);
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);
        return style;
    }

    private CellStyle createDataStyle(XSSFWorkbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setAlignment(HorizontalAlignment.CENTER);
        return style;
    }

    private CellStyle createInstructionStyle(XSSFWorkbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setItalic(true);
        font.setColor(IndexedColors.GREY_50_PERCENT.getIndex());
        style.setFont(font);
        return style;
    }
} 