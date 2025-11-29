"""Compatibility shim for code that imports a Mongo-like API.

This project uses MySQL but some routes still import `app.database.mongo`.
Provide a minimal shim so the application can import successfully. The
returned collection object raises clear errors when its async methods are
used, prompting to switch to the MySQL helpers in `database.mysql`.
"""
from typing import Any

                                                                            
class _StubCollection:
    def __init__(self, name: str):
        self.name = name

    async def aggregate(self, *args, **kwargs):
        raise NotImplementedError(
            "Mongo-style aggregation is not implemented.\n"
            "This application uses MySQL (see `app.database.mysql`).\n"
            "Replace calls to `get_collection(...).aggregate(...)` with MySQL helper functions."
        )

    def find(self, *args, **kwargs):
        raise NotImplementedError(
            "Mongo-style find is not implemented.\n"
            "Replace `find` usage with the MySQL query helpers in `app.database.mysql`."
        )


def get_collection(name: str) -> _StubCollection:
    """Return a stub collection object for compatibility.

    The returned object will raise if used. This prevents import-time
    failures for modules expecting `app.database.mongo`, allowing the app
    to start while you migrate the dashboard routes to MySQL helpers.
    """
    return _StubCollection(name)
