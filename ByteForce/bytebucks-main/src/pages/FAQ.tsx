import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button"; // Import Button
import { useNavigate } from "react-router-dom"; // Import useNavigate

const faqData = [
  {
    category: "Getting Started & Wallet Connection",
    questions: [
      {
        question: "How do I connect my wallet to ByteBucks?",
        answer:
          "To connect your wallet, click the 'Connect Wallet' button in the top-right corner of the page. You will be prompted to choose from a list of supported wallets. Select your wallet provider (e.g., MetaMask, Coinbase Wallet, WalletConnect) and follow the on-screen instructions to authorize the connection. You may need to sign a message to verify ownership of your wallet.",
      },
      {
        question: "Which wallets are supported on ByteBucks?",
        answer:
          "We support a wide range of popular wallets, including MetaMask, WalletConnect, and Coinbase Wallet. WalletConnect allows you to connect dozens of other mobile and desktop wallets. We are continuously working to integrate more wallet options.",
      },
      {
        question: "My wallet connection is failing. What should I do?",
        answer:
          "If you're having trouble connecting, try these steps: 1) Refresh the page and try again. 2) Ensure your wallet extension or app is unlocked and updated to the latest version. 3) Check that you are on the correct blockchain network (e.g., Ethereum Mainnet). 4) Clear your browser cache or try a different browser. 5) If using WalletConnect, try disconnecting the session from within your wallet app and establishing a new one.",
      },
      {
        question: "What is a 'wallet signature request' and is it safe?",
        answer:
          "A signature request is a way for a website to verify that you are the true owner of your crypto wallet without requiring you to spend any funds. It is a standard and safe procedure on legitimate NFT marketplaces. However, always be cautious. Read the signature request carefully and ensure you are on the correct website (bytebucks.com) before signing. Never sign a transaction that asks you to approve spending your funds unless you intend to make a purchase.",
      },
    ],
  },
  {
    category: "Blockchain, Gas Fees & Transactions",
    questions: [
      {
        question: "What are gas fees and why do I have to pay them?",
        answer:
          "Gas fees are transaction costs paid to network validators who process and secure transactions on the blockchain. Every action, such as minting, buying, or transferring an NFT, requires computational resources, and gas fees compensate validators for this work. ByteBucks does not set or profit from gas fees; they are a fundamental part of how blockchains like Ethereum operate.",
      },
      {
        question:
          "My transaction is pending for a long time. What's happening?",
        answer:
          "A transaction can remain 'pending' if the gas fee you set was too low for the current network congestion. When many users are transacting, validators prioritize transactions with higher gas fees. You can either wait for network activity to decrease or use your wallet's features to speed up or cancel the pending transaction.",
      },
      {
        question: "My transaction failed. Will I get my gas fees back?",
        answer:
          "Unfortunately, no. When a transaction fails, you do not get the gas fees back. This is because validators still performed the computational work to attempt the transaction, even though it ultimately failed (e.g., due to an error in a smart contract or running out of gas). This is a characteristic of the blockchain itself, not the marketplace.",
      },
      {
        question: "Why do transactions take a long time to process?",
        answer:
          "Blockchain transactions are not instantaneous like traditional web payments. Each transaction must be added to a block, validated by a distributed network of computers, and then permanently recorded on the chain. This decentralized confirmation process provides security but takes time. Processing speed can vary from a few seconds to several minutes depending on network congestion and the gas fee paid.",
      },
    ],
  },
  {
    category: "Buying, Selling, and Bidding",
    questions: [
      {
        question: "What is the difference between ERC-721 and ERC-1155 tokens?",
        answer:
          "ERC-721 is the standard for non-fungible tokens, where each token is unique and has a distinct ID. It's like a one-of-a-kind digital certificate of ownership. ERC-1155 is a multi-token standard that can represent both fungible (like in-game currency) and non-fungible items within a single smart contract, making it more efficient for creating collections with multiple editions of an item.",
      },
      {
        question:
          "I bought an NFT, but it's not appearing in my profile. What should I do?",
        answer:
          "After a successful purchase, it can sometimes take a few minutes for the NFT to appear in your profile due to indexing delays. First, check a block explorer (like Etherscan) to confirm the transaction was successful. If confirmed, try a hard refresh of your browser. If it still doesn't appear after 15-20 minutes, please contact our support team with your wallet address and the transaction hash.",
      },
      {
        question: "The NFT image isn't loading. How can I fix this?",
        answer:
          "NFT metadata, including the image, is often stored on decentralized storage like IPFS. Sometimes, this data can be slow to load. You can try refreshing the page or clicking the 'Refresh Metadata' button on the NFT's detail page (if available). This action prompts our servers to re-fetch the metadata from the source.",
      },
      {
        question: "How do royalties work for creators?",
        answer:
          "Creator royalties are fees paid to the original artist every time their NFT is resold on the secondary market. The percentage is set by the creator when they mint the NFT. ByteBucks honors these on-chain royalty standards to ensure artists are fairly compensated for their work.",
      },
    ],
  },
  {
    category: "Security, Scams & Safety",
    questions: [
      {
        question: "How can I protect my account and NFTs from scams?",
        answer:
          "1) Never share your wallet's seed phrase or private key with anyone. 2) Use a hardware wallet for high-value assets. 3) Be wary of unsolicited DMs, emails, or social media offers—these are often phishing attempts. 4) Always double-check the URL to ensure you are on the official ByteBucks site. 5) Revoke unnecessary token approvals and permissions from websites you no longer use.",
      },
      {
        question: "How do I report a suspicious NFT or collection?",
        answer:
          "If you encounter an NFT that infringes on copyright, is part of a scam, or violates our terms of service, please use the 'Report' button on the NFT's page. Provide as much detail as possible in your report so our moderation team can investigate thoroughly.",
      },
      {
        question:
          "What should I do if I accidentally clicked a phishing link?",
        answer:
          "If you just clicked a link but did not sign any transactions or enter your seed phrase, you are likely safe. Immediately close the suspicious tab. If you signed a malicious transaction, you may have approved a contract to spend your tokens. Use a tool like Revoke.cash to review and revoke any suspicious token approvals immediately. If you believe your wallet is compromised, transfer any remaining assets to a new, secure wallet right away.",
      },
    ],
  },
  {
    category: "Account & Platform Features",
    questions: [
      {
        question: "How do I update my profile information?",
        answer:
          "You can edit your username, bio, and profile picture by navigating to your 'Profile' page and clicking the 'Edit Profile' button. Note that your wallet address is your permanent identifier and cannot be changed.",
      },
      {
        question: "What is the ByteBucks rewards system?",
        answer:
          "Our rewards system is designed to give back to our community. You can earn points or exclusive perks by participating in activities like trading, listing, and completing specific challenges. Check the 'Rewards' page for more details on current promotions and your progress.",
      },
      {
        question: "Is ByteBucks available on mobile devices?",
        answer:
          "Yes, our website is fully responsive and designed to work seamlessly on modern mobile browsers. You can connect using a mobile-compatible wallet like MetaMask Mobile or any wallet supported by WalletConnect to trade on the go.",
      },
      {
        question: "How does ByteBucks handle user privacy and data?",
        answer:
          "We are committed to protecting your privacy. Our primary interaction with you is through your public wallet address. We minimize the collection of personal data. For more detailed information, please review our official Privacy Policy, which outlines the data we collect and how we use it.",
      },
    ],
  },
];

export function FAQPage() {
  const navigate = useNavigate(); // Initialize useNavigate hook

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-4 text-gray-500 dark:text-gray-400 md:text-xl">
          Find answers to common questions about using the ByteBucks
          marketplace.
        </p>
      </div>
      <div className="mx-auto mt-12 max-w-4xl">
        {faqData.map((category) => (
          <div key={category.category} className="mb-10">
            <h2 className="mb-6 text-2xl font-bold tracking-tight">
              {category.category}
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {category.questions.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>
      <div className="text-center mt-12">
        <Button onClick={() => navigate('/')}>Return to Home Page</Button>
      </div>
    </div>
  );
}

