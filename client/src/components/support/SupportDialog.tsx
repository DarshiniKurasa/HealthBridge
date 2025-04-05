
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function SupportDialog({ type }: { type: "call" | "chat" }) {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  
  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/support/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          message,
          email,
        }),
      });
      
      if (response.ok) {
        alert("Support request sent successfully!");
      }
    } catch (error) {
      console.error("Failed to send support request:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="lg">
          <span className="material-icons mr-2">{type === "call" ? "call" : "question_answer"}</span>
          {type === "call" ? "Contact Support" : "Live Chat"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{type === "call" ? "Contact Support" : "Start Chat"}</DialogTitle>
          <DialogDescription>
            {type === "call" 
              ? "Leave your contact information and we'll get back to you shortly."
              : "Start a conversation with our support team."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <Input
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Textarea
            placeholder="How can we help you?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button onClick={handleSubmit} className="w-full">
            {type === "call" ? "Send Request" : "Start Chat"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
