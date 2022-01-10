from math import sqrt


class Sphere:

    def __init__(self, center, radius, material, specular, k):
        self.center = center
        self.radius = radius
        self.material = material
        self.specular = specular
        self.k = k

    def intersects(self, ray):
        sphere_to_ray = ray.origin - self.center
        b = 2 * ray.direction.dot_product(sphere_to_ray)
        c = sphere_to_ray.dot_product(sphere_to_ray) - self.radius * self.radius
        discriminant = b * b - 4 * c

        if discriminant >= 0:
            dist = (-b - sqrt(discriminant)) / 2
            if dist > 0:
                return dist
        return None
