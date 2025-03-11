export interface ScoreModels {
  anger?: number;
  joy?: number;
  sadness?: number;
  fear?: number;
  disgust?: number;
  surprise?: number;
  contempt?: number;
  admiration?: number;
  amusement?: number;
  awe?: number;
  boredom?: number;
  confusion?: number;
  craving?: number;
  desire?: number;
  disappointment?: number;
  embarrassment?: number;
  envy?: number;
  excitement?: number;
  gratitude?: number;
  distress?: number;
  interest?: number;
  pride?: number;
  realization?: number;
  relief?: number;
  romantic_love?: number;
  guilt?: number;
}

export default function Expressions({ values }: { values?: ScoreModels }) {
  if (!values) return null;

  const scores = Object.entries(values || {});

  return (
    <div className="flex flex-wrap gap-0.5 p-2 pt-0">
      {scores.map(([key, value]) => {
        if (!value) return null;

        return (
          <div
            key={key}
            className="px-2 py-1 bg-slate-100 dark:bg-slate-900 rounded text-xs"
          >
            <span className="capitalize">
              {key.replace("_", " ")}: {(value * 100).toFixed(0)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
