#!/usr/bin/env python3
"""
Fix for typing_extensions.Literal issue in Python 3.14
This script patches the typing_extensions module to include Literal
"""

import sys
import typing
import typing_extensions

# Add Literal from typing module to typing_extensions
if not hasattr(typing_extensions, 'Literal'):
    setattr(typing_extensions, 'Literal', typing.Literal)
    print("✅ Fixed typing_extensions.Literal")

# Also add other commonly needed attributes that might be missing
missing_attrs = {
    'Final': getattr(typing, 'Final', None),
    'ClassVar': getattr(typing, 'ClassVar', None),
    'NewType': getattr(typing, 'NewType', None),
    'Type': getattr(typing, 'Type', None),
    'Protocol': getattr(typing, 'Protocol', None),
}

for attr, value in missing_attrs.items():
    if value is not None and not hasattr(typing_extensions, attr):
        setattr(typing_extensions, attr, value)
        print(f"✅ Fixed typing_extensions.{attr}")

print("🎉 Typing extensions patch completed!")
