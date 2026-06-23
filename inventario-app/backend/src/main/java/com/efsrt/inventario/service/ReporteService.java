package com.efsrt.inventario.service;

import com.efsrt.inventario.entity.MovimientoInventario;
import com.efsrt.inventario.entity.Producto;
import com.efsrt.inventario.repository.MovimientoInventarioRepository;
import com.efsrt.inventario.repository.ProductoRepository;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class ReporteService {

    private final ProductoRepository productoRepository;
    private final MovimientoInventarioRepository movimientoRepository;

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    // ===== PRODUCTOS PDF =====
    @Transactional(readOnly = true)
    public byte[] exportarProductosPdf() {
        List<Producto> productos = productoRepository.findAll()
                .stream().filter(p -> Boolean.TRUE.equals(p.getActivo())).toList();

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document doc = new Document(PageSize.A4.rotate(), 30, 30, 40, 30);

        try {
            PdfWriter.getInstance(doc, out);
            doc.open();

            // Título
            Font titleFont = new Font(Font.HELVETICA, 16, Font.BOLD, new Color(240, 246, 252));
            Font subtitleFont = new Font(Font.HELVETICA, 10, Font.NORMAL, new Color(139, 148, 158));
            Font headerFont = new Font(Font.HELVETICA, 9, Font.BOLD, Color.WHITE);
            Font cellFont = new Font(Font.HELVETICA, 8, Font.NORMAL, new Color(200, 210, 220));
            Font badgeOk = new Font(Font.HELVETICA, 8, Font.BOLD, new Color(63, 185, 80));
            Font badgeLow = new Font(Font.HELVETICA, 8, Font.BOLD, new Color(210, 153, 34));

            Paragraph title = new Paragraph("Reporte de Productos", titleFont);
            title.setAlignment(Element.ALIGN_LEFT);
            doc.add(title);

            Paragraph sub = new Paragraph("InvManager · Generado el " +
                    java.time.LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")),
                    subtitleFont);
            sub.setSpacingAfter(16);
            doc.add(sub);

            // Tabla
            PdfPTable table = new PdfPTable(7);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{1.2f, 2.5f, 1.5f, 2f, 1f, 1f, 1f});

            String[] headers = {"Código", "Nombre", "Categoría", "Ubicación", "Stock", "Mín.", "Estado"};
            Color headerBg = new Color(22, 27, 36);
            for (String h : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(h, headerFont));
                cell.setBackgroundColor(headerBg);
                cell.setBorderColor(new Color(40, 50, 65));
                cell.setPadding(7);
                table.addCell(cell);
            }

            Color rowBg1 = new Color(13, 17, 23);
            Color rowBg2 = new Color(18, 24, 32);
            Color borderColor = new Color(30, 40, 55);

            int i = 0;
            for (Producto p : productos) {
                Color bg = (i % 2 == 0) ? rowBg1 : rowBg2;
                boolean stockBajo = p.getStockActual() <= p.getStockMinimo();

                addCell(table, p.getCodigo(), cellFont, bg, borderColor);
                addCell(table, p.getNombre(), cellFont, bg, borderColor);
                addCell(table, p.getCategoria() != null ? p.getCategoria().getNombre() : "—", cellFont, bg, borderColor);
                addCell(table, p.getUbicacion() != null ? p.getUbicacion() : "—", cellFont, bg, borderColor);
                addCell(table, String.valueOf(p.getStockActual()), cellFont, bg, borderColor);
                addCell(table, String.valueOf(p.getStockMinimo()), cellFont, bg, borderColor);

                PdfPCell statusCell = new PdfPCell(new Phrase(stockBajo ? "Stock bajo" : "OK",
                        stockBajo ? badgeLow : badgeOk));
                statusCell.setBackgroundColor(bg);
                statusCell.setBorderColor(borderColor);
                statusCell.setPadding(7);
                table.addCell(statusCell);
                i++;
            }

            doc.add(table);

            // Footer
            Paragraph footer = new Paragraph(
                    "\nTotal de productos: " + productos.size() +
                    "   |   Stock bajo: " + productos.stream().filter(p -> p.getStockActual() <= p.getStockMinimo()).count(),
                    subtitleFont);
            footer.setSpacingBefore(12);
            doc.add(footer);

        }  catch (Exception e) {
        e.printStackTrace();
        throw new RuntimeException("Error generando PDF de productos: " + e.getMessage() + " causa: " + (e.getCause() != null ? e.getCause().getMessage() : ""), e);
    } finally {
            doc.close();
        }
        return out.toByteArray();
    }

    // ===== PRODUCTOS EXCEL =====
    @Transactional(readOnly = true)
    public byte[] exportarProductosExcel() {
        List<Producto> productos = productoRepository.findAll()
                .stream().filter(p -> Boolean.TRUE.equals(p.getActivo())).toList();

        try (XSSFWorkbook wb = new XSSFWorkbook()) {
            Sheet sheet = wb.createSheet("Productos");

            // Estilos
            CellStyle headerStyle = crearEstiloHeader(wb);
            CellStyle dataStyle   = crearEstiloDato(wb);
            CellStyle altStyle    = crearEstiloDatoAlt(wb);

            // Header
            String[] cols = {"Código", "Nombre", "Descripción", "Categoría", "Ubicación", "Stock Actual", "Stock Mín.", "Stock Máx.", "Estado"};
            Row headerRow = sheet.createRow(0);
            headerRow.setHeightInPoints(22);
            for (int i = 0; i < cols.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(cols[i]);
                cell.setCellStyle(headerStyle);
            }

            // Datos
            int rowNum = 1;
            for (Producto p : productos) {
                Row row = sheet.createRow(rowNum);
                row.setHeightInPoints(18);
                CellStyle style = (rowNum % 2 == 0) ? altStyle : dataStyle;

                setCellValue(row, 0, p.getCodigo(), style);
                setCellValue(row, 1, p.getNombre(), style);
                setCellValue(row, 2, p.getDescripcion() != null ? p.getDescripcion() : "", style);
                setCellValue(row, 3, p.getCategoria() != null ? p.getCategoria().getNombre() : "", style);
                setCellValue(row, 4, p.getUbicacion() != null ? p.getUbicacion() : "", style);
                setCellValue(row, 5, String.valueOf(p.getStockActual()), style);
                setCellValue(row, 6, String.valueOf(p.getStockMinimo()), style);
                setCellValue(row, 7, p.getStockMaximo() != null ? String.valueOf(p.getStockMaximo()) : "", style);
                setCellValue(row, 8, p.getStockActual() <= p.getStockMinimo() ? "Stock bajo" : "OK", style);
                rowNum++;
            }

            // Ancho de columnas
            int[] widths = {14, 30, 35, 18, 25, 14, 12, 12, 12};
            for (int i = 0; i < widths.length; i++) {
                sheet.setColumnWidth(i, widths[i] * 256);
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            wb.write(out);
            return out.toByteArray();

        } catch (Exception e) {
        e.printStackTrace();
        throw new RuntimeException("Error generando excel de productos: " + e.getMessage() + " causa: " + (e.getCause() != null ? e.getCause().getMessage() : ""), e);
    }
    }

    // ===== MOVIMIENTOS PDF =====
    @Transactional(readOnly = true)
    public byte[] exportarMovimientosPdf() {
        List<MovimientoInventario> movimientos = movimientoRepository.findAll();

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document doc = new Document(PageSize.A4.rotate(), 30, 30, 40, 30);

        try {
            PdfWriter.getInstance(doc, out);
            doc.open();

            Font titleFont    = new Font(Font.HELVETICA, 16, Font.BOLD, new Color(240, 246, 252));
            Font subtitleFont = new Font(Font.HELVETICA, 10, Font.NORMAL, new Color(139, 148, 158));
            Font headerFont   = new Font(Font.HELVETICA, 9, Font.BOLD, Color.WHITE);
            Font cellFont     = new Font(Font.HELVETICA, 8, Font.NORMAL, new Color(200, 210, 220));
            Font entradaFont  = new Font(Font.HELVETICA, 8, Font.BOLD, new Color(63, 185, 80));
            Font salidaFont   = new Font(Font.HELVETICA, 8, Font.BOLD, new Color(210, 153, 34));

            Paragraph title = new Paragraph("Reporte de Movimientos", titleFont);
            title.setAlignment(Element.ALIGN_LEFT);
            doc.add(title);

            Paragraph sub = new Paragraph("InvManager · Generado el " +
                    java.time.LocalDateTime.now().format(FMT), subtitleFont);
            sub.setSpacingAfter(16);
            doc.add(sub);

            PdfPTable table = new PdfPTable(7);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{1.8f, 1f, 2.5f, 1f, 1f, 1f, 2f});

            String[] headers = {"Fecha", "Tipo", "Producto", "Cantidad", "Antes", "Después", "Motivo"};
            Color headerBg  = new Color(22, 27, 36);
            Color borderColor = new Color(40, 50, 65);

            for (String h : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(h, headerFont));
                cell.setBackgroundColor(headerBg);
                cell.setBorderColor(borderColor);
                cell.setPadding(7);
                table.addCell(cell);
            }

            Color rowBg1 = new Color(13, 17, 23);
            Color rowBg2 = new Color(18, 24, 32);

            int i = 0;
            for (MovimientoInventario m : movimientos) {
                Color bg = (i % 2 == 0) ? rowBg1 : rowBg2;
                boolean esEntrada = m.getTipo() == MovimientoInventario.TipoMovimiento.ENTRADA;

                addCell(table, m.getFechaMovimiento() != null ? m.getFechaMovimiento().format(FMT) : "—", cellFont, bg, borderColor);

                PdfPCell tipoCell = new PdfPCell(new Phrase(esEntrada ? "Entrada" : "Salida", esEntrada ? entradaFont : salidaFont));
                tipoCell.setBackgroundColor(bg);
                tipoCell.setBorderColor(borderColor);
                tipoCell.setPadding(7);
                table.addCell(tipoCell);

                addCell(table, m.getProducto() != null ? m.getProducto().getNombre() : "—", cellFont, bg, borderColor);
                addCell(table, String.valueOf(m.getCantidad()), cellFont, bg, borderColor);
                addCell(table, String.valueOf(m.getStockAnterior()), cellFont, bg, borderColor);
                addCell(table, String.valueOf(m.getStockPosterior()), cellFont, bg, borderColor);
                addCell(table, m.getMotivo() != null ? m.getMotivo() : "—", cellFont, bg, borderColor);
                i++;
            }

            doc.add(table);

            Paragraph footer = new Paragraph("\nTotal de movimientos: " + movimientos.size(), subtitleFont);
            footer.setSpacingBefore(12);
            doc.add(footer);

        }  catch (Exception e) {
        e.printStackTrace();
        throw new RuntimeException("Error generando PDF de movimientos: " + e.getMessage() + " causa: " + (e.getCause() != null ? e.getCause().getMessage() : ""), e);
    } finally {
            doc.close();
        }
        return out.toByteArray();
    }

    // ===== MOVIMIENTOS EXCEL =====
    @Transactional(readOnly = true)
    public byte[] exportarMovimientosExcel() {
        List<MovimientoInventario> movimientos = movimientoRepository.findAll();

        try (XSSFWorkbook wb = new XSSFWorkbook()) {
            Sheet sheet = wb.createSheet("Movimientos");

            CellStyle headerStyle = crearEstiloHeader(wb);
            CellStyle dataStyle   = crearEstiloDato(wb);
            CellStyle altStyle    = crearEstiloDatoAlt(wb);

            String[] cols = {"Fecha", "Tipo", "Producto", "Código", "Cantidad", "Stock Anterior", "Stock Posterior", "Motivo", "Usuario"};
            Row headerRow = sheet.createRow(0);
            headerRow.setHeightInPoints(22);
            for (int i = 0; i < cols.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(cols[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowNum = 1;
            for (MovimientoInventario m : movimientos) {
                Row row = sheet.createRow(rowNum);
                row.setHeightInPoints(18);
                CellStyle style = (rowNum % 2 == 0) ? altStyle : dataStyle;

                setCellValue(row, 0, m.getFechaMovimiento() != null ? m.getFechaMovimiento().format(FMT) : "", style);
                setCellValue(row, 1, m.getTipo().name(), style);
                setCellValue(row, 2, m.getProducto() != null ? m.getProducto().getNombre() : "", style);
                setCellValue(row, 3, m.getProducto() != null ? m.getProducto().getCodigo() : "", style);
                setCellValue(row, 4, String.valueOf(m.getCantidad()), style);
                setCellValue(row, 5, String.valueOf(m.getStockAnterior()), style);
                setCellValue(row, 6, String.valueOf(m.getStockPosterior()), style);
                setCellValue(row, 7, m.getMotivo() != null ? m.getMotivo() : "", style);
                setCellValue(row, 8, m.getUsuario() != null ? m.getUsuario().getNombre() : "", style);
                rowNum++;
            }

            int[] widths = {20, 12, 30, 14, 12, 16, 16, 25, 20};
            for (int i = 0; i < widths.length; i++) {
                sheet.setColumnWidth(i, widths[i] * 256);
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            wb.write(out);
            return out.toByteArray();

        } catch (Exception e) {
        e.printStackTrace();
        throw new RuntimeException("Error generando excel de movimientos: " + e.getMessage() + " causa: " + (e.getCause() != null ? e.getCause().getMessage() : ""), e);
    }
    }

    // ===== HELPERS =====

    private void addCell(PdfPTable table, String text, Font font, Color bg, Color border) {
        PdfPCell cell = new PdfPCell(new Phrase(text != null ? text : "—", font));
        cell.setBackgroundColor(bg);
        cell.setBorderColor(border);
        cell.setPadding(7);
        table.addCell(cell);
    }

    private void setCellValue(Row row, int col, String value, CellStyle style) {
        Cell cell = row.createCell(col);
        cell.setCellValue(value);
        cell.setCellStyle(style);
    }

    private CellStyle crearEstiloHeader(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        org.apache.poi.ss.usermodel.Font font = wb.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 10);
        font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBottomBorderColor(IndexedColors.GREY_50_PERCENT.getIndex());
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setAlignment(HorizontalAlignment.LEFT);
        style.setWrapText(false);
        return style;
    }

    private CellStyle crearEstiloDato(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        org.apache.poi.ss.usermodel.Font font = wb.createFont();
        font.setFontHeightInPoints((short) 9);
        style.setFont(font);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBottomBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setAlignment(HorizontalAlignment.LEFT);
        return style;
    }

    private CellStyle crearEstiloDatoAlt(Workbook wb) {
        CellStyle style = crearEstiloDato(wb);
        style.setFillForegroundColor(IndexedColors.LIGHT_TURQUOISE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        return style;
    }
}
