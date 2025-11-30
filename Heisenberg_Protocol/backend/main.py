from fastapi import FastAPI

from profiles.POST import router as profiles_post
from profiles.GET import router as profiles_get
from profiles.PUT import router as profiles_put

from crops.GET import router as crops_get
from schemes.GET import router as schemes_get

import importlib.util
import os


def load_router(module_name: str, file_path: str):
    spec = importlib.util.spec_from_file_location(module_name, file_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.router


advisory_reports_post = load_router("advisory_reports_POST", os.path.join("advisory-reports", "POST.py"))
advisory_reports_get = load_router("advisory_reports_GET", os.path.join("advisory-reports", "GET.py"))

market_prices_get = load_router("market_prices_GET", os.path.join("market-prices", "GET.py"))

app = FastAPI()

# include routers without additional prefix or tags
app.include_router(profiles_post)
app.include_router(profiles_get)
app.include_router(profiles_put)

app.include_router(advisory_reports_post)
app.include_router(advisory_reports_get)

app.include_router(crops_get)
app.include_router(market_prices_get)
app.include_router(schemes_get)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
