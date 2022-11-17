from random import randbytes


def hex_to_rgb(hexa):
    return [int(hexa[i : i + 2], 16) for i in (0, 2, 4)]


def rgb_to_hex(colors: list):
    return "%02x%02x%02x" % colors


def random_color():
    return_color = hex_to_rgb(randbytes(3).hex())
    return return_color


def create_palette(colors: list, size):
    palette_list = []

    inverse = [
        abs(colors[0] - 255),
        abs(colors[1] - 255),
        abs(colors[2] - 255),
    ]

    for i in range(size):
        if i == size - 1:
            palette_list.append(inverse)
        else:
            cell = [
                abs(colors[0] - ((colors[0] - inverse[0]) // (size - 1)) * i),
                abs(colors[1] - ((colors[1] - inverse[1]) // (size - 1)) * i),
                abs(colors[2] - ((colors[2] - inverse[2]) // (size - 1)) * i),
            ]
            palette_list.append(cell)
    return palette_list


def hex_palette():
    colors = []
    for i in create_palette(random_color(), 5):
        colors.append(f"#{rgb_to_hex((i[0], i[1], i[2]))}")
    return colors
