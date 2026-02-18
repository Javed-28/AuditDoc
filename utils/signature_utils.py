import cv2

def detect_signature_stamp(img):
    h, w = img.shape[:2]
    roi = img[int(h*0.65):h, int(w*0.05):int(w*0.95)]
    gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(
        gray, 150, 255, cv2.THRESH_BINARY_INV
    )

    contours, _ = cv2.findContours(
        thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
    )

    signature = False
    stamp = False
    sig_box = None
    stamp_box = None

    for cnt in contours:
        area = cv2.contourArea(cnt)
        x, y, cw, ch = cv2.boundingRect(cnt)
        if 500 < area < 5000:
            signature = True
            sig_box = [x, y, x+cw, y+ch]
        if area >= 5000:
            stamp = True
            stamp_box = [x, y, x+cw, y+ch]

    return signature, sig_box, stamp, stamp_box
    return detect_signature_stamp(img)