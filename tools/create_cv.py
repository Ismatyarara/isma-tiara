from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, KeepTogether

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "documents"
OUT.mkdir(parents=True, exist_ok=True)

NAVY = colors.HexColor("#18214D")
VIOLET = colors.HexColor("#624CC8")
MUTED = colors.HexColor("#59637E")
LINE = colors.HexColor("#E4E7EE")

def styles():
    base = getSampleStyleSheet()
    return {
        "name": ParagraphStyle("name", parent=base["Normal"], fontName="Helvetica-Bold", fontSize=22, leading=25, textColor=NAVY, spaceAfter=4),
        "contact": ParagraphStyle("contact", parent=base["Normal"], fontName="Helvetica", fontSize=8.7, leading=12, textColor=MUTED, spaceAfter=12),
        "section": ParagraphStyle("section", parent=base["Normal"], fontName="Helvetica-Bold", fontSize=9.6, leading=12, textColor=VIOLET, spaceBefore=8, spaceAfter=4, borderWidth=0),
        "role": ParagraphStyle("role", parent=base["Normal"], fontName="Helvetica-Bold", fontSize=10.2, leading=13, textColor=NAVY),
        "meta": ParagraphStyle("meta", parent=base["Normal"], fontName="Helvetica", fontSize=8.5, leading=11, textColor=MUTED, spaceAfter=3),
        "body": ParagraphStyle("body", parent=base["Normal"], fontName="Helvetica", fontSize=8.7, leading=12, textColor=colors.HexColor("#303A55"), spaceAfter=4),
        "bullet": ParagraphStyle("bullet", parent=base["Normal"], fontName="Helvetica", fontSize=8.55, leading=11.4, leftIndent=10, firstLineIndent=-7, textColor=colors.HexColor("#303A55"), spaceAfter=2),
    }

def bullet(text, s): return Paragraph("• " + text, s["bullet"])
def section(title, s): return Paragraph(title.upper(), s["section"])
def job(role, org, dates, bullets, s):
    return [Paragraph(role, s["role"]), Paragraph(f"{org} | {dates}", s["meta"]), *[bullet(x, s) for x in bullets], Spacer(1, 3)]

