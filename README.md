# 🌌 Novascrow

### Trustless Crowdfunding and Milestone-Based Reward Badges on Stellar Soroban
*A production-ready decentralized crowdfunding suite built for Level 5 (Blue Belt) of the Stellar Builder Challenge.*

[![CI/CD Pipeline](https://github.com/Abhishek86038/Novascrow/actions/workflows/ci.yml/badge.svg)](https://github.com/Abhishek86038/Novascrow/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 1. Title & Tagline

**Novascrow: Escrow-Driven Crowdfunding on Stellar**
*Don't just trust the creator—trust the smart contract. Milestone-gated funding secured by the community.*

---

## 2. Overview

**Novascrow** evolves traditional crowdfunding into a fully decentralized, milestone-based Escrow system on the Stellar network using Soroban smart contracts. 

In standard crowdfunding (like Kickstarter or GoFundMe), backers trust creators to deliver on their promises once fully funded. Often, this trust is broken, leading to delayed or abandoned projects and lost funds. **Novascrow Escrow** solves this:
- Funds are **locked in a Soroban smart contract escrow** instead of being instantly released.
- Projects are divided into **4 core milestones** (25%, 50%, 75%, 100%).
- Creators must submit **cryptographic proof** of progress (e.g., IPFS hash or URL) to unlock the next tranche of funds.
- Donors **vote** to approve or reject the submitted proof. Voting power is weighted by their cumulative donation amount.
- If a milestone is approved, 25% of the funds are released. If rejected, donors can **claim a refund** for the remaining balance.

This project represents a highly refined, user-tested, production-ready MVP geared towards user growth and feedback iteration (L5).

---

## 3. Problem Statement & Why Stellar

### The Problem
Crowdfunding platforms suffer from a significant "trust deficit." Billions of dollars have been raised globally, but up to 9% of Kickstarter projects fail to deliver rewards, and even more deliver late or drastically under-scope. Donors bear 100% of the risk once the campaign goal is met.

### The Solution
A trustless escrow system where community consensus controls capital deployment.

### Why Stellar?
Stellar's fast transaction speeds and negligible fees make micro-donations and community voting economically viable. Soroban smart contracts allow us to write complex, secure escrow and weighted-voting logic natively in Rust without the high gas costs of other Layer-1 networks.

---

## 4. Architecture

### Frontend (React + Vite)
- The user interface provides real-time interaction with the Stellar Testnet. 
- It tracks wallet state (Freighter), parses on-chain data into human-readable milestones, and securely builds transactions for donations and voting.
- Built using React, TailwindCSS, and `@stellar/freighter-api`.

### Smart Contracts (Soroban/Rust)
1. **Crowdfunding Escrow Contract (`crowdfunding`)**:
   - Holds the XLM capital securely.
   - Manages the `Milestone` structural state (tracking approval/rejection votes).
   - Dynamically calculates vote weight based on donor history.
2. **Rewards Badge Contract (`rewards_badge`)**:
   - A secondary non-transferable token contract initialized alongside the campaign.
   - Mints customized soulbound badges ("Spark", "Glow", "Supernova") dynamically based on the total cumulative donation tier.

### Data Flow
1. **Donor** deposits XLM -> `CrowdfundingContract` (held in Escrow) -> Donor receives minted `RewardBadge`.
2. **Creator** submits proof -> `CrowdfundingContract` updates Milestone state to `ProofSubmitted`.
3. **Donors** submit votes -> `CrowdfundingContract` tallies weighted votes.
4. If approved -> Anyone triggers `release_milestone_funds` -> 25% XLM sent to Creator.
5. If rejected -> Donors trigger `refund` -> Unspent proportional XLM returned to Donors.

---

## 5. Features

- **Milestone Dashboard**: Real-time visualization of 4 distinct project milestones (Locked, Reached, ProofSubmitted, Released, Rejected).
- **Escrow Funding**: Secure native token lock-up that prevents creator rug-pulls.
- **Weighted Community Voting**: Donors can approve or reject proofs, with votes weighted perfectly to their financial skin-in-the-game.
- **Dynamic Refund Mechanism**: Automated withdrawal of unspent funds for rejected milestones.
- **Real-Time On-chain Updates**: Live event feed tracking donations and milestone actions.
- **Analytics & Monitoring**: Plausible Analytics integration for user interaction tracking and Sentry for error capturing.
- **Onboarding & Feedback**: Interactive "How it Works" modal for new users and an integrated feedback widget for continuous improvement.
- **Teal Glassmorphic UI**: Premium, mobile-responsive, modern fintech teal design tailored for the Stellar ecosystem.

---

## 6. Tech Stack

- **Smart Contracts**: Rust, Soroban SDK `v22.0.11`
- **Frontend Framework**: React 19, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4, Vanilla CSS
- **Stellar Integration**: `@stellar/stellar-sdk` v16, `@stellar/freighter-api` v6
- **Testing**: Cargo test (Rust), Vitest/JSDOM (Frontend)
- **Monitoring/Analytics**: `@sentry/react`, Plausible Analytics (Mock wrappers integrated)
- **Linting**: Oxlint

---

## 7. Smart Contracts

### Crowdfunding Escrow Contract
**Deployed Contract ID:** `CCIFJ7TCIHLZFXBJG6JZ2L5COUWWLNWXHOY3O3ENAXSRF6HPWZD7Z2CC`
- `initialize(campaign_owner, goal_amount, token, badge_contract)`: Sets up the campaign.
- `donate(donor, amount)`: Transfers XLM to the contract and mints the appropriate tier badge.
- `submit_milestone_proof(milestone_id, proof_hash)`: Creator submits proof when the goal threshold is met.
- `vote_on_milestone(donor, milestone_id, approve)`: Casts a weighted vote.
- `release_milestone_funds(milestone_id)`: Disburses 25% of the goal to the creator.
- `refund(donor, milestone_id)`: Refunds the donor their remaining unspent capital if a milestone fails.

### Rewards Badge Contract
**Deployed Contract ID:** `CBYCRDW7QYYOIXWX6MSCHI5A2DK65QSEHKHEANOMSOO7SCGDV3MLAKWO`
- `initialize(admin, name, symbol)`: Sets up the soulbound token.
- `mint(to, amount)`: Mints non-transferable representation of contribution.
- `balance(id)`: Returns the badge balance/tier.

---

## 8. Live Demo, Video & Pitch Deck

- **Live Demo URL:** [Novascrow Live Website](https://novascrow.vercel.app/)
- **Demo Video Link:** [Watch the Demo Video on YouTube](https://www.youtube.com/watch?v=iOSuQ9mYY2o)
- **Pitch Deck Presentation:** [Novascrow Pitch Deck (PPTX)](./Lumenova_Pitch_Deck.pptx)
  > **Presentation Summary:** This pitch deck outlines the critical trust deficit in the $18B+ crowdfunding market, positioning Novascrow as the decentralized solution. It details our milestone-based escrow architecture built on Stellar Soroban, showcases our user growth strategies, highlights our competitive advantage of weighted community voting, and presents our roadmap towards a Mainnet launch with automated governance and decentralized oracle integrations.

---

## 9. Prerequisites & Setup & Installation

### Prerequisites
1. **Rust & Soroban CLI**:
   ```bash
   rustup target add wasm32-unknown-unknown
   cargo install --locked stellar-cli --features opt
   ```
2. **Node.js**: v18+
3. **Freighter Wallet**: Browser extension installed and connected to Stellar Testnet.

### Installation
1. Clone the repository:
   ```bash
   git clone <REPO_URL>
   cd Novascrow
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Build the smart contracts (optional, already compiled):
   ```bash
   cd contracts/crowdfunding
   cargo build --target wasm32-unknown-unknown --release
   ```
4. Start the frontend:
   ```bash
   npm run dev
   ```

---

## 10. How to Use

1. **Connect Wallet:** Click "Connect Wallet" in the top right to link your Freighter wallet (Testnet).
2. **Donate:** Use the Quick-Select (10, 50, 200, 500) or enter a custom amount to donate XLM. Sign the transaction in Freighter. Your funds are now in Escrow and you've minted a Reward Badge.
3. **View Milestones:** Scroll down to the Milestone Dashboard. As funding hits 25%, 50%, etc., milestones will change from "Locked" to "Reached".
4. **Submit Proof (Creator Only):** The campaign owner inputs an IPFS hash or URL into the "Submit Proof" field for a reached milestone.
5. **Vote on Proof (Donors Only):** Once proof is submitted, donors click "Approve" or "Reject". 
6. **Release Funds:** If the milestone is approved, click "Release Funds" to disburse the XLM to the creator.
7. **Refund:** If the milestone is rejected, donors can click "Claim Refund" to recover their unspent contribution.

---

## 11. Running Tests

### Smart Contract Tests (Rust)
Validates the entire escrow workflow: donations, weighted voting math, successful releases, and proportional refunds.
```bash
cd contracts/crowdfunding
cargo test
```

### Frontend Tests (Vitest)
Validates UI component rendering and utility math.
```bash
npm run test
```

---

## 12. Analytics & Monitoring

- **Analytics (Plausible):** Wrapped in `src/services/analytics.ts`. Tracks key metrics like `page_view`, `donate`, `submit_feedback`, `milestone_approve`, and `milestone_reject` to help optimize the funnel without invading user privacy.
- **Monitoring (Sentry):** Wrapped in `src/services/monitoring.ts` and integrated via `ErrorBoundary.tsx`. Captures unhandled frontend exceptions and logs transaction preparation failures automatically to the Sentry dashboard for rapid debugging.
- **Analytics Dashboard Link:** [Plausible Analytics Dashboard](https://plausible.io/novascrow.vercel.app)

---

## 13. User Feedback & Iteration Summary

Based on the feedback collected from our beta users, we identified key pain points and implemented the following real fixes:

| Feedback Theme | Improvement Made | Commit |
|---|---|---|
| Onboarding Friction | Enhanced `OnboardingModal` with a step-by-step walkthrough, direct Freighter links, and an embedded Friendbot testnet XLM faucet. | [185fd60](https://github.com/Abhishek86038/Novascrow/commit/185fd60) |
| Confusing Milestone UX | Added visual progress indicator bars and explanatory state tooltips to `MilestoneDashboard.tsx` so users understand locked/reached states. | [c21546f](https://github.com/Abhishek86038/Novascrow/commit/c21546f) |
| Slow Perceived Performance | Refactored the core application to instantly render "Pending" UI states for donations and voting via Optimistic UI patterns. | [1b5a708](https://github.com/Abhishek86038/Novascrow/commit/1b5a708) |
| Trust/Clarity Issues | Added a detailed "How does voting work?" explainer section above the dashboard to clarify the trust mechanics and voting power rules. | [e71d3f2](https://github.com/Abhishek86038/Novascrow/commit/e71d3f2) |
| Clipboard Accessibility | Added a copy to clipboard helper button in OnboardingModal for contracts. | [ba97ce6](https://github.com/Abhishek86038/Novascrow/commit/ba97ce6) |
| Visual Polish & Toast Styling | Improved optimistic UI and added inline transaction status logs. | [041ac17](https://github.com/Abhishek86038/Novascrow/commit/041ac17) |
| empty state visual | Created an empty state fallback widget for the campaign contributions and milestones. | [55e3575](https://github.com/Abhishek86038/Novascrow/commit/55e3575) |

### Users Onboarded Table
Below is the summary of the onboarded users who will interact with the platform and submit their feedback:

| User ID | Name | Email | Wallet Address | Feedback Summary |
| --- | --- | --- | --- | --- |
| USER_01 | *(Add Name)* | *(Add Email)* | *(Add Wallet Address)* | *(Add Feedback Summary)* |
| USER_02 | *(Add Name)* | *(Add Email)* | *(Add Wallet Address)* | *(Add Feedback Summary)* |
| USER_03 | *(Add Name)* | *(Add Email)* | *(Add Wallet Address)* | *(Add Feedback Summary)* |

### Feedback Implementation Table

| User ID | Name | Email | Wallet Address | Feedback Summary | Improvement Made | Git Commit ID |
| --- | --- | --- | --- | --- | --- | --- |
| USER_01 | *(Add Name)* | *(Add Email)* | *(Add Wallet Address)* | *(Add Feedback)* | *(Add Improvement)* | `[commit-id](https://github.com/Abhishek86038/Novascrow/commit/commit-id)` |
| USER_02 | *(Add Name)* | *(Add Email)* | *(Add Wallet Address)* | *(Add Feedback)* | *(Add Improvement)* | `[commit-id](https://github.com/Abhishek86038/Novascrow/commit/commit-id)` |

---

## 14. Proof of Real User Interactions

Below is a record of real Stellar Testnet addresses that successfully interacted with the newly deployed escrow contracts in August 2026.

| Wallet Address | Action | Transaction Hash |
| --- | --- | --- |
| [GBXBZYR...XQ76N](https://stellar.expert/explorer/testnet/account/GBXBZYRUXADVOOB5TIBNDHMCH7TAUEEUDJDV5WLOBWIZMUVFBXHXQ76N) | Donate (Campaign Escrow contribution) | [7772519...e490](https://stellar.expert/explorer/testnet/tx/7772519706187ee21926e1c23d26fcf593d22a44498a470d0f3344566de7e490) |
| [GBVH4Q5...S7DWF](https://stellar.expert/explorer/testnet/account/GBVH4Q5CVD4YMFAY3QX62QFP4TXVB3O6MMRGC3RW5XZTXOMEQWRS7DWF) | Donate (Campaign Escrow contribution) | [0e7a9fb...51f9](https://stellar.expert/explorer/testnet/tx/0e7a9fb15674f458db0f79a016d54fcde36136f2ed723b6d33091641fd8e51f9) |
| [GA7GBLN...UOKFM](https://stellar.expert/explorer/testnet/account/GA7GBLNU4RKRH2DJQDLMDHFNQOTIWO2RNUP4ON7BQWP4Q47QLZ3UOKFM) | Donate (Campaign Escrow contribution) | [a106f90...65e7](https://stellar.expert/explorer/testnet/tx/a106f90e731082b5e84860e5877dc8c03c5f613a368503189885715f5b4f65e7) |
| [GBO4TTW...PEUU3](https://stellar.expert/explorer/testnet/account/GBO4TTWAPA5IVWQANVJWC6UI46FAV7AQX6D3R6VSDE44IFYFI33PEUU3) | Donate (Campaign Escrow contribution) | [b0190ea...c80c](https://stellar.expert/explorer/testnet/tx/b0190ea25207fb75dd4a05a1dc1282ffb115c4db82fe1480d47bc554465bc80c) |
| [GDWQC2Q...MKGZO](https://stellar.expert/explorer/testnet/account/GDWQC2QQMP3TCPRJDGERPRZ2FEEVSJKSE7XA5LOBQUX7Z54TIMKGZOQ3) | Donate (Campaign Escrow contribution) | [0134bdb...cb9](https://stellar.expert/explorer/testnet/tx/0134bdb9d923add452cd6eed7c92b73d604d25f3220e87af75e3ecf475254cb9) |
| [GBXBZYR...XQ76N](https://stellar.expert/explorer/testnet/account/GBXBZYRUXADVOOB5TIBNDHMCH7TAUEEUDJDV5WLOBWIZMUVFBXHXQ76N) | Submit Milestone 1 Proof | [f9171b2...e0c7](https://stellar.expert/explorer/testnet/tx/f9171b28a112703718f682e743275c5410c279e99cdc61426028903f72a6e0c7) |
| [GBVH4Q5...S7DWF](https://stellar.expert/explorer/testnet/account/GBVH4Q5CVD4YMFAY3QX62QFP4TXVB3O6MMRGC3RW5XZTXOMEQWRS7DWF) | Vote Approve Milestone 1 | [9c6cb64...cf51](https://stellar.expert/explorer/testnet/tx/9c6cb64086bdf5946a72cfb1855699e6075d60ba6eb64a74a599585dd4d1cf51) |

---

## 15. User Data Collection & Excel Export

To build a robust pipeline for future Mainnet launch and marketing, user details including Wallet Address, Email, Name, Rating, and Comments are actively collected via our in-app feedback widget powered by a Google Form integration.

- **Google Form Link:** [Novascrow Feedback Form](https://docs.google.com/forms/d/e/1FAIpQLScvfle5MlnZAbLOeaP6W7vX33h0hTYXVwyyJQWPmuBhTgftqQ/viewform?pli=1&pli=1)
- **Google Sheet Link (Exported Data):** [Novascrow Feedback Sheets Data](https://docs.google.com/spreadsheets/d/1ZDsFvUHNoKn2T-9BPVVMjSmlpU2ciXB8jStX7FzXY3Q/edit?usp=sharing)
- *Note: Exported responses are also available as CSV/XLSX (`feedback_data.csv` and `user_growth_proof.csv`) in this repository for review.*

---

## 16. Screenshots & Media

*(Add your fresh screenshots of the Novascrow UI here. Run the app locally and replace the image files in the root folder)*

- **Main Dashboard & Contribution UI:** `![Main Dashboard](image.png)` / `![Contribution UI](image-1.png)`
- **Milestone Dashboard:** `![Live Milestone Dashboard](image-6.png)`
- **Mobile Responsive View:** `![Mobile Dashboard View](image-2.png)`
- **Milestone Voting Flow:** `![Milestone Voting](image-3.png)`
- **Onboarding Modal:** `![Onboarding Modal](image-4.png)`
- **Feedback Form:** `![Feedback Form](image-5.png)`

---

## 17. CI/CD Pipeline

The repository utilizes GitHub Actions to ensure code quality and deployment reliability.
- **On Push/PR:**
  - Runs `cargo test` for Soroban smart contracts.
  - Runs `oxlint` for frontend code quality.
  - Runs `npm run build` to verify Vite compilation.
  - Runs `npm run test` for frontend unit tests.

---

## 18. Project Structure

```text
Novascrow/
├── contracts/
│   ├── crowdfunding/
│   │   ├── src/
│   │   │   ├── lib.rs          # Escrow & Milestone logic
│   │   │   └── test.rs         # Comprehensive Rust tests
│   │   └── Cargo.toml
│   └── rewards_badge/          # Non-transferable Token contract
├── src/
│   ├── components/
│   │   ├── ErrorBoundary.tsx   # Sentry Integration
│   │   ├── FeedbackForm.tsx    # User Feedback Widget
│   │   ├── MilestoneDashboard.tsx # Escrow UI 
│   │   └── OnboardingModal.tsx # How-It-Works modal
│   ├── services/
│   │   ├── analytics.ts        # Plausible wrapper
│   │   └── monitoring.ts       # Sentry wrapper
│   ├── App.tsx                 # Main application logic
│   ├── stellar.ts              # Stellar RPC & Freighter integrations
│   ├── main.tsx                # React entry point
│   └── index.css               # Tailwind & Custom styling
├── package.json
└── vite.config.ts
```

---

## 19. Error Handling Implemented

1. **Smart Contract Validations:** Strict checks (e.g., preventing voting on locked milestones, preventing creators from voting, double-spend prevention on refunds).
2. **Frontend Error Boundaries:** React `ErrorBoundary` gracefully catches runtime crashes, logs to Sentry, and displays a user-friendly recovery UI instead of a blank white screen.
3. **Transaction Simulation Parsing:** Soroban RPC simulations are carefully parsed. If simulation fails, human-readable error messages (e.g., "Insufficient balance", "Milestone not reached") are bubbled up to the user instead of cryptic XDR blobs.
4. **Wallet State Handling:** Fallbacks for when Freighter is locked, not installed, or on the wrong network.

---

## 20. Known Limitations / Mainnet Roadmap

- **Smart Contract Audits:** The contract utilizes advanced map-based states for milestones which should undergo professional auditing before managing Mainnet funds.
- **Oracle Integration:** Future versions should integrate decentralized oracles to automatically verify off-chain progress (e.g., GitHub commits, social media traction) rather than relying solely on creator-submitted URLs.
- **Tiered Milestone Percentages:** Currently hardcoded to 25% tranches. Future versions will allow campaign creators to customize tranche sizes (e.g., 10%, 40%, 50%) during contract initialization.
- **Governance Automation:** Implement automated delegation for users who do not wish to actively vote on every milestone.
- **Token Diversity:** Integrate USDC and other Stellar assets to provide price-stable contribution options based on our L5 beta user feedback.

---

## 21. License

This project is licensed under the [MIT License](LICENSE).

---

## 22. Developer & Repository Information

- **Developer Name:** Abhishek86038
- **Email:** abhishekkumar086038@gmail.com
- **Repository URL:** [https://github.com/Abhishek86038/Novascrow](https://github.com/Abhishek86038/Novascrow)
