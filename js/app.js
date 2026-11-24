/* ==========================================================================
   TemuDosen — JavaScript Dasar Pemula (Client-Side Prototype)
   Fungsi: Menyimpan data di localStorage & menyinkronkan 5 halaman HTML
   ========================================================================== */

var STORAGE_KEY = "temudosen_demo_state_v2";

// Daftar hari untuk tampilan tanggal lengkap & singkat
var DAFTAR_HARI = {
  "2026-11-16": { panjang: "Senin, 16 November 2026", singkat: "Senin, 16 Nov 2026" },
  "2026-11-17": { panjang: "Selasa, 17 November 2026", singkat: "Selasa, 17 Nov 2026" },
  "2026-11-18": { panjang: "Rabu, 18 November 2026", singkat: "Rabu, 18 Nov 2026" },
  "2026-11-19": { panjang: "Kamis, 19 November 2026", singkat: "Kamis, 19 Nov 2026" },
  "2026-11-20": { panjang: "Jumat, 20 November 2026", singkat: "Jumat, 20 Nov 2026" }
};

// ==========================================================================
// 1. DATA AWAL (DUMMY) & FUNGSI HELPER LOCALSTORAGE
// ==========================================================================
function buatDataAwal() {
  return {
    tiketAktif: {
      kode: "TD-7K2M9Q",
      dosen: "Dr. Arif Wicaksono, M.Kom.",
      ruang: "Ruang Dosen Gedung A.204",
      tanggal: "2026-11-16",
      jam: "13.00 - 14.00",
      tipe: "Cepat (KRS)",
      status: "terkonfirmasi" // terkonfirmasi | selesai | dibatalkan
    },
    notifikasi: [
      {
        judul: "Pengingat: batas KRS minggu ini",
        isi: "Pastikan telah berkonsultasi sebelum Jumat, 20 Nov 2026.",
        waktu: "1 hari lalu",
        darurat: false
      },
      {
        judul: "Selamat datang di TemuDosen",
        isi: "Sistem bimbingan akademik DPA kini telah aktif dan siap digunakan.",
        waktu: "2 hari lalu",
        darurat: false
      }
    ],
    slots: [
      // Senin, 16 Nov 2026 (Slot Terjadwal Hari Ini — sesuai Layar 4)
      { id: "s1", tanggal: "2026-11-16", jamMulai: "09.00", jamSelesai: "10.00", tipe: "Cepat (KRS)", terisi: 2, kuota: 5 },
      { id: "s2", tanggal: "2026-11-16", jamMulai: "10.00", jamSelesai: "11.00", tipe: "Cepat (KRS)", terisi: 4, kuota: 5 },
      { id: "s3", tanggal: "2026-11-16", jamMulai: "14.00", jamSelesai: "15.00", tipe: "Lama (Skripsi)", terisi: 1, kuota: 2 },

      // Selasa, 17 Nov 2026 (Default aktif di Layar 2 — sesuai Hi-Fi)
      { id: "s4", tanggal: "2026-11-17", jamMulai: "09.00", jamSelesai: "10.00", tipe: "Cepat (KRS)", terisi: 2, kuota: 5 },
      { id: "s5", tanggal: "2026-11-17", jamMulai: "10.00", jamSelesai: "11.00", tipe: "Cepat (KRS)", terisi: 4, kuota: 5 },
      { id: "s6", tanggal: "2026-11-17", jamMulai: "11.00", jamSelesai: "12.00", tipe: "Cepat (KRS)", terisi: 5, kuota: 5 },
      { id: "s7", tanggal: "2026-11-17", jamMulai: "13.00", jamSelesai: "14.00", tipe: "Cepat (KRS)", terisi: 0, kuota: 5 },
      { id: "s8", tanggal: "2026-11-17", jamMulai: "14.00", jamSelesai: "15.00", tipe: "Lama (Skripsi)", terisi: 1, kuota: 2 },

      // Rabu, 18 Nov 2026
      { id: "s9", tanggal: "2026-11-18", jamMulai: "09.00", jamSelesai: "10.00", tipe: "Cepat (KRS)", terisi: 1, kuota: 5 },
      { id: "s10", tanggal: "2026-11-18", jamMulai: "13.00", jamSelesai: "14.00", tipe: "Lama (Skripsi)", terisi: 0, kuota: 2 },

      // Kamis, 19 Nov 2026
      { id: "s11", tanggal: "2026-11-19", jamMulai: "10.00", jamSelesai: "11.00", tipe: "Cepat (KRS)", terisi: 3, kuota: 5 },
      { id: "s12", tanggal: "2026-11-19", jamMulai: "14.00", jamSelesai: "15.00", tipe: "Lama (Skripsi)", terisi: 2, kuota: 2 },

      // Jumat, 20 Nov 2026
      { id: "s13", tanggal: "2026-11-20", jamMulai: "08.00", jamSelesai: "09.00", tipe: "Cepat (KRS)", terisi: 2, kuota: 5 },
      { id: "s14", tanggal: "2026-11-20", jamMulai: "09.00", jamSelesai: "10.00", tipe: "Lama (Skripsi)", terisi: 1, kuota: 3 }
    ],
    agenda: [
      {
        id: "a1",
        inisial: "SN",
        nama: "Salsa Nadhifa",
        nim: "24060124130045",
        jam: "09.00 - 10.00 WIB",
        tipe: "Cepat (KRS)",
        status: "aktif",
        sorot: false
      },
      {
        id: "a2",
        inisial: "DP",
        nama: "Dimas Prakoso",
        nim: "24060124120019",
        jam: "10.00 - 11.00 WIB",
        tipe: "Cepat (KRS)",
        status: "aktif",
        sorot: false
      },
      {
        id: "a3",
        inisial: "LE",
        nama: "Lungga Elyas",
        nim: "24060124120001",
        jam: "13.00 - 14.00 WIB",
        tipe: "Cepat (KRS)",
        status: "aktif",
        sorot: true
      },
      {
        id: "a4",
        inisial: "NA",
        nama: "Nadia Ayuningtyas",
        nim: "23060123140082",
        jam: "14.00 - 15.00 WIB",
        tipe: "Lama (Skripsi)",
        status: "selesai",
        sorot: false
      }
    ]
  };
}

