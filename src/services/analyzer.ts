export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export type Signal = {
  label: string;
  detail: string;
  severity: "info" | "warning" | "danger";
  evidence?: string;
};

export type ExtractedContact = {
  type: "phone" | "email";
  label: string;
  value: string;
};

export type AnalysisResult = {
  id: string;
  riskLevel: RiskLevel;
  score: number;
  category: string;
  summary: string;
  signals: Signal[];
  links: string[];
  contacts: ExtractedContact[];
  recommendedActions: string[];
  responsePlan: string[];
  createdAt: string;
};

type Rule = {
  label: string;
  detail: string;
  severity: Signal["severity"];
  points: number;
  pattern: RegExp;
  evidence?: (message: string) => string | undefined;
};

const rules: Rule[] = [
  {
    label: "Urgency or threat",
    detail: "Scams often push immediate action so the user does not verify the request.",
    severity: "warning",
    points: 16,
    pattern: /\b(urgent|immediately|final notice|last chance|act now|within 24 hours|account locked|suspended|legal action|warrant|arrest)\b/i
  },
  {
    label: "Payment pressure",
    detail: "Requests for quick payment are a common sign of fraud.",
    severity: "danger",
    points: 22,
    pattern: /\b(gift card|wire transfer|western union|moneygram|zelle|cash app|venmo|paypal friends|crypto|bitcoin|usdt|voucher|reload card)\b/i
  },
  {
    label: "Credential request",
    detail: "Legitimate services rarely ask users to confirm passwords or MFA codes through a message.",
    severity: "danger",
    points: 24,
    pattern: /\b(password|passcode|verification code|mfa code|2fa code|otp|login details|confirm your account|verify your identity)\b/i
  },
  {
    label: "Prize or refund bait",
    detail: "Unexpected rewards, refunds, and winnings are often used to collect fees or personal data.",
    severity: "warning",
    points: 15,
    pattern: /\b(congratulations|winner|you won|prize|reward|refund approved|rebate|claim now|selected)\b/i
  },
  {
    label: "Delivery impersonation",
    detail: "Fake package notices commonly use small fees and tracking links to steal cards.",
    severity: "warning",
    points: 15,
    pattern: /\b(usps|ups|fedex|dhl|package|parcel|redelivery|delivery fee|customs fee|tracking)\b/i
  },
  {
    label: "Bank or payment impersonation",
    detail: "Financial impersonation messages often try to trigger panic around fraud or locked accounts.",
    severity: "danger",
    points: 18,
    pattern: /\b(bank|debit card|credit card|transaction declined|fraud alert|chase|wells fargo|bank of america|capital one|paypal|venmo|cash app)\b/i
  },
  {
    label: "Remote access request",
    detail: "Tech support scams often ask users to install apps or grant device access.",
    severity: "danger",
    points: 22,
    pattern: /\b(anydesk|teamviewer|remote access|screen share|install this app|support agent|security department)\b/i
  },
  {
    label: "Personal information request",
    detail: "Requests for SSN, date of birth, or card data should be verified through official channels.",
    severity: "danger",
    points: 20,
    pattern: /\b(ssn|social security|date of birth|dob|card number|cvv|routing number|account number|driver'?s license)\b/i
  },
  {
    label: "Recruiting or job bait",
    detail: "Fake jobs often promise easy money and move the conversation to payment or identity collection.",
    severity: "warning",
    points: 14,
    pattern: /\b(remote job|work from home|hiring immediately|interview on telegram|easy income|daily pay|personal assistant)\b/i
  },
  {
    label: "Unusual contact channel",
    detail: "Scammers often move victims away from the original platform to avoid moderation.",
    severity: "warning",
    points: 12,
    pattern: /\b(telegram|whatsapp|signal|google chat|text me only|do not call)\b/i
  },
  {
    label: "Marketplace pressure",
    detail: "Marketplace scams often ask for deposits, shipping workarounds, or communication away from the platform.",
    severity: "warning",
    points: 14,
    pattern: /\b(deposit|hold the item|shipping agent|courier will pick up|marketplace protection|zelle only|cashier'?s check)\b/i
  },
  {
    label: "Order or invoice bait",
    detail: "Fake invoices and order confirmations try to make users call a scam support number.",
    severity: "warning",
    points: 16,
    pattern: /\b(invoice|receipt|subscription renewed|order confirmation|charged|billing department|cancel this order)\b/i
  },
  {
    label: "Recovery scam language",
    detail: "Promises to recover lost crypto, bank funds, or social accounts often lead to more fees or identity theft.",
    severity: "danger",
    points: 20,
    pattern: /\b(recover your funds|asset recovery|wallet recovery|hacked account recovery|refund agent|chargeback specialist)\b/i
  },
  {
    label: "Romance or trust-building bait",
    detail: "Fraudsters may build urgency through personal trust, emergencies, or requests to keep the conversation private.",
    severity: "warning",
    points: 13,
    pattern: /\b(my love|sweetheart|emergency travel|military deployment|private conversation|do not tell anyone)\b/i
  }
];

const urlPattern = /\bhttps?:\/\/[^\s<>"')]+|\b(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s<>"')]+)?/gi;
const shortenerPattern = /\b(bit\.ly|tinyurl\.com|t\.co|goo\.gl|ow\.ly|is\.gd|buff\.ly|cutt\.ly|rebrand\.ly|shorturl\.at)\b/i;
const riskyTldPattern = /\.(zip|mov|top|xyz|click|quest|cam|monster|icu|tk|ml|ga|cf)(?:\/|\b)/i;
const phonePattern = /(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}\b/g;
const emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const obfuscatedLinkPattern = /\b(?:[a-z0-9-]+\s*(?:dot|\.)\s*)+[a-z]{2,}\b/i;
const lookalikePattern = /\b(?:paypaI|arnazon|rnicrosoft|appIe|usps-support|fedex-track|chase-secure)\b/i;
const brandDomains: Record<string, string[]> = {
  usps: ["usps.com"],
  ups: ["ups.com"],
  fedex: ["fedex.com"],
  dhl: ["dhl.com"],
  paypal: ["paypal.com"],
  venmo: ["venmo.com"],
  "cash app": ["cash.app", "squareup.com"],
  chase: ["chase.com"],
  "bank of america": ["bankofamerica.com"],
  "wells fargo": ["wellsfargo.com"],
  "capital one": ["capitalone.com"],
  amazon: ["amazon.com"]
};

export function analyzeMessage(message: string): AnalysisResult {
  const normalized = message.replace(/\s+/g, " ").trim();
  const links = extractLinks(normalized);
  const contacts = extractContacts(normalized);
  const signals: Signal[] = [];
  let score = 0;

  for (const rule of rules) {
    if (rule.pattern.test(normalized)) {
      score += rule.points;
      signals.push({
        label: rule.label,
        detail: rule.detail,
        severity: rule.severity,
        evidence: rule.evidence?.(normalized)
      });
    }
  }

  if (links.length > 0) {
    score += 12;
    signals.push({
      label: "Contains link",
      detail: "Do not use message links for account, payment, or delivery issues. Open the official app or type the official site yourself.",
      severity: "warning",
      evidence: links[0]
    });
  }

  if (contacts.length > 0) {
    score += Math.min(16, contacts.length * 8);
    signals.push({
      label: "Direct contact requested",
      detail: "Phone numbers or email addresses in unexpected messages can route you to the scammer instead of the real organization.",
      severity: "warning",
      evidence: contacts[0].value
    });
  }

  if (links.some((link) => shortenerPattern.test(link))) {
    score += 24;
    signals.push({
      label: "Shortened URL",
      detail: "Short links hide the final destination and are frequently used in phishing messages.",
      severity: "danger",
      evidence: links.find((link) => shortenerPattern.test(link))
    });
  }

  if (links.some((link) => riskyTldPattern.test(link))) {
    score += 14;
    signals.push({
      label: "Unusual domain ending",
      detail: "The link uses a domain ending that is common in low-trust or throwaway sites.",
      severity: "warning",
      evidence: links.find((link) => riskyTldPattern.test(link))
    });
  }

  if (obfuscatedLinkPattern.test(normalized) && links.length === 0) {
    score += 14;
    signals.push({
      label: "Obfuscated link",
      detail: "Spelling a website as words can bypass filters and make a destination harder to inspect.",
      severity: "warning"
    });
  }

  if (lookalikePattern.test(normalized)) {
    score += 18;
    signals.push({
      label: "Lookalike brand spelling",
      detail: "The message appears to use a brand-like spelling that can be confused with a trusted company.",
      severity: "danger",
      evidence: normalized.match(lookalikePattern)?.[0]
    });
  }

  const mismatch = findBrandMismatch(normalized, links);
  if (mismatch) {
    score += 22;
    signals.push({
      label: "Brand and domain mismatch",
      detail: `${mismatch.brand} is mentioned, but the visible link does not appear to use an official domain.`,
      severity: "danger",
      evidence: mismatch.link
    });
  }

  if (/\bkindly\b/i.test(normalized)) {
    score += 5;
    signals.push({
      label: "Formal pressure language",
      detail: "Overly formal wording is not proof of fraud, but it can appear in scripted scam messages.",
      severity: "info",
      evidence: "kindly"
    });
  }

  score = Math.max(0, Math.min(100, score));
  const riskLevel = getRiskLevel(score, signals);
  const category = getCategory(normalized, signals);

  return {
    id: createId(),
    riskLevel,
    score,
    category,
    summary: buildSummary(riskLevel, category, signals),
    signals: signals.length > 0 ? signals : [safeSignal()],
    links,
    contacts,
    recommendedActions: getRecommendedActions(riskLevel, category, links),
    responsePlan: getResponsePlan(riskLevel, category, links, contacts),
    createdAt: new Date().toISOString()
  };
}

function extractLinks(message: string): string[] {
  return Array.from(new Set(message.match(urlPattern) ?? [])).map((link) =>
    link.replace(/[.,;:!?]+$/, "")
  );
}

function extractContacts(message: string): ExtractedContact[] {
  const phones = Array.from(new Set(message.match(phonePattern) ?? [])).map((value) => ({
    type: "phone" as const,
    label: "Phone",
    value
  }));
  const emails = Array.from(new Set(message.match(emailPattern) ?? [])).map((value) => ({
    type: "email" as const,
    label: "Email",
    value
  }));

  return [...phones, ...emails].slice(0, 6);
}

function findBrandMismatch(message: string, links: string[]) {
  if (links.length === 0) {
    return null;
  }

  const lowerMessage = message.toLowerCase();
  for (const [brand, officialDomains] of Object.entries(brandDomains)) {
    if (!lowerMessage.includes(brand)) {
      continue;
    }

    const hasOfficialLink = links.some((link) =>
      officialDomains.some((domain) => link.toLowerCase().includes(domain))
    );

    if (!hasOfficialLink) {
      return { brand, link: links[0] };
    }
  }

  return null;
}

function getRiskLevel(score: number, signals: Signal[]): RiskLevel {
  if (score >= 75 || signals.filter((signal) => signal.severity === "danger").length >= 3) {
    return "Critical";
  }

  if (score >= 50) {
    return "High";
  }

  if (score >= 25) {
    return "Medium";
  }

  return "Low";
}

function getCategory(message: string, signals: Signal[]): string {
  const labels = signals.map((signal) => signal.label).join(" ").toLowerCase();

  if (/delivery|package|parcel|tracking|usps|ups|fedex|dhl/i.test(message)) {
    return "Delivery scam";
  }

  if (/bank|card|fraud|paypal|venmo|cash app|transaction/i.test(message)) {
    return "Banking or payment scam";
  }

  if (/job|hiring|interview|income|assistant/i.test(message)) {
    return "Job scam";
  }

  if (/remote access|support|anydesk|teamviewer/i.test(message)) {
    return "Tech support scam";
  }

  if (/invoice|subscription|order confirmation|charged|billing/i.test(message)) {
    return "Fake invoice or order scam";
  }

  if (/recover your funds|wallet recovery|asset recovery|chargeback/i.test(message)) {
    return "Recovery scam";
  }

  if (/deposit|shipping agent|courier|cashier'?s check|marketplace/i.test(message)) {
    return "Marketplace scam";
  }

  if (labels.includes("credential")) {
    return "Credential phishing";
  }

  return "General social engineering";
}

function buildSummary(riskLevel: RiskLevel, category: string, signals: Signal[]): string {
  if (riskLevel === "Low") {
    return "No major scam indicators were found, but verify requests through official channels before acting.";
  }

  const issueCount = signals.length;
  return `${riskLevel} risk ${category.toLowerCase()} pattern with ${issueCount} suspicious signal${
    issueCount === 1 ? "" : "s"
  }.`;
}

function getRecommendedActions(riskLevel: RiskLevel, category: string, links: string[]): string[] {
  const actions = [
    "Do not click links or call numbers from the message.",
    "Open the official app or type the known official website yourself.",
    "Do not share passwords, MFA codes, card details, SSN, or remote access."
  ];

  if (links.length > 0) {
    actions.push("If you already opened the link, change the affected password from a trusted device.");
  }

  if (category.includes("Banking") || riskLevel === "Critical") {
    actions.push("Contact the bank or service using the number printed on your card or the official website.");
  }

  if (category.includes("Delivery")) {
    actions.push("Check tracking only through the carrier's official website or app.");
  }

  if (category.includes("Job")) {
    actions.push("Verify the recruiter through the company's official careers page before sharing identity documents.");
  }

  if (category.includes("invoice") || category.includes("order")) {
    actions.push("Check the account from the official app before calling any number in the message.");
  }

  return actions;
}

function getResponsePlan(
  riskLevel: RiskLevel,
  category: string,
  links: string[],
  contacts: ExtractedContact[]
): string[] {
  const plan = ["Pause before replying, clicking, calling, or paying.", "Verify through a channel you already trust."];

  if (links.length > 0) {
    plan.push("Do not sign in from the message link. Open the official app or type the official website.");
  }

  if (contacts.length > 0) {
    plan.push("Do not call or email the contact listed in the message. Use a known number or official support page.");
  }

  if (riskLevel === "Critical" || riskLevel === "High") {
    plan.push("Save a screenshot and warn the person or account the message is pretending to be from.");
  }

  if (category.includes("Banking")) {
    plan.push("If money or card data was shared, contact the bank from the card number and ask about fraud controls.");
  }

  if (category.includes("Credential")) {
    plan.push("If a password or code was shared, change the password and revoke active sessions from a trusted device.");
  }

  return plan;
}

function safeSignal(): Signal {
  return {
    label: "No strong scam markers",
    detail: "This message does not match the strongest local scam patterns. That does not prove it is safe.",
    severity: "info"
  };
}

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
