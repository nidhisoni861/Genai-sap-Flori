// TravelOrder AI: final exam presentation (orange and white)
const pptxgen = require('pptxgenjs');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const sharp = require('sharp');
const fa = require('react-icons/fa');
const path = require('path');
const { applyTheme } = require(process.env.SKILL + '/scripts/apply_theme.js');

const OUT = process.argv[2] || path.join(process.env.HOME, 'Downloads/TravelOrder-AI-Presentation.pptx');

const HEX = {
  orange: 'EA580C', deep: '9A3412', soft: 'FFEDD5', tint: 'FFF7ED', text: '1F2937', grey: '6B7280', white: 'FFFFFF', line: 'FED7AA',
};
const THEME = {
  name: 'TravelOrder Orange',
  headFontFace: 'Arial', bodyFontFace: 'Arial',
  colors: {
    dk1: HEX.text, lt1: HEX.white, dk2: HEX.deep, lt2: HEX.tint,
    accent1: HEX.orange, accent2: HEX.deep, accent3: 'FDBA74', accent4: '7C2D12', accent5: HEX.grey, accent6: HEX.soft,
    hlink: HEX.orange, folHlink: HEX.deep,
  },
};

async function icon(Comp, color, size = 256) {
  const svg = renderToStaticMarkup(React.createElement(Comp, { color: '#' + color, size }));
  const png = await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
  return 'image/png;base64,' + png.toString('base64');
}

