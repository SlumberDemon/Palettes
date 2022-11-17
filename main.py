import fastapi
from deta import Base
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, FileResponse

app = fastapi.FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"])
pages = Jinja2Templates(directory="templates")

favorites = Base("favorites")


class NoCacheFileResponse(FileResponse):
    def __init__(self, path: str, **kwargs):
        super().__init__(path, **kwargs)
        self.headers["Cache-Control"] = "no-cache"


@app.get("/", response_class=HTMLResponse)
async def home(request: fastapi.Request):
    return pages.TemplateResponse(
        "index.html",
        {"request": request},
    )


@app.get("/favorites", response_class=HTMLResponse)
async def favorites_page(request: fastapi.Request):
    res = favorites.fetch()
    items = res.items
    while res.last:
        res = favorites.fetch(last=res.last)
        items += res.items
    return pages.TemplateResponse(
        "favorites.html",
        {"request": request, "items": items},
    )


@app.post("/favorites")
async def favorites_add(color1, color2, color3, color4, color5):
    favorites.put(
        {
            "colors": {
                "1": f"#{color1}",
                "2": f"#{color2}",
                "3": f"#{color3}",
                "4": f"#{color4}",
                "5": f"#{color5}",
            }
        }
    )
    return {"message": "success"}


@app.delete("/favorites")
async def favorites_remove(id: str):
    favorites.delete(id)
    return {"message": "success"}


@app.get("/pallete/{id}")
async def pallete_page(request: fastapi.Request, id: str):
    item = favorites.get(id)
    return pages.TemplateResponse(
        "pallet.html",
        {"request": request, "item": item},
    )


@app.get("/static/{path:path}")
async def static(path: str):
    return NoCacheFileResponse(f"./static/{path}")
