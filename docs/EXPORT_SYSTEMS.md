# 📦 OpenPrimer Course Export & Distribution Systems

OpenPrimer provides three distinct export tiers to distribute and integrate generated courses into external Learning Management Systems (LMS) and workflows.

---

## 1. LTI "Thin Common Cartridge" (Recommended - SaaS Mode)

*   **Format:** A standardized `.imscc` (IMS Thin Common Cartridge XML) package containing the course structure, module metadata, and secure LTI 1.3 launch links.
*   **Target Use Case:** Full integration into modern LMS platforms (Canvas, Moodle, Blackboard, D2L Brightspace) where the student experience remains dynamic.
*   **Key Advantages:**
    *   **100% AI Interactive:** The Socratic AI Tutor, interactive sandboxes, dynamic MDX rendering, and coding exercises execute fully inside the OpenPrimer cloud environment.
    *   **Zero-Maintenance Real-Time Updates:** Any modification made to the course content on OpenPrimer is instantly visible on the student's LMS in real-time, without requiring file re-imports.
    *   **Prompt & Code Security:** Your custom prompts, system configurations, and proprietary code remain securely stored on OpenPrimer's servers, eliminating source code exposure.

---

## 2. Static / Offline Exports (SCORM, HTML, PDF)

*   **Format:** A self-contained archive (ZIP) containing offline HTML, standard SCORM 1.2/2004 web pages, or a compiled PDF document.
*   **Target Use Case:** Isolated environments, offline distribution, or legacy LMS configurations requiring localized hosting.
*   **Key Limitations:**
    *   **Loss of AI Interactivity:** AI-driven conversational agents and tutors cannot execute locally inside the sandboxed LMS frame without a live OpenPrimer cloud gateway.
    *   **Read-Only Content:** Dynamic components and interactive code execution panels degrade to static, read-only representations.
    *   **No Auto-Updates:** Content updates require regenerating and re-importing the package to the external LMS.

---

## 3. Raw Structured Data (JSON + MDX)

*   **Format:** A compressed archive containing raw `.json` curriculum structures and pure `.mdx` lesson bodies.
*   **Target Use Case:** Course backups, manual version control (Git-based curriculum tracking), or migration to alternative custom educational platforms.
*   **Key Advantages:** Enables developers and educators to audit, version control, and dynamically parse the underlying raw pedagogical content.