function ambilState() {
  var tersimpan = localStorage.getItem(STORAGE_KEY);
  if (!tersimpan) {
    var awal = buatDataAwal();
    simpanState(awal);
    return awal;
  }
  try {
    return JSON.parse(tersimpan);
  } catch (err) {
    var reset = buatDataAwal();
    simpanState(reset);
    return reset;
  }
}

function simpanState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function resetDataDemo() {
  var awal = buatDataAwal();
  simpanState(awal);
  return awal;
}

// Helper menampilkan pesan toast singkat di pojok kanan bawah
var timerToast = null;
function tampilkanToast(pesan) {
  var el = document.getElementById("toast");
  if (!el) return;
  el.textContent = pesan;
  el.classList.add("is-visible");

  clearTimeout(timerToast);
  timerToast = setTimeout(function () {
    el.classList.remove("is-visible");
  }, 3000);
}

// Helper format label tanggal dari kode YYYY-MM-DD
function formatTanggal(kodeTanggal, singkat) {
  var info = DAFTAR_HARI[kodeTanggal];
  if (!info) return kodeTanggal;
  return singkat ? info.singkat : info.panjang;
}

// Helper membuat kode tiket acak, contoh: TD-4M8P2K
function buatKodeTiket() {
  var karakter = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  var hasil = "TD-";
  for (var i = 0; i < 6; i++) {
    var acak = Math.floor(Math.random() * karakter.length);
    hasil += karakter.charAt(acak);
  }
  return hasil;
}

// Helper mengubah "09.00" atau "09:00" menjadi total menit (540) untuk validasi
function keMenit(teksJam) {
  var bersih = teksJam.trim().replace(":", ".");
  var cocok = /^([01]\d|2[0-3])\.([0-5]\d)$/.exec(bersih);
  if (!cocok) return null;
  var jam = parseInt(cocok[1], 10);
  var menit = parseInt(cocok[2], 10);
  return jam * 60 + menit;
}

// ==========================================================================
// 2. LOGIKA LAYAR 1 — BERANDA MAHASISWA (index.html)
// ==========================================================================
function initBeranda() {
  var state = ambilState();
  renderBeranda(state);

  var btnReset = document.getElementById("btnResetDemo");
  if (btnReset) {
    btnReset.addEventListener("click", function () {
      var dataBaru = resetDataDemo();
      renderBeranda(dataBaru);
      tampilkanToast("Data demo berhasil dikembalikan ke kondisi awal.");
    });
  }
}

