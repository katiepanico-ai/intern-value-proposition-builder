# Intern Value Proposition Builder — Project Handoff

*Prepared October 12, 2026, to continue this project in Dell's Claude environment.*

## How to use this file
Upload this file to a Project in Dell's Claude (or paste it at the start of a chat). Then use the starter prompt at the bottom. Keep this file updated: after each step, edit the "Where we left off" section and re-upload it.

---

## About me and how I like to work
- I'm Katie Panico, Program Manager on the Global Operations Talent Ops team at Dell. I run the internship program.
- I am **not** an engineer by background. This project was my first time using Git and the GitHub CLI.
- Please give plain, step-by-step guidance and assume no technical knowledge. Explain each step from scratch.
- I learn by doing. I'll paste the exact error messages and terminal output, and we'll work through problems one at a time.
- I care about accuracy, security, and Dell owning the tool, not just getting something working.

## What the tool is
The **Intern Value Proposition Builder** is a self-serve web app. It takes Dell interns through a 5-step framework that turns their technical project work into a business value story, then exports a 6-slide PowerPoint deck.
- It's based on my manager Barsha's "Executive Impact Blueprint" framework.
- Manica and Serban have given feedback.

## How it's built today
- **Stack:** static React + Vite + TypeScript + Tailwind CSS, with hash-based routing.
- **No backend.** Everything runs in the intern's browser.
- **Saving:** browser localStorage, plus an export/import backup file so interns can move their progress between devices. The app shows a save-status message.
- **PowerPoint:** built in the browser with the pptxgenjs library.
- **Code location:** my personal GitHub account, repo `katiepanico-ai/intern-value-proposition-builder`.
- **Live site:** https://katiepanico-ai.github.io/intern-value-proposition-builder/ (GitHub Pages).
- **Interim copy:** a GitLab project under my personal namespace on Dell's GitLab (SSO).
- I work on a Dell-managed Windows laptop with Git for Windows and the GitHub CLI (`gh`).

## Constraints already learned
- **SharePoint can't host the app directly.** Dell's tenant blocks custom JavaScript (DenyAddAndCustomizePages), and only IT admins can change that.
- **SharePoint can embed the app.** The SharePoint Embed web part can show an externally hosted app inside a SharePoint page.
- **Dell GitLab is the right long-term home.** It's SSO-provisioned, but creating groups needs an IT admin. There is a GlobalOps group but no Talent Ops subgroup yet.
- **No Dell GitHub org access.** I'm not a member of Dell's GitHub organization (github.com/dell).
- **AI needs a server piece.** Connecting to an AI service needs a small backend to hold the API key securely, because a key can't be stored in a public web page. It also needs Dell approval for sending intern project content to that AI service.

## Goal
Move the tool onto Dell's infrastructure and connect it to Dell's approved AI, so it can offer AI-powered review of intern responses.

## Plan (one step per chat, to avoid running out of room)
1. **Get answers from Dell IT/security first** (see questions below). No building until these are answered.
2. **Move the code into Dell's GitLab.** Push the existing code into an institutional location (ideally a Talent Ops subgroup under GlobalOps).
3. **Host the app inside Dell.** Use GitLab Pages or whatever internal hosting IT approves, then point the SharePoint Embed web part at the new address.
4. **Add a small server piece** that holds the AI credentials securely and passes requests between the app and Dell's AI.
5. **Build the AI review feature**, so interns get suggestions to strengthen their answers.

### Questions for Dell IT / security
- Which AI service or platform are internal tools allowed to use?
- How does an internal app get access to it (API key, service account, other)? What's the request process?
- Is it approved for intern project content (possibly internal or confidential business details)?
- Where can an internal web app with a small server-side piece be hosted? Can GitLab Pages on Dell's GitLab serve internal apps?
- Can a Talent Ops subgroup be created under GlobalOps on Dell's GitLab, and who should own it?
- Does Dell's Claude have access to Dell GitLab (a connector, or Claude Code), so it can work on the code directly?

## Intern feedback (October 2026) and planned response
Overall feedback was very positive. Interns found the guided steps, strength checker, examples, and auto-generated deck intuitive and time-saving.

**Challenges raised:**
- ROI is hard to fill in for research, testing, AI, and evaluation projects.
- Business impact and ownership may not be established yet.
- Slide customization is limited.
- Some questions feel repetitive.
- There's no deck preview before export.

**Planned order of work (by effort, not only by stated priority):**
1. *Quick wins (no new infrastructure):*
   - DONE in version 2: alternative ROI frameworks by project type; "not yet established" options for impact and ownership; examples for AI, analytics, testing and research; streamlined overlapping questions.
2. *Moderate:*
   - deck preview before export;
   - a few theme or color choices;
   - Excel/work-log upload (limited value without AI).
3. *Big lifts (need the Dell move above):*
   - AI content review;
   - multi-person collaboration (needs shared storage and logins).

## Where we left off
- Feedback reviewed and work prioritized.
- **Version 2 built (October 12, 2026): the quick wins are done.**
  - Step 1 asks what kind of project it is: built/improved a process or tool; research or evaluation; AI or automation pilot; analytics or reporting; testing or proof of concept. This tailors the examples and Step 3.
  - Step 3 offers alternative value questions ("value lenses"): What we learned, Decision informed, Risk reduced, Capability built, Expected impact if adopted. Research, AI, analytics and testing projects see these first; the ROI calculator becomes optional for them.
  - Step 3 asks "Has the impact been measured yet?" Choosing "still emerging" retitles slide 4 "Expected Impact and Value". Each metric can be marked as an estimate, shown as "(est.)".
  - Step 5 has an "owner not decided yet" option, shown on the deck as "Proposed Ownership (to be confirmed)".
  - New examples for each project type, plus a new prompt-library entry for projects without hard numbers.
  - Streamlined questions: Step 4's two overlapping "what would it take" questions are merged into one, and Step 5 no longer re-asks about resources. Older saved progress is upgraded automatically.
  - The deck stays at 6 slides. Slide 4 adapts to numbers only, value descriptions only, or both.
- The code is in the source zip (IVP_Builder_source_v2.zip). The GitHub repo holds only the built website files.
- Decided to move the build to Dell's Claude and Dell infrastructure.
- **Next step:** gather answers to the IT/security questions above (Plan step 1). The next feature after that is deck preview.

---

## Starter prompt for the first chat in Dell's Claude
> I'm continuing a project from another chat. The attached handoff file explains the tool, how it's built, what we've learned, and the plan. Please read it, then help me with Plan step 1: figuring out who at Dell to ask and how to word my request to IT/security. Keep explanations plain and step by step — I'm not an engineer.
