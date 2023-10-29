#!/bin/bash

# Function to print messages with checkmark or cross mark in color
color_print() {
    STATUS=$1
    TEXT=$2
    if [ "$STATUS" -eq 0 ]; then
        printf "\033[32m✓ ${TEXT}\033[0m\n"
    else
        printf "\033[31m✗ ${TEXT}\033[0m\n"
    fi
}

# Run black for formatting check
black .
BLACK_STATUS=$?
color_print $BLACK_STATUS "Black formatting check"

# Run ruff for linting
# Replace this with actual linting command if 'ruff' was a typo or placeholder
ruff .
RUFF_STATUS=$?
color_print $RUFF_STATUS "Ruff linting check"

# Run mypy for type checking
mypy --check-untyped-defs .
MYPY_STATUS=$?
color_print $MYPY_STATUS "Mypy type checking"

# If all checks pass, allow the push to continue
if [ $BLACK_STATUS -eq 0 ] && [ $RUFF_STATUS -eq 0 ] && [ $MYPY_STATUS -eq 0 ]; then
    printf "\033[32m✓ All checks passed! Push can continue.\033[0m\n"
    exit 0
else
    printf "\033[31m✗ Some checks failed. Review the issues above.\033[0m\n"
    exit 1
fi