function renderBeranda(state) {
  var containerTiket = document.getElementById("berandaTicketContainer");
  var notifList = document.getElementById("notifList");

  // Render kartu tiket aktif di dalam hero box
  if (containerTiket) {
    var tiket = state.tiketAktif;
    if (!tiket) {
      containerTiket.innerHTML =
        '<div class="empty-ticket-box">' +
        '  <p>Belum ada jadwal bimbingan aktif. Klik <strong>Cari Jadwal DPA</strong> untuk memesan sesi.</p>' +
        "</div>";
    } else {
      var badgeStatus = '<span class="badge badge-success">✓ Terkonfirmasi</span>';
      if (tiket.status === "selesai") {
        badgeStatus = '<span class="badge badge-success">✓ Selesai</span>';
      } else if (tiket.status === "dibatalkan") {
        badgeStatus = '<span class="badge badge-danger">✕ Dibatalkan Darurat</span>';
      }

      var badgeTipeClass = tiket.tipe.indexOf("Skripsi") !== -1 ? "badge-skripsi" : "badge-info";

      containerTiket.innerHTML =
        '<div class="hero-ticket-card">' +
        '  <div class="ticket-card-top">' +
        '    <div class="badge-group">' +
        '      <span class="badge ' + badgeTipeClass + '">' + tiket.tipe + "</span>" +
        "      " + badgeStatus +
        "    </div>" +
        '    <div class="ticket-code-inline">Kode: <span class="mono">' + tiket.kode + "</span></div>" +
        "  </div>" +
        "  <div>" +
        '    <h3 class="card-title">' + tiket.dosen + "</h3>" +
        '    <p class="page-subtitle">' + tiket.ruang + "</p>" +
        "  </div>" +
        '  <div class="ticket-card-bottom">' +
        '    <div class="ticket-datetime mono">' +
        "      <span>" + formatTanggal(tiket.tanggal, false) + "</span>" +
        "      <span>·</span>" +
        "      <span>" + tiket.jam + " WIB</span>" +
        "    </div>" +
        '    <a href="tiket.html" class="btn btn-outline-secondary">Lihat Tiket Saya →</a>' +
        "  </div>" +
        "</div>";
    }
  }

  // Render daftar riwayat notifikasi di panel kanan
  if (notifList) {
    var htmlNotif = "";
    for (var i = 0; i < state.notifikasi.length; i++) {
      var item = state.notifikasi[i];
      var kelasDarurat = item.darurat ? " is-emergency" : "";
      htmlNotif +=
        '<article class="notif-card' + kelasDarurat + '">' +
        '  <div class="notif-title">' + item.judul + "</div>" +
        '  <p class="notif-body">' + item.isi + "</p>" +
        '  <span class="caption">' + item.waktu + "</span>" +
        "</article>";
    }
    notifList.innerHTML = htmlNotif;
  }
}

