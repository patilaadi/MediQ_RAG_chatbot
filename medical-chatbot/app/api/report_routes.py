from flask import Blueprint, request, jsonify
from app.services.llm_service import analyze_medical_report

report_bp = Blueprint("report_bp", __name__)


@report_bp.route("/analyze-report", methods=["POST"])
def analyze_report():
    data = request.get_json(force=True)
    report_text = data.get("report_text") or data.get("text")
    model = data.get("model")
    temperature = data.get("temperature", 0.0)

    if not report_text:
        return jsonify({"error": "report_text is required"}), 400

    result = analyze_medical_report(
        report_text, model=model or "gpt-4o-mini", temperature=temperature
    )
    return jsonify({
        "success": True,
        "analysis": result.get("result") or result.get("error") or result,
        "error": result.get("error")    }), 200 if "result" in result else 500
