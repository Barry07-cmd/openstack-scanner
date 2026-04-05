def check_storage_rules(data):
    findings = []

    for vol in data["volumes"]:
        encrypted = getattr(vol, "encrypted", False)

        if not encrypted:
            findings.append({
                "type": "Unencrypted Volume",
                "severity": "MEDIUM"
            })

    return findings