// ==========================================================================
// 3. LOGIKA LAYAR 2 — CARI JADWAL (cari-jadwal.html)
// ==========================================================================
function initCariJadwal() {
  var state = ambilState();
  var hariDipilih = "2026-11-17"; // Default Selasa, 17 Nov 2026 (sesuai Hi-Fi)
  var tipeDipilih = "Cepat (KRS)";
  var idSlotDipilih = "s5"; // Default 10.00 - 11.00 (sesuai Hi-Fi)

  var tombolHari = document.querySelectorAll("#daySelector .day-chip");
  var tombolTipe = document.querySelectorAll(".segmented-control .segmented-btn");
  var btnKonfirmasi = document.getElementById("btnConfirmBooking");

  function renderSlotDanRingkasan() {
    var heading = document.getElementById("slotListHeading");
    var slotList = document.getElementById("slotList");
    var summaryDate = document.getElementById("summaryDate");
    var summaryTime = document.getElementById("summaryTime");
    var summaryType = document.getElementById("summaryType");
    var alertBox = document.getElementById("bookingConstraintAlert");

    if (heading) {
      heading.textContent = "Slot Tersedia (" + formatTanggal(hariDipilih, true) + ")";
    }

    // Filter slot sesuai hari & tipe yang dipilih
    var daftarSlot = state.slots.filter(function (s) {
      return s.tanggal === hariDipilih && s.tipe === tipeDipilih;
    });

    // Cek apakah slot yang dipilih masih ada di daftar & tidak penuh
    var slotAktif = null;
    for (var i = 0; i < daftarSlot.length; i++) {
      if (daftarSlot[i].id === idSlotDipilih && daftarSlot[i].terisi < daftarSlot[i].kuota) {
        slotAktif = daftarSlot[i];
        break;
      }
    }

    // Jika belum ada yang dipilih, pilih otomatis slot pertama yang masih tersedia
    if (!slotAktif) {
      for (var j = 0; j < daftarSlot.length; j++) {
        if (daftarSlot[j].terisi < daftarSlot[j].kuota) {
          slotAktif = daftarSlot[j];
          idSlotDipilih = slotAktif.id;
          break;
        }
      }
    }

    // Render daftar kartu slot
    if (slotList) {
      if (daftarSlot.length === 0) {
        slotList.innerHTML =
          '<div class="empty-ticket-box">' +
          "  <p>Belum ada slot <strong>" + tipeDipilih + "</strong> pada hari ini. Coba pilih hari atau tipe lain.</p>" +
          "</div>";
      } else {
        var html = "";
        for (var k = 0; k < daftarSlot.length; k++) {
          var s = daftarSlot[k];
          var penuh = s.terisi >= s.kuota;
          var terpilih = slotAktif && s.id === slotAktif.id;
          var sisa = s.kuota - s.terisi;

          var kelasKartu = "slot-card";
          if (terpilih) kelasKartu += " is-selected";
          if (penuh) kelasKartu += " is-full";

          var badgeHtml = "";
          if (penuh) {
            badgeHtml = '<span class="badge badge-muted">✕ Penuh</span>';
          } else if (terpilih) {
            badgeHtml = '<span class="badge badge-selected">✓ Dipilih</span>';
          } else {
            badgeHtml = '<span class="badge badge-success">✓ Tersedia · sisa ' + sisa + "</span>";
          }

          // Buat titik indikator kuota (quota dots)
          var dotsHtml = "";
          for (var d = 0; d < s.kuota; d++) {
            dotsHtml += '<span class="quota-dot' + (d < s.terisi ? " is-filled" : "") + '"></span>';
          }

          html +=
            '<button type="button" class="' + kelasKartu + '" data-slot-id="' + s.id + '"' + (penuh ? " disabled" : "") + ">" +
            "  <div>" +
            '    <div class="slot-time mono">' + s.jamMulai + " - " + s.jamSelesai + "</div>" +
            '    <div class="quota-dots" aria-label="Terisi ' + s.terisi + " dari " + s.kuota + '">' + dotsHtml + "</div>" +
            "  </div>" +
            "  " + badgeHtml +
            "</button>";
        }
        slotList.innerHTML = html;

        // Tambahkan event klik ke setiap kartu slot yang bisa dipilih
        var semuaKartu = slotList.querySelectorAll(".slot-card:not(:disabled)");
        for (var c = 0; c < semuaKartu.length; c++) {
          semuaKartu[c].addEventListener("click", function () {
            idSlotDipilih = this.getAttribute("data-slot-id");
            renderSlotDanRingkasan();
          });
        }
      }
    }

    // Perbarui Panel Kanan (Ringkasan Pilihan)
    if (summaryDate) summaryDate.textContent = formatTanggal(hariDipilih, false);
    if (summaryType) summaryType.textContent = tipeDipilih;

    // Cek apakah mahasiswa mencoba memesan jadwal yang persis sama dengan tiket aktif
    var sudahPesanSlotSama = false;
    if (slotAktif && state.tiketAktif && state.tiketAktif.status === "terkonfirmasi") {
      var jamSlot = slotAktif.jamMulai + " - " + slotAktif.jamSelesai;
      if (state.tiketAktif.tanggal === slotAktif.tanggal && state.tiketAktif.jam === jamSlot) {
        sudahPesanSlotSama = true;
      }
    }

    if (slotAktif) {
      if (summaryTime) summaryTime.textContent = slotAktif.jamMulai + " - " + slotAktif.jamSelesai + " WIB";
    } else {
      if (summaryTime) summaryTime.textContent = "Belum ada slot dipilih";
    }

    if (alertBox) {
      if (sudahPesanSlotSama) {
        alertBox.textContent = "Anda sudah memiliki reservasi aktif pada tanggal dan jam yang sama.";
        alertBox.classList.remove("d-none");
      } else {
        alertBox.classList.add("d-none");
      }
    }

    if (btnKonfirmasi) {
      btnKonfirmasi.disabled = !slotAktif || sudahPesanSlotSama;
    }
  }

  // Event klik pada Day Chips
  for (var i = 0; i < tombolHari.length; i++) {
    tombolHari[i].addEventListener("click", function () {
      if (this.disabled) return;
      for (var j = 0; j < tombolHari.length; j++) {
        tombolHari[j].classList.remove("is-active");
      }
      this.classList.add("is-active");
      hariDipilih = this.getAttribute("data-day");
      idSlotDipilih = null;
      renderSlotDanRingkasan();
    });
  }

  // Event klik pada Segmented Control (Cepat KRS vs Lama Skripsi)
  for (var t = 0; t < tombolTipe.length; t++) {
    tombolTipe[t].addEventListener("click", function () {
      for (var j = 0; j < tombolTipe.length; j++) {
        tombolTipe[j].classList.remove("is-active");
      }
      this.classList.add("is-active");
      tipeDipilih = this.getAttribute("data-type");
      idSlotDipilih = null;
      renderSlotDanRingkasan();
    });
  }

  // Event klik Tombol Konfirmasi Booking -> simpan ke localStorage lalu pindah ke tiket.html
  if (btnKonfirmasi) {
    btnKonfirmasi.addEventListener("click", function () {
      var slotTerpilih = null;
      for (var i = 0; i < state.slots.length; i++) {
        if (state.slots[i].id === idSlotDipilih) {
          slotTerpilih = state.slots[i];
          break;
        }
      }
      if (!slotTerpilih || slotTerpilih.terisi >= slotTerpilih.kuota) return;

      // Efek loading singkat sebelum pindah halaman
      btnKonfirmasi.classList.add("is-loading");
      btnKonfirmasi.textContent = "Memproses Booking...";

      // Tambah jumlah terisi pada slot
      slotTerpilih.terisi += 1;

      var kodeBaru = buatKodeTiket();
      state.tiketAktif = {
        kode: kodeBaru,
        dosen: "Dr. Arif Wicaksono, M.Kom.",
        ruang: "Ruang Dosen Gedung A.204",
        tanggal: slotTerpilih.tanggal,
        jam: slotTerpilih.jamMulai + " - " + slotTerpilih.jamSelesai,
        tipe: slotTerpilih.tipe,
        status: "terkonfirmasi"
      };

      // Tambahkan notifikasi konfirmasi ke riwayat notifikasi Beranda
      state.notifikasi.unshift({
        judul: "Reservasi berhasil (" + kodeBaru + ")",
        isi: "Sesi " + slotTerpilih.tipe + " pada " + formatTanggal(slotTerpilih.tanggal, true) + " pukul " + slotTerpilih.jamMulai + " - " + slotTerpilih.jamSelesai + " WIB telah terkonfirmasi.",
        waktu: "Baru saja",
        darurat: false
      });

      simpanState(state);

      setTimeout(function () {
        window.location.href = "tiket.html";
      }, 450);
    });
  }

  renderSlotDanRingkasan();
}

