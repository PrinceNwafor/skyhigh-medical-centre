# SkyHigh Medical Centre — Website

Marketing website for **SkyHigh Medical Centre**, a 24/7 multi-specialty hospital on
Adekunle Banjo Avenue, Magodo Phase 2, Lagos, Nigeria.

🌐 **Live site:** https://princenwafor.github.io/skyhigh-medical-centre/

## About the clinic

- **Address:** 5b, Adekunle Banjo Avenue, Magodo Phase 2, Lagos State
- **Phone:** 0810 099 6560 · 0802 727 0167
- **WhatsApp / Telemedicine:** 0808 974 9877
- **Email:** skyhighmedicalcentre0@gmail.com
- **Hours:** Open 24 hours, 7 days a week
- **Services:** 24/7 Emergency & Accident, Intensive Care (ICU), Dialysis Centre,
  Maternity & Antenatal, Obstetrics & Gynaecology, Paediatrics & Immunisation,
  General Surgery, Laboratory & Diagnostics, Telemedicine

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home — hero, services, doctors, stats, testimonials, HMOs, map |
| `about.html` | Story, mission & values, leadership |
| `services.html` | Full service catalogue |
| `doctors.html` | Specialist directory with search & filter |
| `book-appointment.html` | Multi-step online booking widget |
| `patient-resources.html` | HMOs, self-pay pricing, checklist, FAQ |
| `health-tips.html` | Health awareness campaigns & articles |
| `contact.html` | Contact form, details & Google Map |

## Tech

Static HTML, one CSS design system (`css/style.css`) and vanilla JavaScript
(`js/main.js`). No build step — open `index.html` in any browser or serve the
folder statically. Fonts: DM Sans + Inter. Brand colours sampled from the
SkyHigh logo (blue `#1577C2`, teal `#13B7A4`).

## Local preview

```bash
# from this folder
python -m http.server 8000
# then open http://localhost:8000
```
