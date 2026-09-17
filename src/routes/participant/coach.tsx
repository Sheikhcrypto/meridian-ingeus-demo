import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { participantBrief } from "@/lib/meridian/format";
import { useMeridian } from "@/lib/meridian/store";
import { useAi } from "@/lib/meridian/use-ai";
import { cn } from "@/lib/utils";
import type { ChatTurn } from "@/lib/meridian/types";

const EMPTY_TURNS: ChatTurn[] = [];

export const Route = createFileRoute("/participant/coach")({
  component: CoachPage,
});

function CoachPage() {
  const selfId = useMeridian((s) => s.selfId);
  const participants = useMeridian((s) => s.participants);
  const interviews = useMeridian((s) => s.interviews);
  const p = participants.find((x) => x.id === selfId);
  const history = interviews[selfId] ?? EMPTY_TURNS;
  const addTurn = useMeridian((s) => s.addInterviewTurn);
  const reset = useMeridian((s) => s.resetInterview);
  const [answer, setAnswer] = useState("");
  const ai = useAi();

  if (!p) return null;
  const person = p;

  async function send(userText?: string) {
    const transcript = [
      ...history.map((t) => `${t.role === "you" ? "Candidate" : "Interviewer"}: ${t.text}`),
      userText ? `Candidate: ${userText}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    const res = await ai.run(
      "interview",
      `${participantBrief(person)}\n\nTranscript so far:\n${transcript || "(interview has not started)"}`,
    );
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    if (userText) addTurn(person.id, { role: "you", text: userText });
    addTurn(person.id, { role: "coach", text: res.text });
    setAnswer("");
    ai.setText("");
  }

  return (
    <div>
      <h1 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">
        Interview practice
      </h1>
      <p className="mt-2 max-w-xl text-muted">
        A rehearsal for {p.goal.toLowerCase()}. Say it out loud first if that helps,
        then type. Feedback is private to you.
      </p>

      <Card className="mt-6 flex min-h-[22rem] flex-col">
        <div className="flex-1 space-y-3">
          {history.length === 0 && (
            <p className="text-sm text-muted">
              Press start and Meridian will ask a first question, in a UK competency
              style. There is no score — only a chance to try again.
            </p>
          )}
          {history.map((turn, i) => (
            <div
              key={`${turn.role}-${i}`}
              className={cn(
                "max-w-[40rem] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                turn.role === "coach" ? "bg-sage" : "ml-auto bg-accent-soft",
              )}
            >
              <p className="mb-1 text-[11px] font-medium tracking-wide text-subtle uppercase">
                {turn.role === "coach" ? "Interviewer" : "You"}
              </p>
              <p className="whitespace-pre-wrap">{turn.text}</p>
            </div>
          ))}
        </div>

        <form
          className="mt-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (!answer.trim() || ai.loading) return;
            void send(answer.trim());
          }}
        >
          <label htmlFor="answer" className="sr-only">
            Your answer
          </label>
          <Textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer"
            disabled={history.length === 0}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {history.length === 0 ? (
              <Button type="button" onClick={() => void send()} disabled={ai.loading}>
                {ai.loading ? "Preparing" : "Start interview"}
              </Button>
            ) : (
              <Button type="submit" disabled={ai.loading || !answer.trim()}>
                {ai.loading ? "Listening" : "Send answer"}
              </Button>
            )}
            {history.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  reset(person.id);
                  setAnswer("");
                }}
              >
                Start over
              </Button>
            )}
          </div>
          {ai.error && <p className="mt-3 text-sm text-bad">{ai.error}</p>}
        </form>
      </Card>
    </div>
  );
}
