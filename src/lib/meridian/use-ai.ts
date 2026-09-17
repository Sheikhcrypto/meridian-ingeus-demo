import { useState } from "react";
import { runMeridianAi, type AiKind } from "./ai";

export function useAi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState("");

  async function run(kind: AiKind, context: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await runMeridianAi({ data: { kind, context } });
      if (!res.ok) {
        setError(res.error);
        return res;
      }
      setText(res.text);
      return res;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      return { ok: false as const, error: message };
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, text, setText, setError, run };
}
