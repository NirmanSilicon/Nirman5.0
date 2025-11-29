import sys
import os

# Apply fix
try:
    import comprehensive_fix
except ImportError:
    sys.path.append('.')
    import comprehensive_fix

print("Fix applied. Importing fastapi...")
try:
    from fastapi import status
    print(f"Status module: {status}")
    print(f"HTTP_500: {getattr(status, 'HTTP_500_INTERNAL_SERVER_ERROR', 'MISSING')}")
except Exception as e:
    print(f"Error importing fastapi: {e}")
    import traceback
    traceback.print_exc()