(async () => {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5 in
  pres.title = 'TravelOrder AI';
  pres.author = 'Nidhi Soni, Aathrav Kuchuge';
  pres.subject = 'GenAI and SAP Fiori: Final Exam Projects';
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  const C = pres.SchemeColor;
  const W = 13.333;

  // ---------- layouts ----------
  pres.defineSlideMaster({
    title: 'Orange Cover',
    background: { color: C.accent1 },
    objects: [
      { placeholder: { options: { name: 'title', type: 'title', x: 0.8, y: 2.0, w: 11.7, h: 1.4, fontSize: 54, bold: true, color: C.background1, align: 'left', valign: 'bottom', margin: 0 }, text: '' } },
      { placeholder: { options: { name: 'body', type: 'body', x: 0.8, y: 3.5, w: 11.7, h: 0.9, fontSize: 24, color: C.background1, align: 'left', valign: 'top', margin: 0 }, text: '' } },
    ],
  });
  pres.defineSlideMaster({
    title: 'Content',
    background: { color: C.background1 },
    margin: [0.5, 0.6, 0.6, 0.6],
    objects: [
      { placeholder: { options: { name: 'title', type: 'title', x: 0.6, y: 0.35, w: 12.1, h: 0.75, fontSize: 32, bold: true, color: C.accent2, align: 'left', valign: 'middle', margin: 0 }, text: '' } },
      { placeholder: { options: { name: 'body', type: 'body', x: 0.6, y: 1.1, w: 12.1, h: 0.45, fontSize: 16, color: C.accent5, align: 'left', valign: 'top', margin: 0 }, text: '' } },
      { text: { text: 'TravelOrder AI  ·  GenAI and SAP Fiori  ·  SRH University', options: { x: 0.6, y: 7.0, w: 8, h: 0.3, fontSize: 10, color: C.accent5, margin: 0 } } },
    ],
    slideNumber: { x: 12.2, y: 7.0, w: 0.5, h: 0.3, fontSize: 10, color: C.accent5, align: 'right' },
  });

  const I = {
    mail: await icon(fa.FaEnvelopeOpenText, HEX.white), keyboard: await icon(fa.FaKeyboard, HEX.white),
    file: await icon(fa.FaFileInvoiceDollar, HEX.white), eye: await icon(fa.FaEyeSlash, HEX.white),
    undo: await icon(fa.FaUndoAlt, HEX.white), robot: await icon(fa.FaRobot, HEX.white),
    inbox: await icon(fa.FaInbox, HEX.white), chart: await icon(fa.FaChartBar, HEX.white),
    plane: await icon(fa.FaPlaneDeparture, HEX.white), cloud: await icon(fa.FaCloud, HEX.white),
    check: await icon(fa.FaCheckCircle, HEX.white), user: await icon(fa.FaUserTie, HEX.white),
    bulb: await icon(fa.FaLightbulb, HEX.white), shield: await icon(fa.FaShieldAlt, HEX.white),
    magic: await icon(fa.FaMagic, HEX.white), code: await icon(fa.FaCode, HEX.white),
    target: await icon(fa.FaBullseye, HEX.orange), arrow: await icon(fa.FaArrowRight, HEX.orange),
    planeW: await icon(fa.FaPlaneDeparture, HEX.white), uni: await icon(fa.FaUniversity, HEX.white),
  };

  // orange circle with white icon (the deck's motif)
  const circle = (s, img, x, y, d = 0.7, name = 'icon') => {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: C.accent1 }, line: { color: C.accent1 }, objectName: name + ' circle' });
    const pad = d * 0.25;
    s.addImage({ data: img, x: x + pad, y: y + pad, w: d - 2 * pad, h: d - 2 * pad, altText: name, objectName: name });
  };
  const card = (s, x, y, w, h, name, fill = C.accent6) =>
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.12, fill: { color: fill }, line: { color: fill }, objectName: name });
  const txt = (s, text, o) => s.addText(text, { isTextBox: true, margin: 0, valign: 'top', fontSize: 14, color: C.text1, ...o });
  const content = (title, sub, section) => {
    const s = pres.addSlide({ masterName: 'Content', sectionTitle: section });
    s.addText(title, { placeholder: 'title' });
    s.addText(sub, { placeholder: 'body' });
    return s;
  };
  const bullets = items => items.map((t, k) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: k < items.length - 1, paraSpaceAfter: 4 } }));
  // GenAI strip used on every project slide
  const genaiBox = (s, y, lines) => {
    card(s, 0.6, y, 12.1, 1.3, 'GenAI box', C.accent1);
    s.addImage({ data: I.magic, x: 0.85, y: y + 0.4, w: 0.5, h: 0.5, altText: 'Generative AI', objectName: 'GenAI icon' });
    txt(s, 'How Generative AI helped', { x: 1.6, y: y + 0.14, w: 3, h: 0.35, fontSize: 15, bold: true, color: C.background1 });
    txt(s, lines.map((l, k) => [{ text: l[0] + ' ', options: { bold: true } }, { text: l[1], options: { breakLine: k < lines.length - 1 } }]).flat(),
      { x: 1.6, y: y + 0.52, w: 10.9, h: 0.7, fontSize: 13, color: C.background1, paraSpaceAfter: 3 });
  };

  // ---------- 1 Title ----------
  pres.addSection({ title: 'Introduction' });
  let s = pres.addSlide({ masterName: 'Orange Cover', sectionTitle: 'Introduction' });
  s.addImage({ data: I.planeW, x: 0.8, y: 1.0, w: 0.8, h: 0.8, altText: 'Travel', objectName: 'Plane icon' });
  s.addText('TravelOrder AI', { placeholder: 'title' });
  s.addText('AI-assisted sales order processing for travel bookings in SAP', { placeholder: 'body' });
  card(s, 0.8, 4.75, 11.7, 1.75, 'Info panel', C.background1);
  txt(s, 'TEAM', { x: 1.2, y: 5.0, w: 3.5, h: 0.3, fontSize: 12, bold: true, color: C.accent1, charSpacing: 2 });
  txt(s, [{ text: 'Nidhi Soni', options: { breakLine: true } }, { text: 'Aathrav Kuchuge' }], { x: 1.2, y: 5.35, w: 3.6, h: 0.9, fontSize: 20, bold: true, color: C.text1 });
  txt(s, 'SUBJECT', { x: 5.0, y: 5.0, w: 3.5, h: 0.3, fontSize: 12, bold: true, color: C.accent1, charSpacing: 2 });
  txt(s, [{ text: 'GenAI and SAP Fiori', options: { breakLine: true, bold: true } }, { text: 'Final Exam Projects 1 to 4', options: { color: C.accent5 } }], { x: 5.0, y: 5.35, w: 3.8, h: 0.9, fontSize: 20, color: C.text1 });
  txt(s, 'UNIVERSITY', { x: 9.1, y: 5.0, w: 3.2, h: 0.3, fontSize: 12, bold: true, color: C.accent1, charSpacing: 2 });
  txt(s, [{ text: 'SRH University', options: { breakLine: true, bold: true } }, { text: 'November 2026', options: { color: C.accent5 } }], { x: 9.1, y: 5.35, w: 3.2, h: 0.9, fontSize: 20, color: C.text1 });
  s.addNotes('Welcome. We are Nidhi Soni and Aathrav Kuchuge. Our project is TravelOrder AI: four SAP projects that together support one travel booking, from the first customer message to the refund after a cancellation. We will show the problem, the system overview, each project with how Generative AI helped, and a live demo.');

  // ---------- 2 Problem ----------
  s = content('The problem: travel bookings are handled by hand', 'A travel agency receives booking requests by email. Every step after that is manual work.', 'Introduction');
  const pains = [
    [I.mail, 'Emails read by hand', 'Staff read every customer email and pick out destination, dates, travellers and budget.'],
    [I.keyboard, 'Missing data found too late', 'Data is typed into SAP manually; missing return dates or budgets are noticed only later.'],
    [I.file, 'Sales orders created manually', 'Each approved trip must be entered as a sales order in SAP S/4HANA.'],
    [I.eye, 'No view of urgent trips', 'Unpaid trips that depart soon or customers with health needs are easy to overlook.'],
    [I.undo, 'Refunds calculated by hand', 'Date changes, cancellations and refund rules are applied by hand, with approval rules.'],
  ];
  pains.forEach(([img, h, d], k) => {
    const y = 1.75 + k * 1.0;
    circle(s, img, 0.6, y, 0.7, h);
    txt(s, h, { x: 1.55, y: y + 0.0, w: 6.2, h: 0.35, fontSize: 17, bold: true });
    txt(s, d, { x: 1.55, y: y + 0.36, w: 6.2, h: 0.55, fontSize: 14, color: C.accent5 });
  });
  card(s, 8.3, 1.75, 4.4, 4.85, 'Goal card', C.accent6);
  s.addImage({ data: I.target, x: 8.65, y: 2.05, w: 0.6, h: 0.6, altText: 'Goal', objectName: 'Goal icon' });
  txt(s, 'Our goal', { x: 8.65, y: 2.8, w: 3.8, h: 0.45, fontSize: 22, bold: true, color: C.accent2 });
  txt(s, 'Support one trip from the first message to the refund with SAP and Generative AI.', { x: 8.65, y: 3.3, w: 3.75, h: 1.2, fontSize: 17 });
  txt(s, bullets(['AI reads, summarises and suggests', 'Fixed rules decide what is missing, urgent or refunded', 'A person approves every order and refund']),
    { x: 8.65, y: 4.6, w: 3.75, h: 1.8, fontSize: 14, color: C.text1 });
  s.addNotes('Today a travel agency does everything by hand: reading emails, typing data into SAP, creating the sales order in S/4HANA, watching payments and departure dates, and calculating refunds. This is slow, error-prone and hard to prioritise. Our goal: support the whole life of one trip with SAP and Generative AI, while fixed rules and people keep the final decisions.');

  // ---------- 3 System overview ----------
  s = content('System overview: four connected SAP apps, one trip', 'A trip typed once in the Assistant travels through all apps under the same booking number.', 'Introduction');
  const flow = [
    [I.robot, 'Project 1', 'Assistant', 'Joule agent + 2 skills checks the request'],
    [I.inbox, 'Project 2', 'Intake', 'AI reads the email, sales order in S/4HANA'],
    [I.chart, 'Project 3', 'Overview', 'Payments, AI summary, priority, tips'],
    [I.plane, 'Project 4', 'After-Booking', 'Change, cancel, refund, manager approval'],
  ];
  flow.forEach(([img, p, n, d], k) => {
    const x = 0.6 + k * 3.15;
    card(s, x, 1.8, 2.65, 2.6, n + ' card');
    circle(s, img, x + 0.25, 2.05, 0.75, n);
    txt(s, p.toUpperCase(), { x: x + 0.25, y: 2.95, w: 2.2, h: 0.3, fontSize: 11, bold: true, color: C.accent1, charSpacing: 1 });
    txt(s, n, { x: x + 0.25, y: 3.25, w: 2.2, h: 0.4, fontSize: 20, bold: true });
    txt(s, d, { x: x + 0.25, y: 3.68, w: 2.2, h: 0.65, fontSize: 13, color: C.accent5 });
    if (k < 3) s.addImage({ data: I.arrow, x: x + 2.75, y: 2.9, w: 0.3, h: 0.3, altText: 'then', objectName: 'Arrow ' + (k + 1) });
  });
  txt(s, 'SAP technology', { x: 0.6, y: 4.75, w: 6, h: 0.35, fontSize: 16, bold: true, color: C.accent2 });
  txt(s, bullets(['SAP BTP Cloud Foundry, SAP HANA Cloud', 'SAP CAP (Node.js), OData V4, SAP Fiori elements', 'XSUAA login and roles, App Router, MTA deployment', 'SAP Build Joule Studio; S/4HANA Sales Order API (simulated)']),
    { x: 0.6, y: 5.15, w: 6.0, h: 1.7, fontSize: 14 });
  txt(s, 'Generative AI tools', { x: 6.95, y: 4.75, w: 5.7, h: 0.35, fontSize: 16, bold: true, color: C.accent2 });
  txt(s, bullets(['SAP Project Accelerator: generated the P2 Fiori/CAP app', 'SAP Build Joule Studio: agent and skills (P1)', 'OpenAI gpt-4o-mini: AI features inside the apps', 'Claude Code: coding assistant for logic, integration, fixes']),
    { x: 6.95, y: 5.15, w: 5.75, h: 1.7, fontSize: 14 });
  s.addNotes('The four projects form one process. The Assistant checks a request and sends it to Intake. Intake uses AI to read the email; after a person approves, the sales order is created in S/4HANA, and the trip is forwarded to Overview and After-Booking under the same number TO-<sales order>. Everything runs on SAP BTP with HANA Cloud, CAP and Fiori elements, protected by XSUAA. S/4HANA is simulated in the official API format, agreed with the professor. GenAI tools: Project Accelerator, Joule Studio, OpenAI at runtime and Claude Code as coding assistant.');

  // ---------- 4 Project 1 ----------
  pres.addSection({ title: 'Projects' });
  s = content('Project 1: Joule Skills and AI Agent', 'TravelOrder Assistant: staff ask in normal language, the agent picks the right skill and explains the answer.', 'Projects');
  txt(s, 'Multi-step agent workflow', { x: 0.6, y: 1.7, w: 5.6, h: 0.35, fontSize: 16, bold: true, color: C.accent2 });
  const steps1 = ['Staff type a question or a trip request', 'Agent chooses the skill and extracts the inputs', 'Skill applies the business rules', 'Agent explains each problem or the refund in plain words', 'Complete request: Send to Intake (P2)'];
  steps1.forEach((t, k) => {
    const y = 2.15 + k * 0.6;
    s.addShape(pres.shapes.OVAL, { x: 0.6, y, w: 0.45, h: 0.45, fill: { color: C.accent1 }, line: { color: C.accent1 }, objectName: 'Step ' + (k + 1) });
    txt(s, String(k + 1), { x: 0.6, y, w: 0.45, h: 0.45, fontSize: 14, bold: true, color: C.background1, align: 'center', valign: 'middle' });
    txt(s, t, { x: 1.25, y: y + 0.06, w: 5.0, h: 0.4, fontSize: 14 });
  });
  card(s, 6.6, 1.7, 2.95, 2.55, 'Skill 1 card');
  circle(s, I.check, 6.85, 1.9, 0.6, 'Check skill');
  txt(s, 'Skill: Check Booking Request', { x: 6.85, y: 2.6, w: 2.55, h: 0.6, fontSize: 15, bold: true });
  txt(s, '5 checks: departure date, return date, return after departure, travellers, budget.', { x: 6.85, y: 3.25, w: 2.55, h: 0.9, fontSize: 13, color: C.accent5 });
  card(s, 9.75, 1.7, 2.95, 2.55, 'Skill 2 card');
  circle(s, I.undo, 10.0, 1.9, 0.6, 'Refund skill');
  txt(s, 'Skill: Calculate Refund', { x: 10.0, y: 2.6, w: 2.55, h: 0.6, fontSize: 15, bold: true });
  txt(s, '90 % / 50 % / 0 % by days before departure. Manager above 1,000 EUR.', { x: 10.0, y: 3.25, w: 2.55, h: 0.9, fontSize: 13, color: C.accent5 });
  txt(s, [{ text: 'Status: ', options: { bold: true, color: C.accent2 } }, { text: 'built and released 1.0.0 in SAP Build Joule Studio. Students cannot deploy (no shared environment), so we demo a local copy with the same skills.' }],
    { x: 6.6, y: 4.4, w: 6.1, h: 0.8, fontSize: 13 });
  genaiBox(s, 5.5, [
    ['Tools:', 'Joule Studio (skills and agent configured by us), OpenAI for the local copy, Claude Code wrote it.'],
    ['We fixed:', 'text-only inputs, misread true/false values, invented "0 days". 7/7 rule checks, 11/11 agent runs.'],
  ]);
  s.addNotes('Project 1 is a Joule agent with two skills. Check Booking Request returns five true/false checks; Calculate Refund returns the refund rule. The agent picks the skill, calculates the amount and explains problems in plain words. In Joule Studio nothing was generated automatically; we configured the skills ourselves. Problems: Joule tools only accept text inputs (we used StringToNumber), formulas have no IF (so five true/false outputs). The project is released as 1.0.0 but cannot be deployed by students, which the professor confirmed. For the demo we use a local copy with the same instructions and rules. DEMO: type "Test 4" to show missing data, then a complete trip and Send to Intake.');

  // ---------- 5 Project 2 ----------
  s = content('Project 2: SAP S/4HANA and Generative AI', 'TravelOrder Intake: AI reads the email, rules check, a person approves, SAP creates the sales order.', 'Projects');
  const flow2 = [['Customer email', I.mail], ['Read with AI', I.magic], ['Rule checks', I.check], ['Person approves', I.user], ['S/4HANA sales order', I.file]];
  flow2.forEach(([t, img], k) => {
    const x = 0.6 + k * 2.45;
    circle(s, img, x + 0.6, 1.75, 0.75, t);
    txt(s, t, { x, y: 2.6, w: 1.95, h: 0.4, fontSize: 14, bold: true, align: 'center' });
    if (k < 4) s.addImage({ data: I.arrow, x: x + 1.95, y: 1.97, w: 0.3, h: 0.3, altText: 'then', objectName: 'Flow arrow ' + (k + 1) });
  });
  card(s, 0.6, 3.15, 3.85, 2.05, 'AC1 card');
  txt(s, 'Project Accelerator (AC 1)', { x: 0.85, y: 3.3, w: 3.4, h: 0.4, fontSize: 15, bold: true, color: C.accent2 });
  txt(s, bullets(['Generated CAP project, data model, OData service, Fiori app, sample data', 'We fixed sample data and text fields']),
    { x: 0.85, y: 3.72, w: 3.4, h: 1.4, fontSize: 13 });
  card(s, 4.72, 3.15, 3.85, 2.05, 'AC2 card');
  txt(s, 'GenAI in the process (AC 2)', { x: 4.97, y: 3.3, w: 3.4, h: 0.4, fontSize: 15, bold: true, color: C.accent2 });
  txt(s, bullets(['OpenAI extracts trip data in a strict JSON format', 'Email is untrusted: prompt injection test passed']),
    { x: 4.97, y: 3.72, w: 3.4, h: 1.4, fontSize: 13 });
  card(s, 8.85, 3.15, 3.85, 2.05, 'S4 card');
  txt(s, 'SAP S/4HANA (simulated)', { x: 9.1, y: 3.3, w: 3.4, h: 0.4, fontSize: 15, bold: true, color: C.accent2 });
  txt(s, bullets(['Official API_SALES_ORDER_SRV format, checks like SAP', 'Switches to a real S/4HANA when connected']),
    { x: 9.1, y: 3.72, w: 3.4, h: 1.4, fontSize: 13 });
  genaiBox(s, 5.5, [
    ['Tools:', 'Project Accelerator (app skeleton), OpenAI (reads emails), Claude Code (logic and S/4HANA link).'],
    ['Our decision:', 'code, not AI, decides what is missing. A person always approves the order.'],
  ]);
  s.addNotes('Project 2 is the intelligent S/4HANA process. Acceptance criterion 1: we generated the app with Project Accelerator from our business-requirements prompt; it produced the data model, service, Fiori app and sample data, and we fixed misaligned sample data and text lengths. Acceptance criterion 2: Read with AI sends the email to OpenAI with a strict JSON schema; the email is treated as untrusted. Then our rule checks decide what is missing; a person approves, and the sales order is created through the SAP Sales Order API format in our mock S/4HANA, approved by the professor. DEMO: open the BRQ request, Read with AI, Approve, show the sales order number.');

  // ---------- 6 Project 3 ----------
  s = content('Project 3: SAP Fiori App with Generative AI', 'Bookings Overview: one screen that shows which trips need attention, with AI insights and payments.', 'Projects');
  card(s, 0.6, 1.7, 3.85, 3.5, 'AI card');
  circle(s, I.magic, 0.85, 1.9, 0.6, 'AI insights');
  txt(s, 'Generate AI Insights', { x: 0.85, y: 2.6, w: 3.4, h: 0.4, fontSize: 16, bold: true });
  txt(s, bullets(['Short summary for staff', 'Alert: what staff must do', 'Sorts customer notes: health, visa, other', '4 to 5 places to visit and hotels that fit the budget (no prices)']),
    { x: 0.85, y: 3.05, w: 3.4, h: 2.05, fontSize: 13 });
  card(s, 4.72, 1.7, 3.85, 3.5, 'Priority card');
  circle(s, I.shield, 4.97, 1.9, 0.6, 'Priority rules');
  txt(s, 'Priority set by fixed rules', { x: 4.97, y: 2.6, w: 3.4, h: 0.4, fontSize: 16, bold: true });
  txt(s, bullets(['Unpaid and departs within 30 days: High', 'Health or accessibility need: High', 'Visa question or open payment: Medium', 'First AI version rated a nut allergy Medium, so we changed it']),
    { x: 4.97, y: 3.05, w: 3.4, h: 2.05, fontSize: 13 });
  card(s, 8.85, 1.7, 3.85, 3.5, 'Payment card');
  circle(s, I.file, 9.1, 1.9, 0.6, 'Payments');
  txt(s, 'Payments', { x: 9.1, y: 2.6, w: 3.4, h: 0.4, fontSize: 16, bold: true });
  txt(s, bullets(['Record Partial Payment (50 %) and Record Full Payment', 'Buttons active only when allowed; server checks the same rules', 'Added after our own test found no way to pay']),
    { x: 9.1, y: 3.05, w: 3.4, h: 2.05, fontSize: 13 });
  genaiBox(s, 5.5, [
    ['Development:', 'Project Accelerator failed 3 times; we reused its P2 template, Claude Code wrote model and service.'],
    ['Fiori elements:', 'screens come from annotations, no XML views or controllers. OpenAI writes insights live.'],
  ]);
  s.addNotes('Project 3 is a Fiori elements app on BTP. Generate AI Insights sends the booking facts and customer notes to OpenAI, which writes a summary, an alert, sorts the notes, and suggests places and hotels that fit the budget, labelled "please check before booking". The priority is set by fixed rules, because the first AI version gave a severe nut allergy only Medium. We added payment buttons after our own test. GenAI in development: Project Accelerator failed three times; we documented this and reused the template it generated in Project 2. DEMO: open the trip, Record Full Payment, Generate AI Insights.');

  // ---------- 7 Project 4 ----------
  s = content('Project 4: SAP Fiori App on SAP BTP', 'After-Booking: date changes, cancellations and refunds with exact rules and manager approval.', 'Projects');
  const stats = [['90 %', 'refund 30+ days before departure'], ['50 %', 'refund 14 to 29 days before'], ['0 %', 'refund under 14 days'], ['50 EUR', 'fee for a date change']];
  stats.forEach(([v, l], k) => {
    const x = 0.6 + k * 3.075;
    card(s, x, 1.7, 2.8, 1.65, 'Stat ' + v);
    txt(s, v, { x: x + 0.25, y: 1.82, w: 2.3, h: 0.8, fontSize: 40, bold: true, color: C.accent1 });
    txt(s, l, { x: x + 0.25, y: 2.65, w: 2.3, h: 0.6, fontSize: 13, color: C.accent5 });
  });
  circle(s, I.user, 0.6, 3.65, 0.65, 'Manager approval');
  txt(s, 'Manager approval', { x: 1.45, y: 3.65, w: 4.6, h: 0.35, fontSize: 16, bold: true });
  txt(s, 'Refunds above 1,000 EUR wait as "Cancellation Requested". Only the Manager role (XSUAA) can approve; others get 403.', { x: 1.45, y: 4.02, w: 4.7, h: 1.0, fontSize: 13, color: C.accent5 });
  circle(s, I.cloud, 6.55, 3.65, 0.65, 'BTP');
  txt(s, 'Built and deployed on SAP BTP', { x: 7.4, y: 3.65, w: 5.3, h: 0.35, fontSize: 16, bold: true });
  txt(s, 'CAP OData V4 service, Fiori elements, HANA Cloud, App Router, HTML5 repository, MTA. History of every action. 22 local and 13 live tests.', { x: 7.4, y: 4.02, w: 5.3, h: 1.0, fontSize: 13, color: C.accent5 });
  genaiBox(s, 5.5, [
    ['Tools:', 'Claude Code wrote service, refund rules, roles and deploy fixes; skeleton from the Accelerator app.'],
    ['Our design:', 'no AI inside this app on purpose, because money needs exact rules.'],
  ]);
  s.addNotes('Project 4 handles everything after booking. The rules: 90, 50 or 0 percent refund depending on days before departure, 50 EUR per date change, refunds over 1,000 EUR wait for a manager. Approve Refund needs the Manager role; without it the server answers 403. It runs on BTP with HANA Cloud, XSUAA, App Router and the HTML5 repository. We used Claude Code to build it but no AI inside the app, because refunds must be exact. DEMO: cancel the trip, show the refund and the manager approval, status Refunded.');

  // ---------- 8 Conclusion ----------
  pres.addSection({ title: 'Closing' });
  s = content('Conclusion', 'One connected travel process in SAP, built with Generative AI and controlled by us.', 'Closing');
  const concl = [
    [I.check, 'What we delivered', ['4 connected SAP apps, one trip from P1 to P4', 'Live on SAP BTP with HANA Cloud and login', 'Sales orders in S/4HANA API format (simulated)', 'All tests passed, incl. full end-to-end runs']],
    [I.bulb, 'How GenAI helped', ['Project Accelerator: app skeleton in minutes', 'OpenAI: reads emails, writes summaries and tips', 'Claude Code: logic, integration, error solving', 'Saved development time, explained SAP errors']],
    [I.shield, 'What we kept in our hands', ['Rules decide missing data, priority, refunds', 'A person approves every order and refund', 'Limits: mock S/4HANA, Joule not deployable', 'AI hotel names must be checked by staff']],
  ];
  concl.forEach(([img, h, items], k) => {
    const x = 0.6 + k * 4.12;
    card(s, x, 1.75, 3.85, 4.5, h + ' card');
    circle(s, img, x + 0.25, 1.95, 0.7, h);
    txt(s, h, { x: x + 0.25, y: 2.8, w: 3.4, h: 0.45, fontSize: 18, bold: true, color: C.accent2 });
    txt(s, bullets(items), { x: x + 0.25, y: 3.35, w: 3.4, h: 2.75, fontSize: 14, paraSpaceAfter: 8 });
  });
  s.addNotes('In conclusion: we delivered four connected SAP apps that support one trip end to end, live on SAP BTP. Generative AI saved development time and makes the process smarter, but it was only safe because rules decide the important things and a person approves orders and refunds. Limitations: S/4HANA is simulated, the Joule agent cannot be deployed by students, and AI hotel names must be checked. Next steps would be a real S/4HANA connection and deploying the Joule agent.');

  // ---------- 9 Thank you ----------
  s = pres.addSlide({ masterName: 'Orange Cover', sectionTitle: 'Closing' });
  s.addImage({ data: I.planeW, x: 0.8, y: 1.0, w: 0.8, h: 0.8, altText: 'Travel', objectName: 'Plane icon' });
  s.addText('Thank you', { placeholder: 'title' });
  s.addText('Questions?', { placeholder: 'body' });
  txt(s, [{ text: 'Nidhi Soni  ·  Aathrav Kuchuge', options: { breakLine: true, bold: true } }, { text: 'GenAI and SAP Fiori  ·  SRH University' }],
    { x: 0.8, y: 5.6, w: 11.7, h: 0.9, fontSize: 18, color: C.background1 });
  s.addNotes('Thank you for your attention. We are happy to answer your questions.');

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log('written', OUT);
})().catch(e => { console.error(e); process.exit(1); });
