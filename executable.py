import time
import cv2
import pytesseract
import numpy as np
import re
import json
import os

from pdf2image import convert_from_path
from rapidfuzz import fuzz

from utils.image_utils import preprocess_image
from utils.ocr_utils import run_ocr
from utils.signature_utils import detect_signature_stamp
from utils.confidence_utils import calculate_confidence


# --------------------------------------------------
# PATH RESOLUTION (ROBUST, EDITOR-INDEPENDENT)
# --------------------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

INPUT_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "input_images"))
OUTPUT_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "output"))

print("Resolved INPUT_DIR:", INPUT_DIR)
print("Resolved OUTPUT_DIR:", OUTPUT_DIR)

os.makedirs(OUTPUT_DIR, exist_ok=True)


# --------------------------------------------------
# TESSERACT CONFIG
# --------------------------------------------------

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


# --------------------------------------------------
# CONSTANTS
# --------------------------------------------------

KNOWN_BRANDS = [
    "MAHINDRA", "SWARAJ", "SONALIKA", "KUBOTA",
    "MASSEY", "TAFE", "JOHN DEERE"
]

HP_RANGE = (20, 100)


# --------------------------------------------------
# TEXT EXTRACTION HELPERS
# --------------------------------------------------

def split_layout(ocr_data, height):
    header, body, footer = [], [], []
    for item in ocr_data:
        y = item["bbox"][1]
        if y < height * 0.25:
            header.append(item)
        elif y > height * 0.75:
            footer.append(item)
        else:
            body.append(item)
    return header, body, footer


def extract_dealer(header_texts):
    candidate = ""
    score = 0
    for text in header_texts:
        t = text.upper()
        if any(k in t for k in ["TRACTOR", "AGRO", "INDUSTRIES"]):
            if len(t) > score:
                candidate = t
                score = len(t)
    return candidate.strip()


def extract_model(body_texts):
    for text in body_texts:
        t = text.upper()
        for brand in KNOWN_BRANDS:
            if brand in t and any(char.isdigit() for char in t):
                return t
    return ""


def extract_hp(texts):
    for t in texts:
        match = re.search(r"(\d{2})\s*H\.?P\.?", t)
        if match:
            hp = int(match.group(1))
            if HP_RANGE[0] <= hp <= HP_RANGE[1]:
                return hp
    return None


def extract_cost(texts):
    numbers = []
    for t in texts:
        clean = t.replace(",", "")
        if re.fullmatch(r"\d{5,7}", clean):
            numbers.append(int(clean))
    return max(numbers) if numbers else None


# --------------------------------------------------
# CORE IMAGE PROCESSING
# --------------------------------------------------

def process_image(image_path):
    start_time = time.time()

    img = cv2.imread(image_path)
    processed = preprocess_image(img)
    ocr_data = run_ocr(processed)

    header, body, footer = split_layout(ocr_data, img.shape[0])

    header_texts = [i["text"] for i in header]
    body_texts = [i["text"] for i in body]
    all_texts = [i["text"] for i in ocr_data]

    dealer = extract_dealer(header_texts)
    model = extract_model(body_texts)
    hp = extract_hp(all_texts)
    cost = extract_cost(all_texts)

    signature, sig_box, stamp, stamp_box = detect_signature_stamp(img)

    confidence = calculate_confidence(
        dealer, model, hp, cost, signature, stamp
    )

    return {
        "doc_id": os.path.basename(image_path),
        "dealer_name": dealer,
        "model_name": model,
        "horse_power": hp,
        "asset_cost": cost,
        "signature": {
            "present": signature,
            "bbox": sig_box
        },
        "stamp": {
            "present": stamp,
            "bbox": stamp_box
        },
        "confidence": confidence,
        "processing_time_sec": round(time.time() - start_time, 2),
        "cost_estimate_usd": 0.002
    }


# --------------------------------------------------
# INPUT HANDLER (PNG / PDF)
# --------------------------------------------------

def process_input(path):
    results = []

    if path.lower().endswith(".pdf"):
        images = convert_from_path(path, dpi=300)
        for i, img in enumerate(images):
            temp_path = os.path.join(OUTPUT_DIR, f"temp_{i}.png")
            img.save(temp_path)
            results.append(process_image(temp_path))
            os.remove(temp_path)
    else:
        results.append(process_image(path))

    return results


# --------------------------------------------------
# MAIN
# --------------------------------------------------

if __name__ == "__main__":

    for filename in os.listdir(INPUT_DIR):
        if filename.lower().endswith(".png"):
            image_path = os.path.join(INPUT_DIR, filename)
            print(f"Processing: {filename}")

            output = process_input(image_path)

            output_file = os.path.join(
                OUTPUT_DIR,
                filename.replace(".png", ".json")
            )

            with open(output_file, "w", encoding="utf-8") as f:
                json.dump(output, f, indent=2)

    print("All images processed successfully.")
    
def run_ocr_pipeline(file_path):
    """
    API wrapper: accepts image or PDF path
    returns extracted JSON
    """
    return process_input(file_path)