def make_cv(language, filename):
    s = styles()
    if language == "id":
        summary = "Lulusan SMK Assalaam Bandung jurusan Rekayasa Perangkat Lunak yang terbiasa menangani administrasi dan pengelolaan data. Memiliki pengalaman PKL dalam data entry dan pengecekan kesiapan komputer, aktif dalam organisasi sekolah, serta berpengalaman membantu usaha makanan dari distribusi hingga pelayanan pelanggan."
        entries = [
            ("Technical Support (Program Praktik Kerja Lapangan)", "UIN Sunan Gunung Djati Bandung (PTIPD)", "Sep 2025 - Nov 2025", ["Berkolaborasi mengembangkan sistem inventaris dan manajemen ruangan untuk mendukung pemantauan fasilitas kampus.", "Mengelola data entry, pembuatan akun mahasiswa baru, dan dokumentasi kegiatan divisi secara akurat.", "Melakukan pengecekan laboratorium komputer, dukungan teknis ujian berbasis ICT, serta dokumentasi pelaksanaan ujian.", "Berkoordinasi dengan bagian umum untuk pengambilan alat kerja dan kelancaran operasional harian."]),
            ("Staf Penjualan dan Distribusi", "Usaha Kue dan Roti", "Agustus 2026 - Sekarang", ["Menjual serta mendistribusikan kue dan roti melalui stan dan titip jual ke kantin lima sekolah.", "Mengatur jadwal pengantaran agar produk sampai tepat waktu.", "Mencatat modal, pengeluaran, dan pemasukan secara rutin untuk memantau keuntungan.", "Melayani pelanggan langsung dan menjaga kualitas produk."]),
            ("Ketua Divisi Lingkungan Kesehatan", "OSIS SMK Assalaam Bandung", "Jul 2023 - Agu 2025", ["Merencanakan program kerja divisi, menyusun anggaran, dan mengoordinasikan pelaksanaan kegiatan.", "Mengatur pembagian tugas serta jadwal UKS, perpustakaan, dan piket ruang OSIS.", "Mengoordinasikan kerja sama antar divisi pada kegiatan sekolah serta menangani kebutuhan pertolongan pertama siswa."]),
        ]
        education = ["Kelas Industri bersama PT Dwi Purwa Teknologi.", "UKK: merancang aplikasi kesehatan HealTrack dengan manajemen jadwal dan pengingat minum obat.", "P5: pengabdian masyarakat, mengajar mengaji, dan perawatan fasilitas ibadah."]
        skills = "Administrasi dan Data: Microsoft Office (Excel, Word dasar), Google Workspace (Sheets, Docs), data entry, pengarsipan dokumen.<br/>Teknis dan Desain: technical support, troubleshooting hardware/software, MySQL, analisis sistem, basic UI/UX (Figma), Canva.<br/>Soft skills: adaptasi, manajemen waktu, komunikasi, kerja sama tim, problem solving, inisiatif, pelayanan pelanggan."
        section_names = ("Ringkasan", "Pengalaman", "Pendidikan", "Keahlian")
        school_name = "SMK Assalaam Bandung - Rekayasa Perangkat Lunak (RPL)"
    else:
        summary = "A Software Engineering graduate from SMK Assalaam Bandung with experience in administrative support and data management. Brings internship experience in data entry and computer-readiness checks, school-organization collaboration, and hands-on support for a food business from distribution to customer service."
        entries = [
            ("Technical Support Intern", "UIN Sunan Gunung Djati Bandung (PTIPD)", "Sep 2025 - Nov 2025", ["Collaborated on an inventory and room-management system to support campus facility monitoring.", "Handled accurate data entry, new-student account creation, and division activity documentation.", "Performed computer-lab checks, ICT-based exam technical support, and exam documentation.", "Coordinated office-equipment logistics with the general affairs team to support daily operations."]),
            ("Sales and Distribution Staff", "Cake and Bread Business", "Aug 2026 - Present", ["Sold and distributed cakes and bread through a booth and consignment to canteens at five schools.", "Managed delivery schedules to help ensure products arrived on time.", "Recorded capital, expenses, and income regularly to monitor profitability.", "Provided direct customer service and maintained product quality."]),
            ("Head of Health and Environment Division", "Student Council, SMK Assalaam Bandung", "Jul 2023 - Aug 2025", ["Planned division programs, prepared budgets, and coordinated activity delivery.", "Assigned team responsibilities and organized schedules for the school health unit, library, and student-council room.", "Coordinated cross-division collaboration for school events and supported first-aid response for students."]),
        ]
        education = ["Industry Class program with PT Dwi Purwa Teknologi.", "Competency Exam project: designed HealTrack, a health app with schedule management and medication reminders.", "P5 community project: supported Quran learning, maintained worship facilities, and engaged with local residents."]
        skills = "Administration and Data: Microsoft Office (basic Excel and Word), Google Workspace (Sheets and Docs), data entry, document filing.<br/>Technical and Design: technical support, hardware/software troubleshooting, MySQL, systems analysis, basic UI/UX design (Figma), Canva.<br/>Soft skills: adaptability, time management, communication, teamwork, problem solving, initiative, customer service."
        section_names = ("Profile", "Experience", "Education", "Skills")
        school_name = "SMK Assalaam Bandung - Software Engineering (RPL)"
    story = [Paragraph("ISMA TIARA ZALIANTI", s["name"]), Paragraph("+62 812-9853-6421  |  ismatiarazalianti32@gmail.com  |  Kabupaten Bandung, Jawa Barat<br/>GitHub: github.com/Ismatyarara  |  Portfolio: tiarafolioo.vercel.app", s["contact"]), section(section_names[0], s), Paragraph(summary, s["body"]), section(section_names[1], s)]
    for entry in entries:
        story += job(*entry, s)
    story += [section(section_names[2], s), Paragraph(school_name, s["role"]), Paragraph("Jul 2023 - May 2026", s["meta"]), *[bullet(x, s) for x in education], section(section_names[3], s), Paragraph(skills, s["body"])]
    doc = SimpleDocTemplate(str(OUT / filename), pagesize=A4, leftMargin=18*mm, rightMargin=18*mm, topMargin=15*mm, bottomMargin=15*mm, title="Isma Tiara Zalianti CV")
    doc.build(story)

make_cv("id", "CV_Isma_Tiara_Zalianti_ID.pdf")
make_cv("en", "CV_Isma_Tiara_Zalianti_EN.pdf")
