import pytesseract

def run_ocr(img):
    data = pytesseract.image_to_data(
        img, output_type=pytesseract.Output.DICT, lang="eng+hin"
    )
    results = []
    for i in range(len(data["text"])):
        if int(data["conf"][i]) > 40:
            x, y, w, h = (
                data["left"][i],
                data["top"][i],
                data["width"][i],
                data["height"][i],
            )
            results.append({
                "text": data["text"][i],
                "bbox": [x, y, x + w, y + h]
            })
    return results
