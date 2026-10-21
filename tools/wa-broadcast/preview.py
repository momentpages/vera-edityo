#!/usr/bin/env python3
"""Print one WA message for a guest name (same template as Code.gs)."""

import sys
from urllib.parse import quote

SITE_URL = "https://momentpages.github.io/vera-edityo/"


def message_for_name(name: str) -> str:
    guest = (name or "").strip() or "Saudara/i"
    link = f"{SITE_URL}?to={quote(guest)}"
    pray = "\U0001f64f"
    return f"""Assalamu'alaikum / Selamat siang, Bapak/Ibu/Saudara/i *{guest}* {pray}

Dengan memohon rahmat dan ridha Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir pada:

Akad Nikah dan Syukuran
Vera & Edityo

\U0001f4c5 Sabtu, 31 Oktober 2026
\U0001f550 13.00-17.00 WIB
\U0001f4cd Restoran Sugeban, Jalan Alianyang, Pontianak

Berikut undangan digital kami:
{link}

Silakan buka link di atas untuk detail lengkap dan petunjuk arah ke lokasi.

Merupakan honor bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir. Atas perhatian dan doa restunya, kami ucapkan terima kasih.

Wassalamu'alaikum / Salam hangat,
Keluarga Vera & Edityo"""


if __name__ == "__main__":
    name = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else "Vera Isnaini"
    print(message_for_name(name))
