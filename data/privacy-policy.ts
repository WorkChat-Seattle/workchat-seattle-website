/**
 * Privacy Policy (страница `/privacy-policy`, только на английском). ФАЙЛ СОБИРАЕТСЯ из
 * `content/texts/privacy-policy.md` (выгрузка Google Doc, источник истины) командой `npm run privacy:build`
 * (scripts/build-privacy.ts) — руками не править. Состав: заголовок, строка «Effective date», вводный абзац,
 * 13 разделов и блок контактов (раздел 14). Номера «1.» … «13.» — как в документе; ссылки (https://…, email)
 * оформляются при выводе.
 */
export type PolicySection = { id: string; title: string; body: string[] };

export const privacyPolicy: {
  title: string;
  effectiveDate: string;
  intro: string;
  sections: PolicySection[];
  contact: { title: string; body: string[] };
} = {
  title: "WorkChat Seattle Privacy Policy",
  effectiveDate: "Effective date: November 6, 2026",
  intro: "WORKCHAT SEATTLE, a Washington nonprofit corporation (“WorkChat Seattle,” “we,” “us,” or “our”), operates https://workchatseattle.org. This Privacy Policy explains how we collect, use, disclose, protect, and retain personal information in connection with our website, communications, programs, and activities.",
  sections: [
    {
      "id": "personal-information-we-collect",
      "title": "1. Personal Information We Collect",
      "body": [
        "We collect personal information that you voluntarily provide when you interact with us through our website, email, or other communication channels. This may include your name, email address, professional information, interests, preferences, and information contained in messages or materials you submit.",
        "You may provide information when applying to participate in our mentorship program, expressing interest in volunteering, registering for or attending events, suggesting community activities, subscribing to our newsletter, making a donation, or otherwise engaging with WorkChat Seattle. The information requested depends on the nature and purpose of your interaction. We may also receive related information from third-party platforms used to support these activities, including event registration, newsletter subscription, communications, and donation services.",
        "We do not request sensitive personal information through our website forms. Please avoid submitting unnecessary sensitive information about yourself or others. Technical information collected automatically is described separately below."
      ]
    },
    {
      "id": "how-we-use-personal-information",
      "title": "2. How We Use Personal Information",
      "body": [
        "We use personal information to operate our website; provide and coordinate the activities and services you request; respond to inquiries; communicate about your participation; administer contributions and related records; and improve the website and our programs.",
        "We may also use information to protect the security of our services, respond to privacy requests, comply with legal obligations, and address disputes or misuse. We send newsletters only to people who affirmatively subscribe. Submitting information for another purpose does not automatically subscribe you to a newsletter.",
        "We will provide appropriate notice and obtain consent where required before using personal information for a materially different purpose."
      ]
    },
    {
      "id": "disclosures-to-service-providers-and-others",
      "title": "3. Disclosures to Service Providers and Others",
      "body": [
        "We do not sell, rent, or exchange our contact lists or provide personal information to other organizations for their independent marketing. We do not use personal information for cross-context behavioral advertising.",
        "We use third-party service providers to support website hosting, data storage, communications, analytics, security, and administration of our activities. These providers may process information needed to perform their services. Within WorkChat Seattle, access is limited to authorized team members who need information for their responsibilities.",
        "We do not publicly disclose personal information submitted through our forms without your permission. We publish photographs, testimonials, and mentor profiles only with your consent. If you volunteer as a mentor and agree to publication, your mentor profile may include your name, photo, professional background, LinkedIn profile, and email address, so that mentees can contact you directly. Where you request or authorize an introduction as part of our activities, we may share the contact information needed to facilitate it.",
        "We may disclose information when reasonably necessary to comply with applicable law or valid legal process, protect legal rights or personal safety, investigate misuse, or resolve a dispute. We may also disclose information at your direction or with your permission."
      ]
    },
    {
      "id": "website-analytics-and-session-replay",
      "title": "4. Website Analytics and Session Replay",
      "body": [
        "We may use analytics tools to understand how visitors use our website and to improve its content, navigation, and functionality. These tools may measure page visits and interactions and generate heatmaps or session replays showing clicks, scrolling, cursor movements, and navigation.",
        "Session replay reconstructs interactions with website pages; it does not record your camera or microphone. We configure these tools to exclude form entries and personal information displayed on pages and do not intentionally send the contents of your submissions to analytics services.",
        "Analytics that measures page visits and interactions is enabled by default, and you can turn it off at any time through Cookie Settings. Session replay and heatmaps are enabled only after you opt in through Cookie Settings, and you may withdraw that choice at any time."
      ]
    },
    {
      "id": "information-collected-automatically",
      "title": "5. Information Collected Automatically",
      "body": [
        "Our website and its providers may automatically process technical information, such as your IP address, browser and device details, referring pages, pages visited, access times, cookie identifiers, approximate location, and diagnostic or security information.",
        "This information supports website operation, security, troubleshooting, and usage analysis. The information collected depends on the features enabled and your privacy choices. Embedded content and anti-spam services may also receive technical information when their features are used."
      ]
    },
    {
      "id": "cookies-and-your-choices",
      "title": "6. Cookies and Your Choices",
      "body": [
        "Our website may use cookies and similar technologies to support essential functionality, remember preferences, protect against misuse, and provide optional analytics or embedded content.",
        "Necessary technologies support core operations and security and are always active. Optional analytics and embedded content, such as maps, are on by default, and you can turn them off at any time. Session replay remains off until you choose to enable it. Cookie Settings identifies the optional services currently enabled and allows you to accept, reject, or change your preferences. Your choices do not prevent you from submitting a form.",
        "Turning off an optional category stops future collection through it but does not automatically delete information already collected. You may separately request deletion. You can also manage cookies through your browser, although disabling necessary technologies may affect website functionality.",
        "Preferences may need to be set separately for each browser or device. If your browser sends a Global Privacy Control signal, we treat it as a request to turn off optional analytics, session replay, and embedded content. Legacy Do Not Track browser settings are distinct from these signals and do not replace the choices available through Cookie Settings."
      ]
    },
    {
      "id": "third-party-links-and-platforms",
      "title": "7. Third-Party Links and Platforms",
      "body": [
        "Our website contains links to external websites and platforms, including Zeffy (https://www.zeffy.com) for event registration and donations. These services may collect information directly from you and make relevant information available to us as the event organizer or donation recipient.",
        "Event pages may also display an interactive map provided by Google Maps. When the map loads, Google receives technical information such as your IP address and may set its own cookies. You can turn off embedded maps through Cookie Settings.",
        "Our newsletter sign-up form is provided by Zeffy and embedded on our pages. When the form loads, Zeffy receives technical information such as your IP address and may set its own cookies. The email address you enter is sent directly to Zeffy, which maintains our subscriber list on our behalf.",
        "Payment information is submitted to the relevant platform and its payment providers. We do not ask you to send full payment card details to us by email.",
        "External services have their own privacy policies governing their processing. We encourage you to review those policies before providing information. This policy governs how WorkChat Seattle handles information it receives from those services."
      ]
    },
    {
      "id": "protecting-personal-information",
      "title": "8. Protecting Personal Information",
      "body": [
        "We use reasonable administrative, technical, and organizational safeguards appropriate to the information we handle, including restrictions on access to personal information.",
        "No method of electronic transmission or storage is completely secure. Although we take reasonable measures to protect information against unauthorized access, use, or disclosure, we cannot guarantee absolute security."
      ]
    },
    {
      "id": "deletion-requests-and-other-privacy-rights",
      "title": "9. Deletion Requests and Other Privacy Rights",
      "body": [
        "You may request access to, a copy of, correction of, or deletion of your personal information by contacting us at the email address below. We may ask for limited information to verify your identity or an authorized representative’s authority.",
        "Subject to applicable exceptions, we will delete personal information under our control and instruct service providers processing it on our behalf to do the same where appropriate. We may retain information when reasonably necessary and permitted by law to comply with legal or accounting obligations, address security incidents, resolve disputes, or establish or defend legal claims. We will explain any refusal or limitation, subject to legal restrictions.",
        "Depending on your location and applicable law, you may have additional rights, including portability, restriction of or objection to processing, withdrawal of consent, and information about disclosures. We respond within applicable legal deadlines and do not unlawfully discriminate against people for exercising their rights.",
        "If you disagree with our response, contact us with the subject line “Privacy Appeal.” We will review the decision and respond as required by applicable law. You may also contact the relevant state attorney general or other competent privacy regulator."
      ]
    },
    {
      "id": "children-under-age-13",
      "title": "10. Children Under Age 13",
      "body": [
        "Our services are intended for adults and are not directed to children under 13. We do not knowingly collect personal information from children under 13.",
        "If you believe a child under 13 has provided personal information to us, please contact us so we can investigate and take appropriate steps to delete it."
      ]
    },
    {
      "id": "email-and-subscription-preferences",
      "title": "11. Email and Subscription Preferences",
      "body": [
        "We may send email to respond to inquiries, acknowledge submissions, and communicate about activities or transactions you have requested. We send newsletters only after an affirmative subscription.",
        "You may unsubscribe from newsletters using the link in an email or by contacting us. We process unsubscribe requests promptly. We may retain a minimal record of your preference to avoid adding you back unintentionally.",
        "Unsubscribing from newsletters does not prevent communications needed to respond to your requests or administer your participation or transactions. Where enabled, our email provider may process delivery information and measure email opens or link clicks to help us understand communication performance."
      ]
    },
    {
      "id": "third-party-storage-and-retention",
      "title": "12. Third-Party Storage and Retention",
      "body": [
        "We may store and organize information using third-party hosting and data management services. Information may be processed in the United States and other countries where our providers operate. Where applicable law requires safeguards for international transfers, we will use the required safeguards.",
        "We retain personal information only for as long as reasonably needed for the purposes described in this policy, taking into account the nature of the information, our relationship with you, and applicable legal, accounting, security, and dispute-related requirements.",
        "When information is no longer needed, we delete it or remove identifying information. Backup copies may remain until overwritten or deleted through the provider’s backup cycle, subject to applicable law. Information retained in backups remains subject to this policy and applicable deletion requirements. Aggregated information that no longer identifies individuals may be retained longer."
      ]
    },
    {
      "id": "updates-to-this-policy",
      "title": "13. Updates to This Policy",
      "body": [
        "We may update this policy to reflect changes in our practices or applicable requirements. We will revise the effective date and provide additional notice of material changes where appropriate or legally required.",
        "We will obtain new consent where required before using information for a materially different purpose. Continued use of the website does not, by itself, constitute consent to optional tracking or other processing that requires a separate choice."
      ]
    }
  ],
  contact: {
    "title": "Organization Information and Contact Details",
    "body": [
      "WORKCHAT SEATTLE is a nonprofit corporation incorporated in the State of Washington and recognized by the Internal Revenue Service as tax-exempt under Section 501(c)(3) of the Internal Revenue Code. The organization is classified as a public charity under Section 170(b)(1)(A)(vi). Its federal tax exemption is effective September 18, 2026.",
      "Legal name: WORKCHAT SEATTLE\nState of incorporation: Washington, United States\nDate of incorporation: September 18, 2026\nFederal Employer Identification Number (EIN): 42-5207715\nWashington Unified Business Identifier (UBI): 606 294 435",
      "Registered agent and registered office:\nNorthwest Registered Agent, LLC\n522 W Riverside Ave Ste N\nSpokane, WA 99201-0581\nUnited States",
      "The address above is the registered office for legal notices and service of process. Please use the email address below for privacy requests and general inquiries.",
      "Website: https://workchatseattle.org\nEmail: workchatseattle@gmail.com",
      "For questions about this Privacy Policy, to exercise your privacy rights, or to request copies of organizational documents available for public inspection, please contact us by email."
    ]
  },
};
