function callChatGptApi(extractedText, isArRahnuLetter) {
  let promptContent;

  if (isArRahnuLetter) {
    promptContent = `Extract the following details from the Ar-Rahnu letter text and return them in valid JSON format. Ensure each field is present, even if the value is empty:
1. Nama Rahnu
2. Alamat Rahnu
3. No Siri
4. Rahnu User Details (in a simple paragraph)
5. Nilai Pembiayaan (RM)
6. Tarikh Gadaian (Date) (Look for phrases like "Tarikh Gadaian", "Tarikh Pajakan", or similar, typically in dd-mm-yyyy or dd/mm/yyyy formats)
7. Tarikh Matang (Date) (Look for phrases like "Tarikh Matang", "Tarikh Tamat Tempoh", or similar, typically in dd-mm-yyyy or dd/mm/yyyy formats)
8. Berat Emas (Gram) (Look for numbers followed by 'g', 'gm', 'gram', like "1.5g", "1.50gm", "1.50 gram")
9. Amaun Bulanan Upah Simpan (RM) (This is the storage fee, look for total amount over 6 months and calculate the monthly fee)
10. Kadar Faedah Bulanan (%) (This may be indirectly calculated from the storage fee, so calculate using the formula: (6 months charge / 6) / Nilai Pembiayaan)
11. Nombor Telefon
12. Waktu Operasi
13. Item Details (Look for descriptions of pawn items like "rantai tangan 916", "cincin emas bengkok 750", "loket emas (b)", etc. If there are multiple items, list them in a simple paragraph)`;
  } else {
    promptContent = `Extract the following details from the pawn letter text and return them in valid JSON format. Ensure each field is present, even if the value is empty:
1. Pajak Gadai Name
2. Pajak Gadai Address
3. No Siri
4. Pajak Gadai User Details (in a simple paragraph)
5. Loan Amount (RM)
6. Pajak Date (Date) (Look for "Tarikh Dipajak", "Tarikh Gadaian", "Tarikh Pajakan", or similar formats, typically in dd-mm-yyyy or dd/mm/yyyy)
7. Expired Date (Date) (Look for "Tarikh Tamat Tempoh", "Tarikh Matang", or similar formats, typically in dd-mm-yyyy or dd/mm/yyyy)
8. Total Item Weight (Gram) (Look for numbers followed by 'g', 'gm', 'gram', like "1.5g", "1.50gm", "1.50 gram")
9. Amount Monthly Interest (RM)
10. Monthly Interest Rate (%) (Look for percentages like "1.5%", "2%", "2.0%")
11. Nombor Telefon
12. Working Hour
13. Item Details (Look for descriptions of pawn items like "rantai tangan 916", "cincin emas bengkok 750", "loket emas (b)", etc. If there are multiple items, list them in a simple paragraph)`;
  }

  const payload = {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: promptContent },
      { role: "user", content: extractedText }
    ]
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    headers: {
      Authorization: `Bearer ${CHATGPT_API_KEY}`
    },
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(CHATGPT_API_URL, options);
  
  return JSON.parse(response.getContentText());
}
