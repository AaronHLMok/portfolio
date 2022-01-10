# !/bin/env python
import sys
from classes import *
from tracer import Render
from sphere import Sphere
from vector import Vector

def start(spec, spheres, lights, back, ambient):
    WIDTH = int(spec.res[0])
    HEIGHT = int(spec.res[1])
    camera = Vector(0, 0, -1)
    objects = []
    for i in spheres:
        p = Point(i.x, i.y, i.z)
        rgb = Color(i.rgb[0], i.rgb[1], i.rgb[2])
        temp = [Sphere(p, 0.5, rgb, i.specular, i.k)]
        objects.append(temp)

    scene = Scene(camera, objects[0], WIDTH, HEIGHT)
    tracer = Render()
    image = tracer.render(scene)

    with open("test.ppm", "w") as img_file:
        image.write_ppm(img_file)
    return None

"""Convert stored information into workable vectors"""
def process_into_list(spheres):
    li = []
    for i in spheres:
        color = Color(i.rgb[0], i.rgb[1], i.rgb[2])
        scale = Vectors(i.scl[0], i.scl[1], i.scl[2])
        temp = Sphere_obj(i.pos, color, scale, i.k, i.specular)
        li.append(temp)
    return li


def main():
    if len(sys.argv) != 2:
        print("Incorrect input, please try again")
        exit(0)
    try:
        f = open(sys.argv[1], 'r')
    except OSError:
        print("unable to open {}".format(sys.argv[1]))
        exit(1)

    file_name, sp, spheres, lights, back, ambient = read_file(f)

    start(sp, spheres, lights, back, ambient)

    #export to png here

    f.close()


def read_file(f):
    spec = []
    spheres = []
    lights = []
    back = []
    ambient = []
    out_name = ""

    for line in f.readlines():
        if line.rstrip() == "":
            continue
        if 'SPHERE' in line:
            s = Spheres_C()
            temp = line.rstrip().rsplit()
            s.get_info(temp[1:])
            spheres.append(s)
        elif 'LIGHT' in line:
            l = Light_C()
            temp = line.rstrip().rsplit()
            l.get_info(temp[1:])
            lights.append(l)
        elif 'BACK' in line:
            temp = line.rstrip().rsplit()
            back.append(temp[1:])
        elif 'AMBIENT' in line:
            temp = line.rstrip().rsplit()
            ambient.append(temp[1:])
        elif 'OUTPUT' in line:
            temp = line.rstrip().rsplit()
            out_name += temp[1]
        else:
            temp = line.rstrip().rsplit()
            spec += ([temp[1]])
            if 'RES' in temp[0]:
                spec.append(temp[2])

    sp = Specs_C()
    sp.get_info(spec)

    return out_name, sp, spheres, lights, back, ambient


if __name__ == '__main__':
    main()