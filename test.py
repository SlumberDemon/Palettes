import random


def random_color():
    return_color = []
    for i in range(3):
        return_color.append(random.randint(0, 255))
    return return_color


def create_pallet(colors, size):
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


def rgb_to_hex(rgb):
    return "%02x%02x%02x" % rgb


for i in create_complimentary(random_color(), 5):
    print(i)
