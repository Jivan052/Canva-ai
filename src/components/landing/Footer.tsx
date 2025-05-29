import {
  Instagram, Linkedin, Twitter, Github, ExternalLink,
  Mail, ChevronRight
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

function Footer() {
  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub", hoverColor: "hover:text-gray-900 dark:hover:text-gray-100" },
    { icon: Linkedin, href: "#", label: "LinkedIn", hoverColor: "hover:text-blue-500" },
    { icon: Twitter, href: "#", label: "Twitter", hoverColor: "hover:text-sky-400" },
    { icon: Instagram, href: "#", label: "Instagram", hoverColor: "hover:text-pink-500" }
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/20 pointer-events-none"></div>
      
      <div className="container px-4 py-8 mx-auto max-w-7xl relative z-10">
      {/* Quick subscribe */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 p-4 rounded-lg bg-muted/50 border border-border">
        <div>
        <h3 className="text-sm font-medium text-foreground mb-1">Stay up to date</h3>
        <p className="text-xs text-muted-foreground">Get notified about new features and updates</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-2">
        <Input 
          type="email" 
          placeholder="Enter your email" 
          className="h-9 w-full md:w-64 text-xs bg-background"
        />
        <Button size="sm" className="h-9 text-xs">
          Subscribe <ChevronRight className="ml-1 h-3 w-3" />
        </Button>
        </div>
      </div>
      
      {/* Main Footer Content */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
        {/* Brand Section */}
        <div className="col-span-2 md:col-span-1 flex flex-col">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">
          <span className="text-foreground">Data</span>
          <span className="relative inline-block text-transparent bg-gradient-to-r from-primary to-purple-500 bg-clip-text">
            Camel
          </span>
          </h2>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 font-normal border-primary/20 bg-primary/5 text-primary">
          Beta
          </Badge>
        </div>
        
        <p className="mt-2 text-sm text-muted-foreground">
          AI-powered data analysis and visualization for everyone.
        </p>

        {/* Social Icons */}
        <div className="flex gap-2 mt-4">
          {socialLinks.map(({ icon: Icon, href, label, hoverColor }) => (
          <Button
            key={label}
            size="icon"
            variant="outline"
            asChild
            className={cn(
            "h-8 w-8 rounded-full border-border/50 bg-background",
            "transition-all duration-300 hover:scale-110",
            hoverColor
            )}
          >
            <a
            href={href}
            aria-label={label}
            target="_blank"
            rel="noreferrer"
            >
            <Icon className="h-3.5 w-3.5" />
            </a>
          </Button>
          ))}
          
          <Button
          size="icon"
          variant="outline"
          asChild
          className="h-8 w-8 rounded-full border-border/50 bg-background transition-all duration-300 hover:scale-110 hover:text-rose-500"
          >
          <a
            href="mailto:info@datacamel.ai"
            aria-label="Email us"
            target="_blank"
            rel="noreferrer"
          >
            <Mail className="h-3.5 w-3.5" />
          </a>
          </Button>
        </div>
        </div>

        {/* Links Sections */}
        <div>
        <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
          Product
          <div className="ml-2 h-px w-5 bg-gradient-to-r from-primary to-purple-500"></div>
        </h3>
        <ul className="space-y-2 text-xs">
          {["Features", "Pricing", "Changelog", "Documentation", "Roadmap"].map((item) => (
          <li key={item}>
            <a
            href="#"
            className="text-muted-foreground hover:text-primary transition-colors group flex items-center"
            >
            <span className="group-hover:underline underline-offset-4">{item}</span>
            <ChevronRight className="ml-1 h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </a>
          </li>
          ))}
        </ul>
        </div>

        <div>
        <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
          Company
          <div className="ml-2 h-px w-5 bg-gradient-to-r from-primary to-purple-500"></div>
        </h3>
        <ul className="space-y-2 text-xs">
          {["About", "Blog", "Careers", "Contact", "Partners"].map((item) => (
          <li key={item}>
            <a
            href="#"
            className="text-muted-foreground hover:text-primary transition-colors group flex items-center"
            >
            <span className="group-hover:underline underline-offset-4">{item}</span>
            <ChevronRight className="ml-1 h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </a>
          </li>
          ))}
        </ul>
        </div>

        <div>
        <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
          Legal
          <div className="ml-2 h-px w-5 bg-gradient-to-r from-primary to-purple-500"></div>
        </h3>
        <ul className="space-y-2 text-xs">
          {["Privacy", "Terms", "Cookie Policy", "Security", "Compliance"].map((item) => (
          <li key={item}>
            <a
            href="#"
            className="text-muted-foreground hover:text-primary transition-colors group flex items-center"
            >
            <span className="group-hover:underline underline-offset-4">{item}</span>
            <ChevronRight className="ml-1 h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </a>
          </li>
          ))}
        </ul>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Footer Bottom */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <div className="text-xs text-muted-foreground">
        © {currentYear} 
        <span className="relative inline-block text-transparent bg-gradient-to-r from-primary to-purple-500 bg-clip-text ml-1">
          DataCamel
        </span>. 
        All rights reserved.
        </div>
        
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
        <a href="#" className="hover:text-primary transition-colors flex items-center">
          <ExternalLink className="h-3 w-3 mr-1" />
          <span>System Status</span>
        </a>
        <span className="hidden md:inline-flex items-center">
          <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
          All systems operational
        </span>
        <span className="hidden md:flex">
          Made with <span className="text-transparent bg-gradient-to-r from-primary to-purple-500 bg-clip-text mx-1">♥</span> by DataCamel Team
        </span>
        </div>
      </div>
      </div>
    </footer>
  );
}

export default Footer;