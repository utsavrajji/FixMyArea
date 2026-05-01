import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { HelpCircle, Search, ChevronDown, ChevronUp, MessageSquare, Plus, Info, ChevronRight } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-emerald-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-6 text-left transition-all hover:text-emerald-700"
      >
        <span className="text-lg font-bold text-[#064E3B]">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-emerald-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-emerald-500" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-gray-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

const FAQs = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      category: "General",
      items: [
        {
          question: "What is FixMyArea?",
          answer: "FixMyArea is a citizen-led platform that empowers individuals to report local civic issues directly to relevant authorities. It uses community power and technology to ensure faster resolution of neighborhood problems like potholes, street light failures, and garbage disposal."
        },
        {
          question: "Is it free to use?",
          answer: "Yes, FixMyArea is completely free for all citizens. Our mission is to facilitate better civic engagement and improve the living conditions in our communities."
        }
      ]
    },
    {
      category: "Reporting Issues",
      items: [
        {
          question: "How do I report an issue?",
          answer: "Simply click on the 'Report Issue' button, upload a photo of the problem, select the category (e.g., Road, Water, Sanitation), and provide the location. Your report will be visible on the local feed and forwarded to authorities."
        },
        {
          question: "Can I report issues anonymously?",
          answer: "While we encourage users to create an account to track their reports and get updates, you can report certain issues with limited visibility. However, verified accounts usually receive faster responses from authorities."
        },
        {
          question: "What happens after I submit a report?",
          answer: "Once submitted, your report is verified by the community and categorized. It then appears on the local feed where other citizens can 'Upvote' or 'Support' it. High-priority issues are escalated to municipal bodies."
        }
      ]
    },
    {
      category: "Account & Support",
      items: [
        {
          question: "How can I track my reports?",
          answer: "You can track all your submitted reports in the 'My Dashboard' section. You'll also receive notifications via email and on the platform whenever there's a status update on your report."
        },
        {
          question: "What if my issue isn't fixed?",
          answer: "If an issue remains unresolved for a long time, the community can 'boost' it to gain more visibility. You can also add comments or additional photos to provide updates on the situation."
        }
      ]
    }
  ];

  const filteredFaqs = faqs.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-[#064E3B] py-20 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 opacity-10">
          <HelpCircle className="h-96 w-96" />
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm font-medium backdrop-blur-sm mb-6">
            <Plus className="h-4 w-4 text-emerald-400" />
            <span>Help Center</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-8">
            Frequently Asked Questions
          </h1>
          
          {/* Search Bar */}
          <div className="mx-auto max-w-2xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for answers..."
              className="w-full rounded-2xl border-0 bg-white py-4 pl-12 pr-4 text-gray-900 shadow-xl focus:ring-2 focus:ring-emerald-500 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {filteredFaqs.length > 0 ? (
            <div className="space-y-16">
              {filteredFaqs.map((category, catIndex) => (
                <div key={catIndex}>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-600 mb-8 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    {category.category}
                  </h2>
                  <div className="bg-emerald-50/30 rounded-3xl p-2 border border-emerald-100">
                    <div className="bg-white rounded-2xl px-6">
                      {category.items.map((item, index) => (
                        <FAQItem key={index} question={item.question} answer={item.answer} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="bg-gray-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">We couldn't find any answers matching your search query.</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-6 text-emerald-600 font-bold hover:text-emerald-700 underline"
              >
                Clear search
              </button>
            </div>
          )}

          {/* Still Have Questions? */}
          <div className="mt-24 bg-[#064E3B] rounded-[2.5rem] p-8 md:p-12 text-center text-white relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="bg-white/10 h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <MessageSquare className="h-8 w-8 text-emerald-300" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
              <p className="text-emerald-100/70 mb-8 max-w-lg mx-auto">
                Can't find the answer you're looking for? Please chat to our friendly team.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-bold text-[#064E3B] shadow-lg transition-all hover:bg-emerald-50 hover:scale-105"
              >
                Contact Us
                <ChevronRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQs;
