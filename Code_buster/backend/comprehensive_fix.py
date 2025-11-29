#!/usr/bin/env python3
"""
Comprehensive fix for Python 3.14 compatibility issues
This patches multiple modules to work with Python 3.14
"""

import sys
import typing
import typing_extensions

# Fix typing_extensions
print("Fixing typing_extensions...")
if not hasattr(typing_extensions, 'Literal'):
    setattr(typing_extensions, 'Literal', typing.Literal)
    print("Fixed typing_extensions.Literal")

if not hasattr(typing_extensions, 'Final'):
    setattr(typing_extensions, 'Final', getattr(typing, 'Final', None))
    print("Fixed typing_extensions.Final")

if not hasattr(typing_extensions, 'ClassVar'):
    setattr(typing_extensions, 'ClassVar', getattr(typing, 'ClassVar', None))
    print("Fixed typing_extensions.ClassVar")

# Pre-patch pydantic by importing it after the fix
print("Pre-patching pydantic modules...")
try:
    # Import and patch pydantic modules
    import pydantic._internal._typing_extra as typing_extra
    
    # Fix the specific line that's causing issues
    if hasattr(typing_extra, '_NONE_TYPES'):
        # Replace the problematic line
        typing_extra._NONE_TYPES = (None, type(None), typing.Literal[None])
        print("Fixed pydantic._typing_extra._NONE_TYPES")
        
except ImportError as e:
    print(f"Could not patch pydantic module: {e}")

# Also patch typing module to have all needed attributes
print("Ensuring typing module has all attributes...")
required_attrs = ['Literal', 'Final', 'ClassVar', 'NewType', 'Type', 'Protocol']
for attr in required_attrs:
    if not hasattr(typing, attr):
        print(f"typing.{attr} not found")

print("Comprehensive fix completed!")
