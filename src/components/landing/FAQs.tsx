import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

export default function FAQs() {
  const [openItem, setOpenItem] = useState<string | null>(null);

  const faqs = [
    {
      question: "What types of data does DataSquirrel support?",
      answer: "DataSquirrel supports a wide variety of data formats including Excel files (.xlsx, .xls), CSV files, Google Sheets, and direct database connections. We can handle structured data from sales reports, financial statements, customer databases, inventory systems, and more."
    },
    {
      question: "Can I connect my data and set automatic updates on it?",
      answer: "Yes! DataSquirrel offers seamless integration with popular data sources like Google Sheets, databases, and cloud storage. You can set up automatic data refreshes to ensure your insights are always up-to-date without manual intervention."
    },
    {
      question: "Can I analyze spreadsheets with multiple tabs?",
      answer: "Absolutely! DataSquirrel can process and analyze complex Excel workbooks with multiple sheets and tabs. Our AI automatically detects relationships between different sheets and provides comprehensive analysis across all your data."
    },
    {
      question: "What is the onboarding process?",
      answer: "Getting started is simple: 1) Sign up for your account, 2) Upload your data or connect your data sources, 3) Let our AI analyze and clean your data, 4) Review automated insights and visualizations, 5) Customize dashboards to your needs. The entire process takes just minutes!"
    },
    {
      question: "Can my non-tech business teams use DataSquirrel without prior training, unlike Tableau or Power BI?",
      answer: "Yes! DataSquirrel is designed specifically for non-technical users. Unlike complex tools like Tableau or Power BI that require extensive training, DataSquirrel's AI handles the technical complexity automatically, providing insights in plain English that anyone can understand and act upon."
    },
    {
      question: "Why do you emphasize so much on Cleaning Datasets prior to analysis?",
      answer: "Clean data is the foundation of accurate insights. Dirty data with duplicates, inconsistencies, and errors leads to misleading conclusions and poor business decisions. Our AI automatically identifies and fixes data quality issues, ensuring your analysis is based on reliable, accurate information."
    },
    {
      question: "Why do I need auto-analysis and auto-insights?",
      answer: "Manual analysis is time-consuming and prone to human bias. Auto-analysis ensures you don't miss important patterns, trends, or anomalies in your data. Our AI can process thousands of data points instantly, uncovering insights that might take analysts hours or days to discover manually."
    },

  ];

  // Handle accordion state changes
  const handleAccordionChange = (value: string) => {
    setOpenItem(value === openItem ? null : value);
  };

  return (
    <section id="faqs" className="py-20 px-4 md:px-6 bg-gradient-to-br from-background via-background/90 to-muted/30 relative overflow-hidden">
      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary/80 to-primary/60 shadow-lg mb-4">
              <MessageCircle className="h-7 w-7 text-primary-foreground" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground/80">
          <span className="relative inline-block text-transparent bg-gradient-to-r from-primary to-purple-500 bg-clip-text">
            Frequently Asked Questions</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about DataSquirrel. Can't find the answer you're looking for?{' '}
            <span className="text-primary font-medium underline underline-offset-4 cursor-pointer hover:text-primary/80 transition-colors">
              Reach out to our team
            </span>.
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion 
          type="single" 
          collapsible 
          value={openItem || undefined}
          onValueChange={handleAccordionChange}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <Card 
              key={index}
              className={cn(
                "group overflow-hidden border border-border/40 transition-all duration-300",
                "hover:shadow-md hover:bg-muted/10",
                openItem === `item-${index}` && "ring-1 ring-primary/20 shadow-sm"
              )}
            >
              <AccordionItem 
                value={`item-${index}`} 
                className="border-none"
              >
                <AccordionTrigger 
                  className="px-6 py-4 hover:no-underline"
                >
                  <div className="flex items-center justify-between w-full text-left">
                    <h3 className="font-medium text-base text-foreground group-hover:text-primary transition-colors duration-300">
                      {faq.question}
                    </h3>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent className="px-6 pb-6 pt-0">
                  <div className="pt-4 relative">
                    {/* Left accent border */}
                    <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-primary/60 to-primary/20 rounded-full"></div>
                    
                    <div className="pl-6">
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Card>
          ))}
        </Accordion>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground text-sm">
            Still have questions?{' '}
            <a href="#contact" className="text-primary font-medium hover:underline underline-offset-4">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-[20%] left-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
    </section>
  );
}