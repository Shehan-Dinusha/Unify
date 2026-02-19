import React, { useState } from "react";
import LandingLayout from "../components/layout/LandingLayout";
import Card from "../components/common/Card";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <Card
      variant="card"
      noPadding
      className="self-stretch hover:border-primary-blue/40"
      onClick={onClick}
    >
      <div className="w-full flex flex-col justify-start items-start">
        <div className="w-full px-6 py-5 inline-flex justify-between items-center cursor-pointer select-none">
          <div className="pr-4 inline-flex flex-col justify-start items-start">
            <div className="justify-center text-slate-100 text-lg font-semibold leading-7">
              {question}
            </div>
          </div>
          <div
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          >
            <ChevronDown className="text-slate-400 w-6 h-6" />
          </div>
        </div>

        <div
          className={`w-full px-6 transition-all duration-300 ease-in-out overflow-hidden ${
            isOpen ? "max-h-[200px] opacity-100 pb-6" : "max-h-0 opacity-0"
          }`}
        >
          <div className="justify-center text-slate-400 text-base font-normal leading-6">
            {answer}
          </div>
        </div>
      </div>
    </Card>
  );
};

const SupportPage = () => {
  const [openIndex, setOpenIndex] = useState(-1);

  const faqs = [
    {
      question: "What is Unify?",
      answer:
        "Unify is a centralized university social and learning platform that integrates club management, real-time communication, digital payments, a marketplace, learning resource sharing, and campus engagement features within a single system.",
    },
    {
      question: "Who is eligible to register on Unify?",
      answer:
        "Registration is restricted to verified university students,other verified boarding owners,food and cafe providers,self employed persons and officially recognized campus clubs. Users must authenticate using a valid university email address.",
    },
    {
      question: "How does user authentication work?",
      answer:
        "Users authenticate using their university email credentials. Email verification is required during registration, and secure password protocols are enforced.",
    },
    {
      question: "What is post boosting and how is it implemented?",
      answer:
        "Post boosting increases the visibility and priority of a post within the campus feed for a selected duration. Boosted posts are algorithmically prioritized based on the selected boost level.",
    },
    {
      question: "How are boost payments processed?",
      answer:
        "Boost payments are deducted from the user’s internal wallet balance after confirmation of the selected boost duration.",
    },
    {
      question: "How does the wallet system operate?",
      answer:
        "The wallet system allows users to deposit, store, and spend platform credits securely. It records transaction history and processes payments for boosts and other paid features.",
    },
    {
      question: "Are wallet transactions secure?",
      answer:
        "Yes, all wallet transactions are processed using secure communication protocols and encrypted storage to ensure data protection.",
    },
    {
      question: "How does the marketplace system work?",
      answer:
        "Users can create listings by providing item details, pricing, and images. Interested users can contact sellers directly through the platform to coordinate transactions.",
    },
    {
      question: "Does Unify handle marketplace payments directly?",
      answer:
        "Marketplace payments may be processed through the internal wallet system or handled externally, depending on platform configuration.",
    },
    {
      question: "How can students upload learning materials?",
      answer:
        "Students can upload academic resources such as notes or study guides through the Learning Materials section. Uploaded files are stored and made accessible to other authorized users.",
    },
    {
      question: "Is uploaded content moderated?",
      answer:
        "Yes, uploaded content is subject to review to ensure compliance with academic standards and platform guidelines.",
    },
    {
      question: "How does the Lost & Found system function?",
      answer:
        "Users can submit lost or found reports including descriptions and images. Other users can browse listings and contact the poster to arrange item recovery.",
    },
    {
      question: "What happens if a user forgets their password?",
      answer:
        "Users can initiate a password reset through the “Forgot Password” feature, which sends a secure reset link to their registered email.",
    },
    {
      question: "Can users change their registered university email?",
      answer:
        "Email modifications require re-verification and may require administrative approval for security reasons.",
    },
    {
      question: "Is Unify mobile responsive?",
      answer:
        "Yes, the platform is designed with responsive UI principles to ensure compatibility across desktop and mobile devices.",
    },
    {
      question: "How is user data protected?",
      answer:
        "User data is stored securely using encrypted storage mechanisms and protected through authentication, authorization controls, and secure API communication.",
    },
  ];

  return (
    <LandingLayout>
      <section className="w-full flex flex-col items-center justify-start min-h-screen pt-10 pb-20 relative overflow-hidden">
        <div className="w-full max-w-[1280px] px-4 flex flex-col items-center gap-12 z-10">
          {/* Hero Title */}
          <div className="text-center">
            <h1 className="text-heading-display text-white tracking-tight leading-tight">
              How can we help you today?
            </h1>
          </div>

          {/* FAQ Accordion */}
          <div className="w-full max-w-[1000px] flex flex-col gap-4">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              />
            ))}
          </div>
        </div>
      </section>
    </LandingLayout>
  );
};

export default SupportPage;
