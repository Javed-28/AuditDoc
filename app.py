import os
import sys
import uuid
import shutil

from flask import (
    Flask,
    request,
    jsonify,
    render_template,
    Response,
    send_from_directory
)
from flask_cors import CORS
from werkzeug.utils import secure_filename

# --------------------------------------------------
# PATH SETUP
# --------------------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

from python.executable import run_ocr_pipeline

# --------------------------------------------------
# FLASK APP
# --------------------------------------------------

app = Flask(__name__)

# ✅ ENABLE CORS (FIXES REACT CONNECTION)
CORS(app)

UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "pdf"}

# ---- CLEAN OLD UPLOADS ON APP START ----
shutil.rmtree(UPLOAD_FOLDER, ignore_errors=True)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# --------------------------------------------------
# HELPERS
# --------------------------------------------------

def result_to_text(result):
    lines = []
    for item in result:
        lines.append(f"Dealer Name   : {item.get('dealer_name')}")
        lines.append(f"Model Name    : {item.get('model_name')}")
        lines.append(f"Horse Power   : {item.get('horse_power')}")
        lines.append(f"Asset Cost    : {item.get('asset_cost')}")
        lines.append(f"Confidence    : {item.get('confidence')}")
        lines.append("-" * 40)
    return "\n".join(lines)


# --------------------------------------------------
# SERVE UPLOADED FILES (UI PREVIEW)
# --------------------------------------------------

@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


# --------------------------------------------------
# UI ROUTES (OPTIONAL – HTML UI)
# --------------------------------------------------

@app.route("/")
def index():
    return render_template("upload.html")


@app.route("/upload", methods=["POST"])
def upload_ui():
    file = request.files.get("file")

    if not file or file.filename == "":
        return render_template("error.html", message="No file uploaded")

    if not allowed_file(file.filename):
        return render_template("error.html", message="Unsupported file type")

    filename = secure_filename(f"{uuid.uuid4()}_{file.filename}")
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)

    try:
        result_json = run_ocr_pipeline(file_path)
        result_text = result_to_text(result_json)

        return render_template(
            "result.html",
            result_json=result_json,
            result_text=result_text,
            image_url=f"/uploads/{filename}"
        )

    except Exception as e:
        return render_template("error.html", message=str(e))


# --------------------------------------------------
# DOWNLOAD ROUTES
# --------------------------------------------------

@app.route("/download/json", methods=["POST"])
def download_json():
    return Response(
        request.form["data"],
        mimetype="application/json",
        headers={"Content-Disposition": "attachment; filename=result.json"}
    )


@app.route("/download/txt", methods=["POST"])
def download_txt():
    return Response(
        request.form["data"],
        mimetype="text/plain",
        headers={"Content-Disposition": "attachment; filename=result.txt"}
    )


# --------------------------------------------------
# API ROUTES (REACT USES THESE)
# --------------------------------------------------

@app.route("/api/health", methods=["GET"])
def api_health():
    return jsonify({"status": "ok"}), 200


@app.route("/api/process", methods=["POST"])
def api_process():
    file = request.files.get("file")

    if not file or file.filename == "":
        return jsonify({"error": "No file provided"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Unsupported file type"}), 400

    filename = secure_filename(f"{uuid.uuid4()}_{file.filename}")
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)

    try:
        result = run_ocr_pipeline(file_path)
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        if os.path.exists(file_path):
            os.remove(file_path)


# --------------------------------------------------
# RUN APP
# --------------------------------------------------

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
