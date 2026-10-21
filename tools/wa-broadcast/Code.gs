/** @OnlyCurrentDoc */

const SITE_URL = "https://momentpages.github.io/vera-edityo/";
/** Emoji via code points so encoding + Sheets stay valid (needs runtime V8 — see appsscript.json). */
const EMOJI = {
  PRAY: String.fromCodePoint(0x1f64f),
  DATE: String.fromCodePoint(0x1f4c5),
  TIME: String.fromCodePoint(0x1f550),
  PIN: String.fromCodePoint(0x1f4cd),
};
const NAME_COLUMN = 1; // A
const MESSAGE_COLUMN = 2; // B
const WA_LINK_COLUMN = 3; // C
const FIRST_DATA_ROW = 2;

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Undangan WA")
    .addItem("Generate pesan", "generateMessages")
    .addToUi();
}

/**
 * Build one WhatsApp message; name is URL-encoded in the invite link.
 * @param {string} name Guest name from column A
 * @return {string}
 */
function messageForName(name) {
  var trimmed = String(name || "").trim();
  var guest = trimmed || "Saudara/i";
  var link = SITE_URL + "?to=" + encodeURIComponent(guest);

  return (
    "Assalamu'alaikum Bapak/Ibu/Saudara/i " +  EMOJI.PRAY + "\n*" + guest + "* \n\n" +
    "Dengan memohon rahmat dan ridha Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir pada:\n\n" +
    "Akad Nikah dan Syukuran\n" +
    "Vera & Edityo\n\n" +
    EMOJI.DATE + " Sabtu, 31 Oktober 2026\n" +
    EMOJI.TIME + " 13.00-17.00 WIB\n" +
    EMOJI.PIN + " Restoran Sugeban, Jalan Alianyang, Pontianak\n\n" +
    "Berikut undangan digital kami:\n" +
    link +
    "\n\n" +
    "Silakan buka link di atas untuk detail lengkap dan petunjuk arah ke lokasi.\n\n" +
    "Merupakan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir. Atas perhatian dan doa restunya, kami ucapkan terima kasih.\n\n" +
    "Wassalamu'alaikum,\n" +
    "Keluarga Vera & Edityo"
  );
}

/** Custom function: =WA_MESSAGE(A2) in a cell (optional). */
function WA_MESSAGE(name) {
  return messageForName(name);
}

/** UTF-8 safe for wa.me (V8). Legacy Rhino breaks emoji in encodeURIComponent. */
function buildWhatsAppLink(message) {
  return "https://api.whatsapp.com/send/?text=" + encodeURIComponent(message);
}

function generateMessages() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow < FIRST_DATA_ROW) {
    SpreadsheetApp.getUi().alert("Tidak ada nama di kolom A (mulai baris 2).");
    return;
  }

  var names = sheet
    .getRange(FIRST_DATA_ROW, NAME_COLUMN, lastRow - FIRST_DATA_ROW + 1, 1)
    .getValues();

  var messages = [];
  var waLinks = [];

  for (var i = 0; i < names.length; i++) {
    var name = names[i][0];
    if (!String(name).trim()) {
      messages.push([""]);
      waLinks.push([""]);
      continue;
    }
    var msg = messageForName(name);
    messages.push([msg]);
    waLinks.push([buildWhatsAppLink(msg)]);
  }

  sheet
    .getRange(FIRST_DATA_ROW, MESSAGE_COLUMN, messages.length, 1)
    .setValues(messages);
  sheet
    .getRange(FIRST_DATA_ROW, WA_LINK_COLUMN, waLinks.length, 1)
    .setValues(waLinks);

  sheet.setColumnWidth(MESSAGE_COLUMN, 480);
  sheet.setColumnWidth(WA_LINK_COLUMN, 220);
}