// ==========================================================================
// 4. LOGIKA LAYAR 3 — TIKET / RESI SAYA (tiket.html)
// ==========================================================================
function initTiket() {
  var state = ambilState();
  var tiket = state.tiketAktif;
  if (!tiket) return;

  var elCode = document.getElementById("receiptCode");
  var elType = document.getElementById("receiptTypeBadge");
  var elStatus = document.getElementById("receiptStatusBadge");
  var elDate = document.getElementById("receiptDate");
  var elTime = document.getElementById("receiptTime");
  var elStepper = document.getElementById("receiptStepper");
  var elNote = document.getElementById("receiptNote");

  if (elCode) elCode.textContent = tiket.kode;
  if (elType) {
    elType.textContent = tiket.tipe;
    elType.className = "badge " + (tiket.tipe.indexOf("Skripsi") !== -1 ? "badge-skripsi" : "badge-info");
  }
  if (elDate) elDate.textContent = formatTanggal(tiket.tanggal, true);
  if (elTime) elTime.textContent = tiket.jam + " WIB";

  // Sesuaikan badge status, 3-Step Stepper, dan kotak catatan berdasarkan status tiket
  if (tiket.status === "selesai") {
    if (elStatus) {
      elStatus.className = "badge badge-success";
      elStatus.textContent = "✓ Selesai";
    }
    if (elStepper) {
      elStepper.innerHTML =
        '<div class="step-item is-done"><div class="step-circle">✓</div><div class="step-label">Terkonfirmasi</div></div>' +
        '<div class="step-item is-done"><div class="step-circle">✓</div><div class="step-label">Pertemuan</div></div>' +
        '<div class="step-item is-done"><div class="step-circle">✓</div><div class="step-label">Selesai</div></div>';
    }
    if (elNote) {
      elNote.innerHTML = "Sesi bimbingan dengan kode <span class='mono'>" + tiket.kode + "</span> telah diverifikasi selesai oleh Dr. Arif Wicaksono.";
    }
  } else if (tiket.status === "dibatalkan") {
    if (elStatus) {
      elStatus.className = "badge badge-danger";
      elStatus.textContent = "✕ Dibatalkan Darurat";
    }
    if (elStepper) {
      elStepper.innerHTML =
        '<div class="step-item is-done"><div class="step-circle">✓</div><div class="step-label">Terkonfirmasi</div></div>' +
        '<div class="step-item"><div class="step-circle">✕</div><div class="step-label">Dibatalkan</div></div>' +
        '<div class="step-item"><div class="step-circle">3</div><div class="step-label">Selesai</div></div>';
    }
    if (elNote) {
      elNote.style.backgroundColor = "#FEF2F2";
      elNote.style.borderColor = "#FCA5A5";
      elNote.innerHTML = "Sesi dengan kode <span class='mono'>" + tiket.kode + "</span> dibatalkan oleh dosen karena halangan mendadak. Silakan pesan sesi baru.";
    }
  } else {
    if (elStatus) {
      elStatus.className = "badge badge-success";
      elStatus.textContent = "✓ Terkonfirmasi";
    }
    if (elNote) {
      elNote.innerHTML = "Tunjukkan kode <span class='mono'>" + tiket.kode + "</span> kepada Dr. Arif Wicaksono saat tiba di ruang bimbingan.";
    }
  }
}

