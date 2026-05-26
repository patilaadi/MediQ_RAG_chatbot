import os
import requests
import json

OPENROUTER_URL = "https://openrouter.ai/v1/chat/completions"


def analyze_medical_report(report_text: str, model: str = "gpt-4o-mini", temperature: float = 0.0):
	"""Call OpenRouter to analyze a medical report and return structured JSON.

	Returns a dict with keys: `diagnoses`, `causes`, `precautions`, `medicines`,
	`tables` (markdown), and `raw` (fallback text).
	"""
	api_key = os.getenv("OPENAI_API_KEY") or os.getenv("OPENROUTER_API_KEY")
	if not api_key:
		return {"error": "OPENAI_API_KEY or OPENROUTER_API_KEY is not set"}

	system_prompt = (
		"You are an expert medical assistant. Given a patient's raw medical report (lab values, ECG output, clinical notes),"
		" extract abnormal findings, suggest likely diagnoses, list possible causes, provide practical precautions, and list commonly-prescribed"
		" medications (include typical dose ranges only as informational — not medical advice). Return a JSON object with keys:\n"
		"diagnoses: [{name, confidence(0-1), notes}], causes: [..], precautions: [..], medicines: [{name, indication, typical_dose, notes}],"
		" tables_markdown: string (a markdown table summarizing key lab values), and summary: string. If uncertain, state uncertainty and recommend clinical follow-up."
	)

	user_prompt = f"Analyze the following medical report and produce the requested JSON output.\n\nReport:\n{report_text}\n\nRespond ONLY with a valid JSON object."

	payload = {
		"model": model,
		"messages": [
			{"role": "system", "content": system_prompt},
			{"role": "user", "content": user_prompt},
		],
		"temperature": temperature,
		"max_tokens": 1200,
	}

	headers = {
		"Content-Type": "application/json",
		"Authorization": f"Bearer {api_key}",
	}

	try:
		resp = requests.post(OPENROUTER_URL, headers=headers, json=payload, timeout=30)
		resp.raise_for_status()
		data = resp.json()
		# OpenRouter-compatible response may include choices[0].message.content
		content = None
		if isinstance(data, dict):
			choices = data.get("choices") or []
			if choices:
				msg = choices[0].get("message") or choices[0].get("delta") or {}
				content = msg.get("content") if isinstance(msg, dict) else None

		if not content:
			# Fallback to `text` or whole response
			content = data.get("text") if isinstance(data, dict) else str(data)

		# Try to parse JSON from the model output
		try:
			parsed = json.loads(content)
			return {"result": parsed}
		except Exception:
			# If model returned markdown with code block, try to extract JSON block
			import re

			m = re.search(r"```json\s*(\{.*?\})\s*```", content, re.S)
			if m:
				try:
					parsed = json.loads(m.group(1))
					return {"result": parsed}
				except Exception:
					pass

			# final fallback: return raw text
			return {"raw": content}

	except Exception as e:
		return {"error": str(e)}

