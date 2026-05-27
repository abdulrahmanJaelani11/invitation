const SHEET_NAME = "RSVP";

function doPost(e) {
  try {
    // Ambil payload JSON dari form RSVP.
    const rawBody =
      e && e.postData && e.postData.contents ? e.postData.contents : "{}";
    const payload = JSON.parse(rawBody);
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet =
      spreadsheet.getSheetByName(SHEET_NAME) ||
      spreadsheet.insertSheet(SHEET_NAME);

    // Pastikan header kolom selalu tersedia sebelum menulis data.
    ensureHeaderRow(sheet);

    const row = [
      payload.Nama || "",
      payload.Kehadiran || "",
      payload.Pesan || "",
      new Date(),
    ];

    sheet.appendRow(row);

    return jsonResponse({ status: "success", message: "RSVP tersimpan" });
  } catch (error) {
    return jsonResponse({
      status: "error",
      message: error && error.message ? error.message : "Gagal menyimpan RSVP",
    });
  }
}

function doGet() {
  return jsonResponse({ status: "ok" });
}

function ensureHeaderRow(sheet) {
  const header = ["Nama", "Kehadiran", "Pesan", "Timestamp"];
  const current =
    sheet.getLastRow() > 0
      ? sheet.getRange(1, 1, 1, header.length).getValues()[0]
      : [];
  const sameHeader = header.every((value, index) => current[index] === value);

  if (!sameHeader) {
    sheet.clear();
    sheet.appendRow(header);
  }
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