// ==========================================================================
// 5. LOGIKA LAYAR 4 — ATUR JADWAL DOSEN (atur-jadwal.html)
// ==========================================================================
function initAturJadwal() {
  var state = ambilState();
  var kuota = 3;
  var tipeSesi = "Cepat (KRS)";

  var form = document.getElementById("slotForm");
  var selectTanggal = document.getElementById("slotDate");
  var inputMulai = document.getElementById("slotStart");
  var inputSelesai = document.getElementById("slotEnd");
  var errorBox = document.getElementById("slotFormError");
  var btnMinus = document.getElementById("btnQuotaMinus");
  var btnPlus = document.getElementById("btnQuotaPlus");
  var elQuota = document.getElementById("quotaValue");
  var tombolTipe = document.querySelectorAll("#slotTypeControl .segmented-btn");

  function renderSlotTerjadwal() {
    var list = document.getElementById("scheduledList");
    var heading = document.getElementById("scheduledHeading");
    var tanggalAktif = selectTanggal ? selectTanggal.value : "2026-11-16";

    if (heading) {
      heading.textContent = tanggalAktif === "2026-11-16"
        ? "Slot Terjadwal Hari Ini"
        : "Slot " + formatTanggal(tanggalAktif, true);
    }

    var slotHariIni = state.slots.filter(function (s) {
      return s.tanggal === tanggalAktif;
    });

    // Urutkan berdasarkan jam mulai
    slotHariIni.sort(function (a, b) {
      return keMenit(a.jamMulai) - keMenit(b.jamMulai);
    });

    if (!list) return;
    if (slotHariIni.length === 0) {
      list.innerHTML = '<div class="empty-ticket-box"><p>Belum ada slot terjadwal pada tanggal ini.</p></div>';
      return;
    }

    var html = "";
    for (var i = 0; i < slotHariIni.length; i++) {
      var s = slotHariIni[i];
      var isSkripsi = s.tipe.indexOf("Skripsi") !== -1;
      var badgeLabel = isSkripsi ? "Skripsi" : "Cepat";
      var badgeClass = isSkripsi ? "badge-skripsi" : "badge-info";

      html +=
        '<article class="scheduled-card">' +
        "  <div>" +
        '    <div class="scheduled-time mono">' + s.jamMulai + " - " + s.jamSelesai + "</div>" +
        '    <span class="badge ' + badgeClass + '">' + badgeLabel + "</span>" +
        "  </div>" +
        '  <span class="scheduled-quota mono">terisi ' + s.terisi + "/" + s.kuota + "</span>" +
        "</article>";
    }
    list.innerHTML = html;
  }

  function tampilkanError(pesan) {
    if (!errorBox) return;
    if (pesan) {
      errorBox.textContent = pesan;
      errorBox.classList.add("is-visible");
      if (inputMulai) inputMulai.classList.add("is-invalid");
      if (inputSelesai) inputSelesai.classList.add("is-invalid");
    } else {
      errorBox.textContent = "";
      errorBox.classList.remove("is-visible");
      if (inputMulai) inputMulai.classList.remove("is-invalid");
      if (inputSelesai) inputSelesai.classList.remove("is-invalid");
    }
  }

  function updateStepper() {
    if (elQuota) elQuota.textContent = kuota;
    if (btnMinus) btnMinus.disabled = kuota <= 1;
    if (btnPlus) btnPlus.disabled = kuota >= 10;
  }

  // Event stepper kuota 1 - 10
  if (btnMinus) {
    btnMinus.addEventListener("click", function () {
      if (kuota > 1) {
        kuota -= 1;
        updateStepper();
      }
    });
  }
  if (btnPlus) {
    btnPlus.addEventListener("click", function () {
      if (kuota < 10) {
        kuota += 1;
        updateStepper();
      }
    });
  }

  // Event ganti tipe sesi (Cepat KRS vs Lama Skripsi)
  for (var i = 0; i < tombolTipe.length; i++) {
    tombolTipe[i].addEventListener("click", function () {
      for (var j = 0; j < tombolTipe.length; j++) {
        tombolTipe[j].classList.remove("is-active");
      }
      this.classList.add("is-active");
      tipeSesi = this.getAttribute("data-type");
    });
  }

  // Event ganti tanggal di dropdown -> refresh daftar slot panel kanan
  if (selectTanggal) {
    selectTanggal.addEventListener("change", function () {
      tampilkanError("");
      renderSlotTerjadwal();
    });
  }

  // Event submit formulir tambah slot baru
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      tampilkanError("");

      var tanggal = selectTanggal.value;
      var mulaiTeks = inputMulai.value.trim().replace(":", ".");
      var selesaiTeks = inputSelesai.value.trim().replace(":", ".");
      var menitMulai = keMenit(mulaiTeks);
      var menitSelesai = keMenit(selesaiTeks);

      if (menitMulai === null || menitSelesai === null) {
        tampilkanError("Format jam tidak valid. Gunakan format 24 jam seperti 08.00 atau 13.30.");
        return;
      }

      if (menitMulai % 15 !== 0 || menitSelesai % 15 !== 0) {
        tampilkanError("Menit harus kelipatan 15 menit (00, 15, 30, atau 45).");
        return;
      }

      if (menitSelesai <= menitMulai) {
        tampilkanError("Jam selesai harus lebih besar dari jam mulai.");
        return;
      }

      // Cek bentrok waktu dengan slot yang sudah ada pada tanggal yang sama
      for (var idx = 0; idx < state.slots.length; idx++) {
        var s = state.slots[idx];
        if (s.tanggal !== tanggal) continue;
        var sMulai = keMenit(s.jamMulai);
        var sSelesai = keMenit(s.jamSelesai);
        if (menitMulai < sSelesai && menitSelesai > sMulai) {
          tampilkanError("Jadwal bentrok dengan slot " + s.jamMulai + " - " + s.jamSelesai + " pada hari tersebut.");
          return;
        }
      }

      // Simpan slot baru ke state & localStorage
      var slotBaru = {
        id: "s" + Date.now(),
        tanggal: tanggal,
        jamMulai: mulaiTeks,
        jamSelesai: selesaiTeks,
        tipe: tipeSesi,
        terisi: 0,
        kuota: kuota
      };

      state.slots.push(slotBaru);
      simpanState(state);

      renderSlotTerjadwal();
      tampilkanToast("Slot baru " + mulaiTeks + " - " + selesaiTeks + " berhasil disimpan!");
    });
  }

  updateStepper();
  renderSlotTerjadwal();
}

