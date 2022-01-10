import struct
import math
from vector import Vector


class Color(Vector):
    pass


class Point(Vector):
    pass


class Scene:

    def __init__(self, camera, objects, width, height):
        self.camera = camera
        self.objects = objects
        self.width = width
        self.height = height


class Specs_C:
    near = None
    left = None
    right = None
    bot = None
    top = None
    res = None

    def __init__(self):
        self.near = 0
        self.left = 0
        self.right = 0
        self.bot = 0
        self.top = 0
        self.res = []

    def set_position(self, n, l, r, b, t):
        self.near = n
        self.left = l
        self.right = r
        self.bot = b
        self.top = t

    def set_res(self, res):
        self.res = res

    def get_info(self, info):
        for i in range(0, len(info)):
            info[i] = float(info[i])

        n = info[0]
        l = info[1]
        r = info[2]
        b = info[3]
        t = info[4]
        res = (info[5], info[6])
        self.set_position(n,l,r,b,t)
        self.set_res(res)


class Spheres_C:
    name = None
    pos = None
    scl = None
    rgb = None
    k = None
    specular = None
    x = None
    y = None
    z = None

    def __init__(self):
        self.name = 0
        self.pos = []
        self.scl =[]
        self.rgb = []
        self.k = []
        self.specular = 0

    def set_name(self, n):
        self.name = n

    def set_pos(self, p):
        self.pos = p
        self.x = p[0]
        self.y = p[1]
        self.z = p[2]

    def set_scl(self, s):
        self.scl = s

    def set_rgb(self, r):
        self.rgb = r

    def set_k(self, k):
        self.k = k

    def set_specular(self,s):
        self.specular = s

    def get_info(self, info):
        for i in range(1, len(info)):
            info[i] = float(info[i])

        name = info[0]
        pos = (info[1], info[2], info[3])
        scl = (info[4], info[5], info[6])
        rgb = (info[7], info[8], info[9])
        k = (info[10], info[11], info[12], info[13])
        spec = info[14]
        self.set_name(name)
        self.set_pos(pos)
        self.set_rgb(rgb)
        self.set_scl(scl)
        self.set_k(k)
        self.set_specular(spec)


class Light_C:
    name = None
    pos = None
    rgb = None
    x = None
    y = None
    z = None

    def __init__(self):
        self.name = None
        self.pos = []
        self.rgb = []

    def set_name(self, n):
        self.name = n

    def set_pos(self, p):
        self.pos = p
        self.x = p[0]
        self.y = p[1]
        self.z = p[2]

    def set_rgb(self, rgb):
        self.rgb = rgb

    def get_info(self, info):
        for i in range(1, len(info)):
            info[i] = float(info[i])

        n = info[0]
        pos = (info[1], info[2], info[3])
        rgb = (info[4], info[5], info[6])
        self.set_name(n)
        self.set_pos(pos)
        self.set_rgb(rgb)





