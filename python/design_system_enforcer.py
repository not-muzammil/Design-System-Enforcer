"""
Design System Enforcer (DSE) - Python Runtime Guard
Enforces design invariants, banning hardcoded colors and raw browser defaults in Python UI (Streamlit, FastHTML, Dash, NiceGUI).
"""

import re
from typing import Any, Callable

class DesignSystemRuntimeError(Exception):
    def __init__(self, rule: str, message: str, received_value: Any = None):
        self.rule = rule
        self.received_value = received_value
        banner = (
            f"\n{'='*56}\n"
            f"[DSE RUNTIME ERROR: PYTHON]\n"
            f"{'='*56}\n"
            f"Rule: {rule}\n"
            f"{message}\n"
            f"{f'Received Value: {received_value}' if received_value else ''}\n"
            f"{'='*56}\n"
        )
        super().__init__(banner)


def assert_no_hardcoded_colors(css_or_html: str, context: str = "Python UI") -> None:
    """Raises DesignSystemRuntimeError if hardcoded hex/rgb colors exist in HTML/CSS."""
    if not isinstance(css_or_html, str):
        return

    # Check for hardcoded hex colors (e.g. #257AFF, #ff0000)
    hex_match = re.search(r"#(?:[0-9a-fA-F]{3,8})\b", css_or_html)
    if hex_match:
        val = hex_match.group(0)
        raise DesignSystemRuntimeError(
            rule="no-hardcoded-colors",
            message=f"Hardcoded hex color '{val}' detected in {context}. Must reference CSS variables (e.g. 'var(--primary)') or design tokens.",
            received_value=val,
        )

    # Check for raw rgb/rgba
    rgb_match = re.search(r"\brgba?\([^)]+\)", css_or_html)
    if rgb_match:
        val = rgb_match.group(0)
        raise DesignSystemRuntimeError(
            rule="no-hardcoded-colors",
            message=f"Hardcoded RGB color '{val}' detected in {context}. Use design system tokens.",
            received_value=val,
        )


def dse_guard(func: Callable) -> Callable:
    """Decorator to enforce DSE design system rules on function return values or UI builders."""
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        if isinstance(result, str):
            assert_no_hardcoded_colors(result, context=func.__name__)
        return result
    return wrapper