// ==========================================================================
// 6. LOGIKA LAYAR 5 — AGENDA & MODE DARURAT DOSEN (agenda.html)
// ==========================================================================
function initAgenda() {
  var state = ambilState();

  var modal = document.getElementById("emergencyModal");
  var btnOpenModal = document.getElementById("btnOpenEmergencyModal");
  var btnCloseModal = document.getElementById("btnCloseModal");
  var btnCancelModal = document.getElementById("btnCancelModal");
  var btnConfirmEmergency = document.getElementById("btnConfirmEmergency");
  var btnRestoreDemo = document.getElementById("btnRestoreDemo");

  function hitungSesiAktif() {
    var jumlah = 0;
    for (var i = 0; i < state.agenda.length; i++) {
      if (state.agenda[i].status === "aktif") jumlah += 1;
    }
    return jumlah;
  }

  function renderAgenda() {
    var list = document.getElementById("agendaList");
    var countBadge = document.getElementById("agendaCountBadge");
    var emergencyDesc = document.getElementById("emergencyDesc");
    var modalConsequence = document.getElementById("modalConsequence");

    var totalSesi = state.agenda.length;
    var jumlahAktif = hitungSesiAktif();

    if (countBadge) countBadge.textContent = totalSesi + " sesi";

    if (emergencyDesc) {
      if (jumlahAktif > 0) {
        emergencyDesc.textContent =
          "Jika Anda berhalangan hadir mendadak, Anda dapat membatalkan seluruh " +
          jumlahAktif +
          " sesi aktif hari ini sekaligus. Mahasiswa akan otomatis menerima notifikasi pembatalan.";
      } else {
        emergencyDesc.textContent =
          "Tidak ada sesi aktif yang tersisa hari ini. Semua sesi sudah selesai atau dibatalkan.";
      }
    }

    if (modalConsequence) {
      modalConsequence.innerHTML =
        "Anda akan membatalkan <strong>" + jumlahAktif + " sesi aktif</strong> hari ini (Senin, 16 November 2026). " +
        "Seluruh mahasiswa terdampak akan menerima notifikasi pembatalan darurat secara otomatis.";
    }

    if (btnOpenModal) {
      btnOpenModal.disabled = jumlahAktif === 0;
    }

    if (btnRestoreDemo) {
      if (jumlahAktif === 0) {
        btnRestoreDemo.classList.remove("d-none");
      } else {
        btnRestoreDemo.classList.add("d-none");
      }
    }

    if (!list) return;

    var html = "";
    for (var i = 0; i < state.agenda.length; i++) {
      var item = state.agenda[i];
      var kelasKartu = "agenda-card";
      var kelasAvatar = "avatar";
      var aksiHtml = "";

      if (item.status === "selesai") {
        kelasKartu += " is-done";
        kelasAvatar += " avatar-success";
        aksiHtml = '<span class="badge badge-success">✓ Selesai</span>';
      } else if (item.status === "dibatalkan") {
        kelasKartu += " is-cancelled";
        aksiHtml = '<span class="badge badge-danger">✕ Dibatalkan</span>';
      } else {
        if (item.sorot) {
          kelasKartu += " is-highlighted";
          kelasAvatar += " avatar-accent";
        }
        aksiHtml =
          '<button type="button" class="btn btn-primary btn-selesai-sesi" data-agenda-id="' + item.id + '">' +
          "✓ Selesaikan Sesi" +
          "</button>";
      }

      html +=
        '<article class="' + kelasKartu + '">' +
        '  <div class="agenda-student">' +
        '    <div class="' + kelasAvatar + '" aria-hidden="true">' + item.inisial + "</div>" +
        "    <div>" +
        '      <h2 class="card-title">' + item.nama + "</h2>" +
        '      <div class="agenda-meta mono">' +
        "        <span>NIM: " + item.nim + "</span>" +
        "        <span>·</span>" +
        "        <span>" + item.jam + "</span>" +
        "        <span>·</span>" +
        "        <span>" + item.tipe + "</span>" +
        "      </div>" +
        "    </div>" +
        "  </div>" +
        "  " + aksiHtml +
        "</article>";
    }

    list.innerHTML = html;

    // Event klik tombol "Selesaikan Sesi" pada tiap kartu mahasiswa
    var semuaBtnSelesai = list.querySelectorAll(".btn-selesai-sesi");
    for (var b = 0; b < semuaBtnSelesai.length; b++) {
      semuaBtnSelesai[b].addEventListener("click", function () {
        var idTarget = this.getAttribute("data-agenda-id");
        for (var idx = 0; idx < state.agenda.length; idx++) {
          if (state.agenda[idx].id === idTarget) {
            state.agenda[idx].status = "selesai";

            // Sinkronisasi ke tiket mahasiswa Yahya jika sesi Yahya diselesaikan
            if (state.agenda[idx].nim === "24060124120001" && state.tiketAktif) {
              state.tiketAktif.status = "selesai";
              state.notifikasi.unshift({
                judul: "Sesi bimbingan selesai",
                isi: "Dr. Arif Wicaksono telah menandai sesi bimbingan Anda selesai.",
                waktu: "Baru saja",
                darurat: false
              });
            }

            simpanState(state);
            renderAgenda();
            tampilkanToast("Sesi " + state.agenda[idx].nama + " ditandai selesai.");
            break;
          }
        }
      });
    }
  }

  function bukaModal() {
    if (!modal || hitungSesiAktif() === 0) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    if (btnCancelModal) btnCancelModal.focus();
  }

  function tutupModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    if (btnOpenModal) btnOpenModal.focus();
  }

  if (btnOpenModal) {
    btnOpenModal.addEventListener("click", bukaModal);
  }
  if (btnCloseModal) {
    btnCloseModal.addEventListener("click", tutupModal);
  }
  if (btnCancelModal) {
    btnCancelModal.addEventListener("click", tutupModal);
  }

  // Tutup modal saat klik area gelap di luar dialog
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) tutupModal();
    });
  }

  // Easy Exit: tutup modal dengan tombol Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal && modal.classList.contains("is-open")) {
      tutupModal();
    }
  });

  // Konfirmasi pembatalan darurat semua sesi aktif
  if (btnConfirmEmergency) {
    btnConfirmEmergency.addEventListener("click", function () {
      var jumlahDibatalkan = 0;
      for (var i = 0; i < state.agenda.length; i++) {
        if (state.agenda[i].status === "aktif") {
          state.agenda[i].status = "dibatalkan";
          jumlahDibatalkan += 1;
        }
      }

      if (jumlahDibatalkan > 0) {
        if (state.tiketAktif && state.tiketAktif.status === "terkonfirmasi") {
          state.tiketAktif.status = "dibatalkan";
        }
        state.notifikasi.unshift({
          judul: "Pembatalan Darurat oleh DPA",
          isi: "Dr. Arif Wicaksono membatalkan seluruh sesi aktif hari ini (Senin, 16 Nov 2026) karena berhalangan hadir mendadak. Silakan pilih jadwal lain.",
          waktu: "Baru saja",
          darurat: true
        });
        simpanState(state);
      }

      tutupModal();
      renderAgenda();
      tampilkanToast(jumlahDibatalkan + " sesi aktif dibatalkan & notifikasi dikirim ke mahasiswa.");
    });
  }

  // Tombol pulihkan data demo agar mudah diuji ulang
  if (btnRestoreDemo) {
    btnRestoreDemo.addEventListener("click", function () {
      state = resetDataDemo();
      renderAgenda();
      tampilkanToast("Data agenda & mahasiswa dipulihkan ke kondisi awal.");
    });
  }

  renderAgenda();
}

// ==========================================================================
// 7. INISIALISASI HALAMAN (DOMContentLoaded)
// ==========================================================================
document.addEventListener("DOMContentLoaded", function () {
  var halaman = document.body.getAttribute("data-page");

  if (halaman === "beranda") {
    initBeranda();
  } else if (halaman === "cari-jadwal") {
    initCariJadwal();
  } else if (halaman === "tiket") {
    initTiket();
  } else if (halaman === "atur-jadwal") {
    initAturJadwal();
  } else if (halaman === "agenda") {
    initAgenda();
  }
});
