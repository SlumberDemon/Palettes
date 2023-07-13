import os
import fastapi
import requests
from deta import Base
from io import BytesIO
from PIL import Image, ImageDraw
from extras.palette import palette_main
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, StreamingResponse

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


@app.get("/image/{id}")
async def visualize_palette(id: str):
    item = favorites.get(id.removesuffix(".png"))
    image = Image.new("RGB", (1755, 646))
    draw = ImageDraw.Draw(image)

    colors = [
        f"{item['colors']['1']}",
        f"{item['colors']['2']}",
        f"{item['colors']['3']}",
        f"{item['colors']['4']}",
        f"{item['colors']['5']}",
    ]

    for i, color in enumerate(colors):
        x_start = i * 351
        x_end = x_start + 351

        draw.rectangle([(x_start, 0), (x_end, 646)], fill=color)

    image_buffer = BytesIO()
    image.save(image_buffer, format="PNG")
    image_buffer.seek(0)

    return StreamingResponse(image_buffer, media_type="image/png")


# API


@app.get("/api/palette/{id}")
async def palette_api(id: str):
    item = favorites.get(id)
    return item


# App Actions


@app.post("/actions/random")
async def random_palette():
    data = palette_main()
    favorites.put(
        {
            "colors": {
                "1": f"{data[0]}",
                "2": f"{data[1]}",
                "3": f"{data[2]}",
                "4": f"{data[3]}",
                "5": f"{data[4]}",
            },
        }
    )
    return data


@app.post("/actions/text")
async def text_palette(request: fastapi.Request):
    res = await request.json()
    data = requests.get(
        f"https://palettes.deta.dev/text/palette?text={res['text']}"
    ).json()["colors"]
    favorites.put(
        {
            "colors": {
                "1": f"{data[0]}",
                "2": f"{data[1]}",
                "3": f"{data[2]}",
                "4": f"{data[3]}",
                "5": f"{data[4]}",
            },
            "prompt": f"{res['text']}",
        }
    )
    return data


@app.post("/actions/favorites")
async def favorites_search(request: fastapi.Request):
    res = await request.json()
    data = favorites.fetch(query=[{"prompt?contains": res["query"]}], limit=25).items
    return data


@app.post("/actions/image")
async def image_palette(request: fastapi.Request):
    res = await request.json()
    host = os.getenv("DETA_SPACE_APP_HOSTNAME")
    onspace = os.getenv("DETA_SPACE_APP")
    protocol = "https://" if onspace else "http://"
    return {
        "url": f"{protocol}{host}/image/{res['id']}.png",
        "type": "image",
        "name": "palette.png",
    }


@app.get("/__space/actions")
async def meta():
    return {
        "actions": [
            {"name": "random", "title": "Random Palette", "path": "/actions/random"},
            {
                "name": "text",
                "title": "Text Palette",
                "path": "/actions/text",
                "input": [{"name": "text", "type": "string"}],
            },
            {
                "name": "favorites",
                "title": "Search Favorites",
                "path": "/actions/favorites",
                "input": [{"name": "query", "type": "string"}],
            },
            {
                "name": "image",
                "title": "Image Palette",
                "path": "/actions/image",
                "input": [{"name": "id", "type": "string"}],
                "output": "@deta/file",
            },
        ]
    }
