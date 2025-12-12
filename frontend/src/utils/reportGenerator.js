import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import moment from 'moment';
import logo from '../assets/LOGO_INSTITUCIONAL.jpg';

/**
 * Generates a PDF report with a standardized institutional style.
 * 
 * @param {string} title - The main title of the report (e.g., "PROCESO DE GESTIÓN DE INFORMÁTICA").
 * @param {string} subtitle - The subtitle (e.g., "HOJA DE VIDA DE LOS EQUIPOS").
 * @param {string} code - The document code (e.g., "FT-MANT-001").
 * @param {string} version - The document version (e.g., "1.0").
 * @param {Array} sections - Array of sections to render.
 *      Each section can be:
 *      - { type: 'info', title: 'Start Title', data: [ { label: '', value: '' }, ... ] }
 *      - { type: 'table', headers: [], body: [], columnStyles: {} }
 *      - { type: 'signatures', data: [ { role: 'Técnico', name: 'John Doe', signature: 'base64...' }, ... ] }
 * @param {string} fileName - The name of the file to save.
 */
export const generateReport = (title, subtitle, code, version, sections, fileName) => {
    const doc = new jsPDF('p', 'mm', 'a4');

    // Config
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const contentWidth = pageWidth - (margin * 2);

    let currentY = 10;

    // --- Header Construction ---
    // We will draw a big box for the header
    // Box height approx 30mm
    const headerHeight = 30;

    // Draw outer box
    doc.setDrawColor(0);
    doc.rect(margin, currentY, contentWidth, headerHeight);

    // Vertical lines to split logo, title, and meta info
    const logoWidth = 50;
    const metaWidth = 40;
    const titleWidth = contentWidth - logoWidth - metaWidth;

    doc.line(margin + logoWidth, currentY, margin + logoWidth, currentY + headerHeight);
    doc.line(margin + logoWidth + titleWidth, currentY, margin + logoWidth + titleWidth, currentY + headerHeight);

    // Logo (Left)
    // Centering logo vertically and horizontally in its box
    // Assuming 50x30 box. Image aspect ratio varies.
    try {
        doc.addImage(logo, 'JPEG', margin + 2, currentY + 2, logoWidth - 4, headerHeight - 4, undefined, 'FAST');
    } catch (e) {
        console.error("Error adding logo", e);
    }

    // Title (Center)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);

    // Split title text to fit
    const titleX = margin + logoWidth + (titleWidth / 2);
    const titleY = currentY + 10;

    doc.text(title, titleX, titleY, { align: 'center', maxWidth: titleWidth - 4 });

    // Separator line in title box
    doc.line(margin + logoWidth, currentY + (headerHeight / 2), margin + logoWidth + titleWidth, currentY + (headerHeight / 2));

    // Subtitle
    const subtitleY = currentY + (headerHeight / 2) + 10;
    doc.text(subtitle, titleX, subtitleY, { align: 'center', maxWidth: titleWidth - 4 });

    // Meta Info (Right)
    doc.setFontSize(8);
    // Rows: Code, Version, Date
    const rowHeight = headerHeight / 3;

    // Lines separating rows in meta box
    doc.line(margin + logoWidth + titleWidth, currentY + rowHeight, pageWidth - margin, currentY + rowHeight);
    doc.line(margin + logoWidth + titleWidth, currentY + (rowHeight * 2), pageWidth - margin, currentY + (rowHeight * 2));

    const metaX = margin + logoWidth + titleWidth + 2;

    // Code
    doc.setFont("helvetica", "bold");
    doc.text("CÓDIGO:", metaX, currentY + 6);
    doc.setFont("helvetica", "normal");
    doc.text(code, metaX + 15, currentY + 6);

    // Version
    doc.setFont("helvetica", "bold");
    doc.text("VERSIÓN:", metaX, currentY + rowHeight + 6);
    doc.setFont("helvetica", "normal");
    doc.text(version, metaX + 15, currentY + rowHeight + 6);

    // Date
    doc.setFont("helvetica", "bold");
    doc.text("FECHA:", metaX, currentY + (rowHeight * 2) + 6);
    doc.setFont("helvetica", "normal");
    doc.text(moment().format('MM/YYYY'), metaX + 15, currentY + (rowHeight * 2) + 6);

    currentY += headerHeight + 5; // Spacing after header

    // --- Render Sections ---

    sections.forEach(section => {
        if (section.type === 'info') {
            // Render a grid of info
            // Data structure: [{ label: 'Name', value: 'Value' }, ... ]
            // We'll use autoTable to render this cleanly as a grid without headers if needed, or with.

            if (section.title) {
                // Section Title
                // Using autoTable to draw a header row that spans full width
                autoTable(doc, {
                    startY: currentY,
                    head: [[section.title]],
                    theme: 'plain',
                    headStyles: {
                        fillColor: [255, 255, 255],
                        textColor: 0,
                        fontStyle: 'bold',
                        lineWidth: 0.1,
                        lineColor: 0,
                        halign: 'left'
                    },
                    margin: { left: margin, right: margin },
                });
                currentY = doc.lastAutoTable.finalY; // No extra spacing, let the next table attach
            }

            // Transform data into a format suitable for a key-value grid.
            // We want roughly 2 key-value pairs per row to look like the form.
            // Or just a simple table.

            // Let's try to map the data to rows of 4 columns: Label1, Value1, Label2, Value2.
            const body = [];
            let currentRow = [];

            section.data.forEach((item, index) => {
                currentRow.push(item.label);
                currentRow.push(item.value);
                if (currentRow.length === 4) {
                    body.push(currentRow);
                    currentRow = [];
                }
            });
            if (currentRow.length > 0) {
                // Fill remaining cells
                while (currentRow.length < 4) {
                    currentRow.push('');
                }
                body.push(currentRow);
            }

            autoTable(doc, {
                startY: currentY,
                body: body,
                theme: 'grid', // This gives the bordered look
                styles: {
                    lineColor: 0,
                    lineWidth: 0.1,
                    cellPadding: 2,
                    fontSize: 9,
                    textColor: 0,
                    valign: 'middle'
                },
                columnStyles: {
                    0: { fontStyle: 'bold', fillColor: [240, 240, 240], cellWidth: 40 }, // Label 1
                    1: { cellWidth: 50 }, // Value 1
                    2: { fontStyle: 'bold', fillColor: [240, 240, 240], cellWidth: 40 }, // Label 2
                    3: { cellWidth: 'auto' }  // Value 2
                },
                margin: { left: margin, right: margin },
            });
            currentY = doc.lastAutoTable.finalY + 5;

        } else if (section.type === 'table') {
            // Standard data table
            autoTable(doc, {
                startY: currentY,
                head: [section.headers],
                body: section.body,
                theme: 'grid',
                headStyles: {
                    fillColor: [255, 255, 255],
                    textColor: 0,
                    lineColor: 0,
                    lineWidth: 0.1,
                    fontStyle: 'bold',
                    halign: 'center'
                },
                styles: {
                    lineColor: 0,
                    lineWidth: 0.1,
                    textColor: 0,
                    fontSize: 8
                },
                columnStyles: section.columnStyles || {},
                margin: { left: margin, right: margin },
            });
            currentY = doc.lastAutoTable.finalY + 5;

        } else if (section.type === 'signatures') {
            // Signatures Section
            // We need to ensure we have enough space
            if (currentY + 40 > pageHeight) {
                doc.addPage();
                currentY = 20;
            }

            const sigCount = section.data.length;
            const sigWidth = contentWidth / sigCount;

            section.data.forEach((sig, index) => {
                const x = margin + (index * sigWidth);
                const y = currentY;

                // Draw box for signature
                // doc.rect(x + 5, y, sigWidth - 10, 30);

                // Signature image/text
                if (sig.signature && sig.signature.startsWith('data:image')) {
                    try {
                        doc.addImage(sig.signature, 'PNG', x + 10, y, sigWidth - 20, 20, undefined, 'FAST');
                    } catch (e) { }
                } else if (sig.signature) {
                    doc.setFont("cursive"); // Just a placeholder, jsPDF might not have cursive default
                    doc.text(sig.signature, x + (sigWidth / 2), y + 15, { align: 'center' });
                }

                // Line
                doc.line(x + 10, y + 25, x + sigWidth - 10, y + 25);

                // Role/Name
                doc.setFont("helvetica", "bold");
                doc.setFontSize(9);
                doc.text(sig.role, x + (sigWidth / 2), y + 30, { align: 'center' });
                doc.setFont("helvetica", "normal");
                doc.text(sig.name || '', x + (sigWidth / 2), y + 35, { align: 'center' });
            });

            currentY += 45;
        }
    });

    doc.save(fileName);
};
