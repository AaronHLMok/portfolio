/*
This assignment introduces an example concerning World War II capital ships.
It involves the following relations:

Classes(class, type, country, numGuns, bore, displacement)
Ships(name, class, launched)  --launched is for year launched
Battles(name, date_fought)
Outcomes(ship, battle, result)

Ships are built in "classes" from the same design, and the class is usually
named for the first ship of that class.

Relation Classes records the name of the class,
the type (bb for battleship or bc for battlecruiser),
the country that built the ship, the number of main guns,
the bore (diameter of the gun barrel, in inches)
of the main guns, and the displacement (weight, in tons).

Relation Ships records the name of the ship, the name of its class,
and the year in which the ship was launched.

Relation Battles gives the name and date of battles involving these ships.

Relation Outcomes gives the result (sunk, damaged, or ok)
for each ship in each battle.
*/


/*
Exercise 1. (1 point)

1.	Create simple SQL statements to create the above relations
    (no constraints for initial creations).*/

CREATE TABLE Classes(class text, type text, country text, numGuns numeric, bore numeric, displacement numeric);
CREATE TABLE Ships(ship_name text, class text, launched numeric);
CREATE TABLE Battles(battle_name text, date_fought date);
CREATE TABLE Outcomes(ship_name text, battle_name text, result text);

-- 2.Insert the following data.
-- Write your sql statements here.

insert into Classes (class, type, country, numGuns, bore, displacement)
values
('Bismarck','bb','Germany',8,15,42000),
('Kongo','bc','Japan',8,14,32000),
('North Carolina','bb','USA',9,16,37000),
('Renown','bc','Gt. Britain',6,15,32000),
('Revenge','bb','Gt. Britain',8,15,29000),
('Tennessee','bb','USA',12,14,32000),
('Yamato','bb','Japan',9,18,65000);

--For Ships
insert into Ships (ship_name, class, launched)
values
('California','Tennessee',1921),
('Haruna','Kongo',1915),
('Hiei','Kongo',1914),
('Iowa','Iowa',1943),
('Kirishima','Kongo',1914),
('Kongo','Kongo',1913),
('Missouri','Iowa',1944),
('Musashi','Yamato',1942),
('New Jersey','Iowa',1943),
('North Carolina','North Carolina',1941),
('Ramilles','Revenge',1917),
('Renown','Renown',1916),
('Repulse','Renown',1916),
('Resolution','Revenge',1916),
('Revenge','Revenge',1916),
('Royal Oak','Revenge',1916),
('Royal Sovereign','Revenge',1916),
('Tennessee','Tennessee',1920),
('Washington','North Carolina',1941),
('Wisconsin','Iowa',1944),
('Yamato','Yamato',1941);

--For Battles
insert into Battles(battle_name, date_fought)
values
('North Atlantic','27-May-1941'),
('Guadalcanal','15-Nov-1942'),
('North Cape','26-Dec-1943'),
('Surigao Strait','25-Oct-1944');

--For Outcomes
insert into Outcomes(ship_name, battle_name, result)
values
('Bismarck','North Atlantic', 'sunk'),
('California','Surigao Strait', 'ok'),
('Duke of York','North Cape', 'ok'),
('Fuso','Surigao Strait', 'sunk'),
('Hood','North Atlantic', 'sunk'),
('King George V','North Atlantic', 'ok'),
('Kirishima','Guadalcanal', 'sunk'),
('Prince of Wales','North Atlantic', 'damaged'),
('Rodney','North Atlantic', 'ok'),
('Scharnhorst','North Cape', 'sunk'),
('South Dakota','Guadalcanal', 'ok'),
('West Virginia','Surigao Strait', 'ok'),
('Yamashiro','Surigao Strait', 'sunk');

-- Write your sql statements here.


-- Exercise 2. (6 points)
-- Write SQL queries for the following requirements.

-- 1.	(2 pts) List the name, displacement, and number of guns of the ships engaged in the battle of Guadalcanal.
/*
Expected result:
ship,displacement,numguns
Kirishima,32000,8
South Dakota,NULL,NULL
*/

-- Write your query here.
SELECT t1.ship_name, t3.displacement, t3.numGuns
FROM
    (SELECT ship_name, battle_name FROM outcomes) t1
        LEFT JOIN
    (SELECT ship_name, class FROM Ships) t2
        ON t1.ship_name = t2.ship_name
        LEFT JOIN
    (SELECT class, displacement, numGuns FROM classes) t3
        ON t2.class = t3.class
WHERE t1.battle_name = 'Guadalcanal';



-- 2.	(2 pts) Find the names of the ships whose number of guns was the largest for those ships of the same bore.
-- Write your query here. from classes, find highest bore of same bore join with ships on class
-- I was not sure about ships with same numguns AND bore, so they are both printed
SELECT x.class, x.bore, x.numguns
FROM classes x
WHERE NOT EXISTS(
    SELECT bore, numguns
    FROM classes
    WHERE bore = x.bore AND numGuns > x.numguns)
ORDER BY x.numguns;


--3. (2 pts) Find for each class with at least three ships the number of ships of that class sunk in battle.
/*
class,sunk_ships
Revenge,0
Kongo,1
Iowa,0
*/

