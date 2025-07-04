def mask_phone(number: str) -> str:
    """
    "0801234567"  →  "08xxxxxx7"
    Keeps the first 2 and last 1 digits, replaces the middle with 'x'.
    """
    if len(number) < 3:
        return number                      # nothing to mask
    return number[:2] + "x" * (len(number) - 3) + number[-1]