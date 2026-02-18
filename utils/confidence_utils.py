def compute_confidence(dealer, model, hp, cost, sig, stamp):
    confidence = 0.0
    confidence += 0.2 if dealer else 0
    confidence += 0.2 if model else 0
    confidence += 0.2 if hp else 0
    confidence += 0.2 if cost else 0
    confidence += 0.2 if sig or stamp else 0
    return round(confidence, 2)


# IMPORTANT: alias used by executable.py
def calculate_confidence(dealer, model, hp, cost, sig, stamp):
    return compute_confidence(dealer, model, hp, cost, sig, stamp)