-- Write your query here. ship join outcomes
CREATE VIEW temp AS
SELECT t1.class, t2.result
FROM
    (SELECT * FROM ships) t1
        LEFT JOIN
    (SELECT ship_name, result FROM outcomes) t2
        ON t1.ship_name = t2.ship_name AND t2.result = 'sunk'
GROUP BY class, t2.result, t1.ship_name
ORDER BY class;

SELECT t1.class, sunk_ship
FROM
     (SELECT class, COUNT(result) AS sunk_ship, count(class) as c1 FROM temp GROUP BY class) t1
        WHERE c1 >= 3
GROUP BY t1.class, t1.sunk_ship
ORDER BY t1.class DESC;

drop view temp;


-- Exercise 3. (4 points)

-- Write the following modifications.

-- 1.	(2 points) Two of the three battleships of the Italian Vittorio Veneto class –
-- Vittorio Veneto and Italia – were launched in 1940;
-- the third ship of that class, Roma, was launched in 1942.
-- Each had 15-inch guns and a displacement of 41,000 tons.
-- Insert these facts into the database.

-- Write your sql statements here.
-- I looked up the number of guns on google, not sure if this was meant to be 'null'
INSERT INTO Classes(class, type, country, numGuns, bore, displacement)
values ('Vittorio Vento', 'bb', 'Italy', 9, 15, 41000);

INSERT into Ships(ship_name, class, launched)
values
('Vittorio Veneto', 'Vittorio Vento', 1940),
('Italia', 'Vittorio Vento', 1940),
('Roma', 'Vittorio Vento', 1942);

-- 2.(1 point) Delete all classes with fewer than three ships.

-- Write your sql statement here.
SELECT class, COUNT(class) as number_of_ships
FROM ships
GROUP BY class
ORDER BY number_of_ships DESC;

DELETE FROM Classes WHERE class = 'Yamato';
DELETE FROM Classes WHERE class = 'Tennessee';
DELETE FROM Classes WHERE class = 'Renown';
DELETE FROM Classes WHERE class = 'North Carolina';


-- 3.	(1 point) Modify the Classes relation so that gun bores are measured in centimeters
-- (one inch = 2.5 cm) and displacements are measured in metric tons (one metric ton = 1.1 ton).

-- Write your sql statement here.
UPDATE Classes
SET bore = bore*2.5;

Update Classes
SET displacement = displacement*1.1;

select *
from classes;

-- Exercise 4.  (9 points)
-- Add the following constraints using views with check option.

--1. (3 points) No ship can be in battle before it is launched.
-- Write your sql statement here.
CREATE VIEW OutcomesView AS
SELECT ship_name, battle_name, result
FROM Outcomes t1
WHERE NOT EXISTS(
    SELECT *
    FROM Ships S, Battles B
    WHERE s.ship_name = t1.ship_name AND b.battle_name = t1.battle_name
        AND S.launched > EXTRACT(year FROM B.date_fought)
) WITH CHECK OPTION;

drop view Outcomesview;

-- Now we can try some insertion on this view.
INSERT INTO OutcomesView (ship_name, battle_name, result)
VALUES('Musashi', 'North Atlantic','ok');
-- This insertion, as expected, should fail since Musashi is launched in 1942,
-- while the North Atlantic battle took place on 27-MAY-41.


-- 2. (3 points) No ship can be launched before
-- the ship that bears the name of the first ship’s class.

-- Write your sql statement here.
CREATE VIEW ShipsV AS
SELECT ship_name, class, launched
FROM Ships S
WHERE NOT EXISTS(
    SELECT *
    From Ships R
    WHERE R.ship_name = R.class AND r.class = s.class AND r.launched > s.launched
) WITH CHECK OPTION;

-- Now we can try some insertion on this view.
INSERT INTO ShipsV(ship_name, class, launched)
VALUES ('AAA','Kongo',1912);

DELETE FROM shipsV WHERE ship_name = 'AAA';
Drop View ShipsV;
-- This insertion, as expected, should fail since ship Kongo (first ship of class Kongo) is launched in 1913.


--3. (3 points) No ship fought in a battle that was at a later date than another battle in which that ship was sunk.

-- Write your sql statements here.
CREATE VIEW OutcomesV AS
SELECT ship_name, battle_name, result
FROM outcomes o
WHERE NOT EXISTS(
        SELECT *
        From battles b, outcomes out, battles b2
        WHERE out.result = 'sunk' AND b.battle_name = out.battle_name
        AND o.battle_name = b2.battle_name AND b2.date_fought > b.date_fought
    )WITH CHECK OPTION;

-- Now we can try some insertion on this view.
INSERT INTO OutcomesV(ship_name, battle_name, result)
VALUES('Bismarck', 'Guadalcanal', 'ok');

DELETE FROM OutcomesV WHERE ship_name = 'bismark' AND battle_name = 'guadalcanal';
DROP VIEW OutcomesV;
-- This insertion, as expected, should fail since 'Bismarck' was sunk in
-- the battle of North Atlantic, in 1941, whereas the battle of Guadalcanal happened in 1942.