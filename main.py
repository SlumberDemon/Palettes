import fastapi
from deta import Base
from extras.palette import palette_main
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware

app = fastapi.FastAPI()
pages = Jinja2Templates(directory="templates")
app.add_middleware(CORSMiddleware, allow_origins=["*"])
app.mount("/static/", StaticFiles(directory="static"), name="static")

favorites = Base("favorites")


@app.get("/", response_class=HTMLResponse)
async def home(request: fastapi.Request):
    items = palette_main()
    return pages.TemplateResponse(
        "index.html",
        {"request": request, "items": items},
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
async def favorites_add(c1, c2, c3, c4, c5, prompt: str):
    favorites.put(
        {
            "colors": {
                "1": f"#{c1}",
                "2": f"#{c2}",
                "3": f"#{c3}",
                "4": f"#{c4}",
                "5": f"#{c5}",
            },
            "prompt": prompt.replace("null", " "),
        }
    )
    return {"message": "success"}


@app.delete("/favorites")
async def favorites_remove(id: str):
    favorites.delete(id)
    return {"message": "success"}


@app.get("/palette/{id}")
async def palette_page(request: fastapi.Request, id: str):
    item = favorites.get(id)
    return pages.TemplateResponse(
        "palette.html",
        {"request": request, "item": item},
    )


# API


@app.get("/api/palette/{id}")
async def palette_api(id: str):
    item = favorites.get(id)
    return item


# App Actions


@app.post("/actions/random")
def random_palette():
    data = palette_main()
    return data


@app.get("/__space/actions")
def meta():
    return {
        "actions": [
            {"name": "random", "title": "Random Palette", "path": "/actions/random"},
        ]
    }
