import os
from groq import Groq
from difflib import SequenceMatcher

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY")
)


def classify_drift(
    before: str,
    after: str
) -> dict:

    similarity_score = SequenceMatcher(
        None,
        before,
        after
    ).ratio()

    prompt = f"""
You are evaluating an AI workflow output change.

BEFORE:
{before}

AFTER:
{after}

Respond exactly as:

DRIFT: [none|improvement|regression]
CONFIDENCE: [0.0-1.0]
NOTE: [one sentence]

Rules:
- none = outputs are essentially the same
- improvement = after is better
- regression = after is worse
"""

    try:

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            max_tokens=150
        )

        text = (
            response
            .choices[0]
            .message.content
            .strip()
        )

        drift = "none"
        note = "No significant change detected."
        confidence = 0.80

        for line in text.split("\n"):

            if line.startswith("DRIFT:"):

                raw = (
                    line
                    .replace("DRIFT:", "")
                    .strip()
                    .lower()
                )

                if raw in [
                    "none",
                    "improvement",
                    "regression"
                ]:
                    drift = raw

            elif line.startswith("CONFIDENCE:"):

                try:
                    confidence = float(
                        line.replace(
                            "CONFIDENCE:",
                            ""
                        ).strip()
                    )
                except:
                    pass

            elif line.startswith("NOTE:"):

                note = (
                    line
                    .replace("NOTE:", "")
                    .strip()
                )

        return {
            "drift": drift,
            "note": note,
            "confidence": confidence,
            "similarity_score": similarity_score
        }

    except Exception as e:

        drift = (
            "none"
            if similarity_score > 0.92
            else (
                "regression"
                if len(after)
                < len(before) * 0.85
                else "improvement"
            )
        )

        return {
            "drift": drift,
            "note": f"Fallback comparison used. {str(e)}",
            "confidence": similarity_score,
            "similarity_score": similarity_score
        }
