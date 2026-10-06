import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { initialProgress } from "../domain/learning";
import type { Progress, ProgressRepository } from "../domain/models";
type Context = {
  progress: Progress;
  ready: boolean;
  error: string | null;
  update: (fn: (p: Progress) => Progress) => void;
  retry: () => void;
};
const State = createContext<Context | null>(null);
export function ProgressProvider({
  children,
  repository,
}: {
  children: React.ReactNode;
  repository: ProgressRepository;
}) {
  const [progress, setProgress] = useState(initialProgress);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const current = useRef(progress);
  const queue = useRef(Promise.resolve());
  useEffect(() => {
    repository
      .load()
      .then((p) => {
        current.current = p;
        setProgress(p);
        setReady(true);
      })
      .catch(() => {
        setError(
          "La progression n’a pas pu être chargée. Tes données existantes sont conservées.",
        );
      });
  }, [repository]);
  function update(fn: (p: Progress) => Progress) {
    const next = fn(current.current);
    current.current = next;
    setProgress(next);
    queue.current = queue.current
      .then(() => repository.save(next))
      .then(() => setError(null))
      .catch(() =>
        setError(
          "La sauvegarde a échoué. Garde l’application ouverte et réessaie.",
        ),
      );
  }
  function retry() {
    if (!ready) {
      repository
        .load()
        .then((p) => {
          current.current = p;
          setProgress(p);
          setReady(true);
          setError(null);
        })
        .catch(() => setError("Impossible de lire le stockage local."));
    } else update((p) => ({ ...p }));
  }
  return (
    <State.Provider value={{ progress, ready, error, update, retry }}>
      {children}
    </State.Provider>
  );
}
export function useProgress() {
  const value = useContext(State);
  if (!value) throw Error("ProgressProvider requis");
  return value;
}
