/*I was not sure if the questions were asking the inclusive age eg <= or >= so I left it exclusive.
  The wording was:"under the age of 18" and "over the age of 30" and not "18 and under" or "30 and above."*/

/*Q1*/
SELECT name
FROM person
WHERE age < 18;

/*Q2*/
SELECT pizzeria, pizza, price
FROM frequents join serves using(pizzeria)
WHERE price < 10 AND name = 'Amy';

/*Q3*/
SELECT pizzeria, name, age
From person join frequents using(name)
WHERE age < 18;

/*Q4*/
SELECT pizzeria
FROM (person p1 join person p2 using (name, age) join frequents using (name))
WHERE p1.age < 18 AND p2.age > 30;

/*Q5*/
SELECT pizzeria, p1.name, p1.age, p2.name, p2.age
FROM (person p1 join person p2 using (name,age) join frequents using(name))
WHERE p1.age < 18 AND p2.age > 30;

/*Q6*/
SELECT name, Count(pizza) AS pcount
FROM eats
GROUP BY name
HAVING Count(pizza) >=2
ORDER BY pcount DESC;

/*Q7*/
SELECT pizza, AVG(price) AS avg_price
FROM serves
GROUP BY pizza
ORDER BY AVG(price) DESC;
