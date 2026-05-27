import galeryImage1 from './src/assets/images/20260321_12_ninetysix_kdr.jpg';
import galeryImage2 from './src/assets/images/20260117_26_ninetysix_kdr.jpg';
import galeryImage3 from './src/assets/images/20260321_8_ninetysix_kdr.jpg';
import galeryImage4 from './src/assets/images/20260321_5_ninetysix_kdr.jpg';
import galeryImage5 from './src/assets/images/20260117_1_ninetysix_kdr.jpg';
import galeryImage6 from './src/assets/images/20260321_3_ninetysix_kdr.jpg';

export default {
//   inviteeName: "Siti Setiawati",
  inviteeName: "Bapak/Ibu/Saudara/i",
  couple: {
    groomName: "Abdul Rahman Jaelani",
    brideName: "Siti Setiawati",
    groomParents: "Bpk. Ase Mulyadi & Ibu Mumu Mulyati",
    brideParents: "Bpk. Uu Rukmana & Ibu Nunung"
  },
  event: {
    akadDate: "2027-12-11",
    receptionDate: "2027-12-11T11:00:00",
    venue: "The Garden Hall Jakarta",
    venueAddress: "Jl. Melati Indah No. 18, Jakarta Selatan, DKI Jakarta",
    mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d895.7693009514347!2d107.9285922516075!3d-7.076136337691112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zN8KwMDQnMjUuMSJTIDEwN8KwNTUnNDIuNyJF!5e1!3m2!1sid!2sid!4v1779855470345!5m2!1sid!2sid"
  },
  content: {
    openingQuote: "Dan di antara tanda-tanda kebesaran-Nya, Dia menciptakan untukmu pasangan hidup agar kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.",
    invitationText: "Dengan penuh rasa syukur, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada hari bahagia pernikahan kami. Kehadiran dan doa baik Anda akan menjadi kebahagiaan yang tak ternilai bagi keluarga kami.",
    closingMessage: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk menyempurnakan sukacita di hari istimewa kami."
  },
  gallery: [
    galeryImage1,
    galeryImage2,
    galeryImage3,
    galeryImage4,
    galeryImage5,
    galeryImage6
  ],
  rsvp: {
    googleScriptUrl: "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec",
    sheetColumns: ["Nama", "Kehadiran", "Pesan"]
  },
  donation: {
    title: "Hadiah Pernikahan",
    description: "Doa restu Anda adalah hadiah paling berharga bagi kami. Jika ingin memberikan tanda kasih, kami sediakan beberapa metode berikut dengan penuh terima kasih.",
    methods: [
      {
        type: "bank",
        provider: "BCA",
        accountNumber: "1234567890",
        accountName: "Raka Aditya Pratama",
        qrisImageUrl: null
      },
      {
        type: "bank",
        provider: "Mandiri",
        accountNumber: "9876543210",
        accountName: "Kiara Putri Anindita",
        qrisImageUrl: null
      },
      {
        type: "ewallet",
        provider: "GoPay",
        accountNumber: "081234567890",
        accountName: "Raka Aditya Pratama",
        qrisImageUrl: null
      },
      {
        type: "qris",
        provider: "QRIS",
        accountNumber: "-",
        accountName: "Raka Aditya Pratama",
        qrisImageUrl: "https://images.unsplash.com/photo-1556742205-9c8c801f34b7?auto=format&fit=crop&w=1200&q=80"
      }
    ]
  }
}
