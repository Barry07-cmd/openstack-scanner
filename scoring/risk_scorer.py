def calculate_score(findings):
    score = 0

    for f in findings:
        if f["severity"] == "CRITICAL":
            score += 50
        elif f["severity"] == "HIGH":
            score += 40
        elif f["severity"] == "MEDIUM":
            score += 20
        elif f["severity"] == "LOW":
            score += 10

    return min(score, 100)