# Questionnaire Specification — Inicijalni upitnik

## Intro Text (SR)
Pre svega, želim da ti se zahvalim što si izabrao/la mene kao svog mentora. Želim da znaš da ću se maksimalno potruditi da naša saradnja bude uspešna, ali pre svega, potrebno je da odgovoriš na nekoliko pitanja. Izdvoji vreme i budi potpuno iskren/a kako bih ti sastavio najbolji mogući plan.

## Fields

| # | Question (SR) | Input Type |
|---|--------------|------------|
| 1 | Kako ti izgleda tipičan dan? Kada ustaješ, kada odlaziš na posao, u koje vreme bi trenirao/la, kada ideš na spavanje? | textarea |
| 2 | Opiši što detaljnije kako se hraniš | textarea |
| 3 | Koji ti je primarni cilj u radu sa mnom: izgradnja mišićne mase, definicija, ispravljanje asimetrija, rešavanje zdravstvenih problema? | textarea (or multi-select + textarea) |
| 4 | Koliko si novca spreman/na da izdvojiš za hranu na nedeljnom nivou? | text |
| 5 | Da li si držao/la neke dijete i da li uzimaš neke suplemente? | textarea |
| 6 | Da li treniraš? Kako izgledaju tvoji treninzi? Ako ne, kada si poslednji put trenirao/la? | textarea |
| 7 | Koliko bi puta nedeljno trenirao/la? | number (or select: 1-7) |
| 8 | Koje si godište? | number |
| 9 | Koliko si visok/a? (cm) | number |
| 10 | Koliko si težak/teška? (kg) | number |
| 11 | Obim bicepsa (stegnuto) (cm) | number |
| 12 | Obim struka (oko pupka) (cm) | number |
| 13 | Obim kvadricepsa (sredina noge) (cm) | number |
| 14 | Obim gluteusa (cm) | number |
| 15 | Da li imaš ili si imao/la neke povrede ili zdravstvene probleme? | textarea |
| 16 | Piješ li neke lekove i u kojim dozama? | textarea |
| 17 | Umeš li da spremaš hranu? | select (Da/Ne/Delimično) |
| 18 | Koje namirnice ne voliš, a koje posebno voliš? | textarea |
| 19 | Da li si na neku alergičan/na? | textarea |
| 20 | Da li imaš smetnje ili nelagodnosti prilikom izvođenja nekih vežbi ili pokreta i da li ti neka vežba ne prija? | textarea |
| 21 | Pošalji tri slike: s prednje, zadnje i bočne strane | file upload (3 images) |
| 22 | Adresa e-pošte * | email (required) |
| 23 | Broj telefona * | phone with country code (default +381) |

## Notes
- Fields 8-14 (measurements) can be grouped in a single row/grid
- Photo upload note: "Fotografisaćeš se svake nedelje, jedan dan, neka to bude petak. Na osnovu slika i izveštaja koje popunjavaš, praviću izmene u tvom treningu i ishrani."
- All questions need trilingual versions (SR/EN/RU)
- Form requires auth (user must be logged in to submit)
- Submitted data stored as structured JSONB in `questionnaires` table
- Photos uploaded to Supabase Storage (questionnaire-photos bucket)
